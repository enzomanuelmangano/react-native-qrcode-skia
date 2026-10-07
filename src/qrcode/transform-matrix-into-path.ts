export type BaseShapeOptions =
  | 'square'
  | 'circle'
  | 'rounded'
  | 'diamond'
  | 'triangle'
  | 'star';

export type ShapeOptions = {
  shape?: BaseShapeOptions;
  eyePatternShape?: BaseShapeOptions;
  gap?: number;
  eyePatternGap?: number;
};

// Performance notes
//
// Every coordinate of a cell is `column/row offset + a constant`, so instead of
// computing and stringifying ~20 numbers per cell, each distinct coordinate is
// computed once per column (x) and once per row (y), using the exact same
// arithmetic as before, and stringified once into a lookup table. Building the
// path is then plain string concatenation.
//
// Skia parses SVG numbers into 32-bit floats, so each number is printed with
// the fewest digits that parse back to the same float32 (instead of the 17
// digits of a double). The resulting SkPath is bit-identical to printing the
// full double, while the SVG string is several times smaller to build, send
// over JSI and parse.

const { fround } = Math;

// Shortest decimal string that parses to the same float32 as `value`.
// Memoized: tables of different styles and sizes share most of their values.
const formatted = new Map<number, string>();
const formatNumber = (value: number): string => {
  let result = formatted.get(value);
  if (result !== undefined) return result;
  const target = fround(value);
  result = String(target);
  if (!Number.isInteger(target)) {
    for (let precision = 1; precision < 10; precision++) {
      const candidate = target.toPrecision(precision);
      if (
        candidate.indexOf('e') === -1 &&
        fround(Number(candidate)) === target
      ) {
        result = candidate;
        break;
      }
    }
  }
  if (formatted.size > 20000) formatted.clear();
  formatted.set(value, result);
  return result;
};

const STAR_POINTS = 10;
const STAR_COS: number[] = [];
const STAR_SIN: number[] = [];
for (let k = 0; k < STAR_POINTS; k++) {
  const angle = (Math.PI / 5) * k - Math.PI / 2;
  STAR_COS.push(Math.cos(angle));
  STAR_SIN.push(Math.sin(angle));
}

// Per-axis coordinate tables for one cell style (regular cells or eyes).
// `start + i` indexes a column (x) or a row (y). Entries mirror the corner
// points of a cell: `a` = far edge, `b` = near edge, `c`/`d` = edge midpoints,
// `m` = center.
// Only the entries a shape uses are computed.
type AxisTable = {
  a: string[];
  b: string[];
  c: string[];
  d: string[];
  m: string[];
  // Star vertices, flattened as [cell * STAR_POINTS + k].
  star: string[];
};

type Entry = keyof AxisTable;

const ENTRIES: Record<BaseShapeOptions, Entry[]> = {
  square: ['a', 'b'],
  circle: ['m'],
  rounded: ['a', 'b', 'c', 'd'],
  diamond: ['a', 'b', 'm'],
  triangle: ['a', 'b', 'm'],
  star: ['b', 'm', 'star'],
};

const buildAxisTable = (
  entries: Entry[],
  count: number,
  cellSize: number,
  cellGap: number,
  trig: number[]
): AxisTable => {
  const padding = cellGap / 2;
  const effectiveCellSize = cellSize - cellGap;
  const offset = effectiveCellSize / 2;
  const outerRadius = (cellSize - cellGap) / 2;
  const innerRadius = outerRadius * 0.4;
  const table: AxisTable = { a: [], b: [], c: [], d: [], m: [], star: [] };
  for (const entry of entries) {
    const values = table[entry];
    for (let i = 0; i < count; i++) {
      const origin = i * cellSize;
      switch (entry) {
        case 'a':
          values.push(formatNumber(origin + cellSize - padding));
          break;
        case 'b':
          values.push(formatNumber(origin + padding));
          break;
        case 'c':
          values.push(formatNumber(origin + cellSize - padding - offset));
          break;
        case 'd':
          values.push(formatNumber(origin + padding + offset));
          break;
        case 'm':
          values.push(formatNumber(origin + cellSize / 2));
          break;
        case 'star': {
          const center = origin + cellSize / 2;
          for (let k = 0; k < STAR_POINTS; k++) {
            const radius = k % 2 === 0 ? outerRadius : innerRadius;
            values.push(formatNumber(center + radius * trig[k]!));
          }
          break;
        }
      }
    }
  }
  return table;
};

type CellStyle = {
  shape: BaseShapeOptions;
  x: AxisTable;
  y: AxisTable;
  // Constant suffix of the circle command (relative arcs), per style.
  circleTail: string;
};

// Tables only depend on the shape and the grid, so QR codes of the same size
// and version (e.g. a list) share them.
const cellStyleCache = new Map<string, CellStyle>();

const buildCellStyle = (
  shape: BaseShapeOptions,
  count: number,
  cellSize: number,
  cellGap: number
): CellStyle => {
  const key = `${shape}|${count}|${cellSize}|${cellGap}`;
  const cached = cellStyleCache.get(key);
  if (cached) return cached;

  const entries = ENTRIES[shape] ?? ENTRIES.square;
  const effectiveCellSize = cellSize - cellGap;
  const radius = formatNumber(effectiveCellSize / 2);
  const diameter = formatNumber(effectiveCellSize);
  const style: CellStyle = {
    shape,
    x: buildAxisTable(entries, count, cellSize, cellGap, STAR_COS),
    y: buildAxisTable(entries, count, cellSize, cellGap, STAR_SIN),
    circleTail: ` m-${radius},0 a${radius},${radius} 0 1,0 ${diameter},0 a${radius},${radius} 0 1,0 -${diameter},0`,
  };
  if (cellStyleCache.size >= 16) cellStyleCache.clear();
  cellStyleCache.set(key, style);
  return style;
};

const renderCell = (
  style: CellStyle,
  i: number,
  j: number,
  top: boolean,
  right: boolean,
  bottom: boolean,
  left: boolean
): string => {
  const { x, y } = style;
  switch (style.shape) {
    case 'circle':
      return `M${x.m[j]} ${y.m[i]}${style.circleTail}`;
    case 'rounded': {
      // Corner points: q1 = (a, b) top-right, q2 = (a, a) bottom-right,
      // q3 = (b, a) bottom-left, q4 = (b, b) top-left (x, y tables).
      // Edge midpoints: d1 = (c, b), d2 = (a, c), d3 = (d, a), d4 = (b, d).
      const xa = x.a[j];
      const xb = x.b[j];
      const ya = y.a[i];
      const yb = y.b[i];
      const d1 = `${x.c[j]} ${yb}`;
      const d2 = `${xa} ${y.c[i]}`;
      const d3 = `${x.d[j]} ${ya}`;
      const d4 = `${xb} ${y.d[i]}`;
      return (
        `M${d1}` +
        (top || right ? `L${xa} ${yb}L${d2}` : `L${d1}Q${xa} ${yb} ${d2}`) +
        (right || bottom ? `L${xa} ${ya}L${d3}` : `L${d2}Q${xa} ${ya} ${d3}`) +
        (bottom || left ? `L${xb} ${ya}L${d4}` : `L${d3}Q${xb} ${ya} ${d4}`) +
        (left || top ? `L${xb} ${yb}L${d1}` : `L${d4}Q${xb} ${yb} ${d1}`)
      );
    }
    case 'diamond':
      return `M${x.m[j]} ${y.b[i]}L${x.a[j]} ${y.m[i]}L${x.m[j]} ${y.a[i]}L${x.b[j]} ${y.m[i]}Z`;
    case 'triangle':
      return `M${x.m[j]} ${y.b[i]}L${x.a[j]} ${y.a[i]}L${x.b[j]} ${y.a[i]}Z`;
    case 'star': {
      const xs = x.star!;
      const ys = y.star!;
      let path = `M${x.m[j]} ${y.b[i]}`;
      for (let k = 0; k < STAR_POINTS; k++) {
        path += `L${xs[j * STAR_POINTS + k]} ${ys[i * STAR_POINTS + k]}`;
      }
      return path + 'Z';
    }
    case 'square':
    default:
      return `M${x.b[j]} ${y.b[i]}H${x.a[j]}V${y.a[i]}H${x.b[j]}Z`;
  }
};

const isDetectionPattern = (i: number, j: number, n: number): boolean =>
  (i < 7 && j < 7) || (i < 7 && j >= n - 7) || (i >= n - 7 && j < 7);

// Returns a predicate telling whether the cell (i, j) is cleared for the logo.
const createLogoAreaTest = (
  logoSize: number,
  n: number,
  cellSize: number,
  logoAreaBorderRadius: number
): ((i: number, j: number) => boolean) | null => {
  if (logoSize === 0) return null;

  const center = Math.floor(n / 2);
  const logoRadius = Math.floor(logoSize / cellSize / 2);
  const logoAreaX = (center - logoRadius) * cellSize;
  const logoAreaY = (center - logoRadius) * cellSize;
  const logoAreaSize = (logoRadius * 2 + 1) * cellSize;
  const radius = Math.min(logoAreaBorderRadius, logoAreaSize / 2);

  // Simple square check when no border radius
  if (logoAreaBorderRadius === 0) {
    return (i, j) =>
      i >= center - logoRadius &&
      i <= center + logoRadius &&
      j >= center - logoRadius &&
      j <= center + logoRadius;
  }

  return (i, j) => {
    const cellCenterX = j * cellSize + cellSize / 2;
    const cellCenterY = i * cellSize + cellSize / 2;

    // Center rectangle (excluding corners)
    if (
      cellCenterX >= logoAreaX + radius &&
      cellCenterX <= logoAreaX + logoAreaSize - radius &&
      cellCenterY >= logoAreaY &&
      cellCenterY <= logoAreaY + logoAreaSize
    )
      return true;

    if (
      cellCenterY >= logoAreaY + radius &&
      cellCenterY <= logoAreaY + logoAreaSize - radius &&
      cellCenterX >= logoAreaX &&
      cellCenterX <= logoAreaX + logoAreaSize
    )
      return true;

    // Corner circle checks
    const inCornerCircle = (cx: number, cy: number): boolean => {
      const dx = cellCenterX - cx;
      const dy = cellCenterY - cy;
      return dx * dx + dy * dy <= radius * radius;
    };

    // Top-left
    if (cellCenterX < logoAreaX + radius && cellCenterY < logoAreaY + radius)
      return inCornerCircle(logoAreaX + radius, logoAreaY + radius);

    // Top-right
    if (
      cellCenterX > logoAreaX + logoAreaSize - radius &&
      cellCenterY < logoAreaY + radius
    )
      return inCornerCircle(
        logoAreaX + logoAreaSize - radius,
        logoAreaY + radius
      );

    // Bottom-right
    if (
      cellCenterX > logoAreaX + logoAreaSize - radius &&
      cellCenterY > logoAreaY + logoAreaSize - radius
    )
      return inCornerCircle(
        logoAreaX + logoAreaSize - radius,
        logoAreaY + logoAreaSize - radius
      );

    // Bottom-left
    if (
      cellCenterX < logoAreaX + radius &&
      cellCenterY > logoAreaY + logoAreaSize - radius
    )
      return inCornerCircle(
        logoAreaX + radius,
        logoAreaY + logoAreaSize - radius
      );

    return false;
  };
};

// Builds the SVG path of a QR code from its modules, stored row by row in a
// flat array of `n * n` 0/1 values.
const modulesToPath = (
  modules: ArrayLike<number>,
  n: number,
  size: number,
  options: ShapeOptions = {},
  logoSize: number = 0,
  logoAreaBorderRadius: number = 0
): { cellSize: number; path: string } => {
  const {
    shape = 'rounded',
    eyePatternShape = 'rounded',
    gap = 0,
    eyePatternGap = 0,
  } = options;
  const cellSize = size / n;
  const isLogoArea = createLogoAreaTest(
    logoSize,
    n,
    cellSize,
    logoAreaBorderRadius
  );

  const cellStyle = buildCellStyle(shape, n, cellSize, gap);
  // Eyes only cover the first and last 7 rows/columns, but tables are indexed
  // by absolute position, so they span the whole axis.
  const eyeStyle = buildCellStyle(eyePatternShape, n, cellSize, eyePatternGap);

  const parts: string[] = [];
  for (let i = 0; i < n; i++) {
    const row = i * n;
    for (let j = 0; j < n; j++) {
      if (modules[row + j] !== 1 || (isLogoArea && isLogoArea(i, j))) continue;
      parts.push(
        renderCell(
          isDetectionPattern(i, j, n) ? eyeStyle : cellStyle,
          i,
          j,
          i > 0 && modules[row - n + j] === 1,
          j < n - 1 && modules[row + j + 1] === 1,
          i < n - 1 && modules[row + n + j] === 1,
          j > 0 && modules[row + j - 1] === 1
        )
      );
    }
  }

  return { cellSize, path: parts.join('') };
};

const transformMatrixIntoPath = (
  matrix: (1 | 0)[][],
  size: number,
  options?: ShapeOptions,
  logoSize?: number,
  logoAreaBorderRadius?: number
) =>
  modulesToPath(
    matrix.flat(),
    matrix.length,
    size,
    options,
    logoSize,
    logoAreaBorderRadius
  );

export { modulesToPath, transformMatrixIntoPath };
