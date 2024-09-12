export type BaseShapeOptions =
  | 'square'
  | 'circle'
  | 'rounded'
  | 'diamond'
  | 'triangle'
  | 'star';

export type ShapeOptions = {
  shape?: BaseShapeOptions;
  cornerRadius?: number;
  detectionPatternShape?: BaseShapeOptions;
  logoSize?: number;
  internalPadding?: number;
  detectionPatternPadding?: number;
};

const defaultShapeOptions: ShapeOptions = {
  shape: 'rounded',
  cornerRadius: 20,
  detectionPatternShape: 'rounded',
  logoSize: 0,
  internalPadding: 0,
  detectionPatternPadding: 0,
};

type Point = {
  x: number;
  y: number;
};

type Corners = {
  q1: Point;
  q2: Point;
  q3: Point;
  q4: Point;
  d1: Point;
  d2: Point;
  d3: Point;
  d4: Point;
  center: Point;
};

type Neighbors = {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
};

const transformMatrixIntoPath = (
  matrix: (1 | 0)[][],
  size: number,
  options: ShapeOptions = defaultShapeOptions
) => {
  const {
    shape = 'rounded',
    cornerRadius = 30,
    detectionPatternShape = 'rounded',
    logoSize = 0,
    internalPadding = 0,
    detectionPatternPadding = 0,
  } = options;
  const cellSize = size / matrix.length;
  let path = '';

  const getCorners = (
    i: number,
    j: number,
    isDetectionPattern: boolean
  ): Corners => {
    const x = j * cellSize;
    const y = i * cellSize;
    const padding = isDetectionPattern
      ? detectionPatternPadding / 2
      : internalPadding / 2;
    const center = { x: x + cellSize / 2, y: y + cellSize / 2 };
    const effectiveCellSize =
      cellSize -
      (isDetectionPattern ? detectionPatternPadding : internalPadding);
    const offset = Math.min(cornerRadius, effectiveCellSize / 2);
    return {
      q1: { x: x + cellSize - padding, y: y + padding },
      q2: { x: x + cellSize - padding, y: y + cellSize - padding },
      q3: { x: x + padding, y: y + cellSize - padding },
      q4: { x: x + padding, y: y + padding },
      d1: { x: x + cellSize - padding - offset, y: y + padding },
      d2: { x: x + cellSize - padding, y: y + cellSize - padding - offset },
      d3: { x: x + padding + offset, y: y + cellSize - padding },
      d4: { x: x + padding, y: y + padding + offset },
      center,
    };
  };

  const getNeighbors = (i: number, j: number): Neighbors => ({
    top: i > 0 && matrix[i - 1]?.[j] === 1,
    right: j < matrix.length - 1 && matrix[i]?.[j + 1] === 1,
    bottom: i < matrix.length - 1 && matrix[i + 1]?.[j] === 1,
    left: j > 0 && matrix[i]?.[j - 1] === 1,
  });

  const isLogoArea = (i: number, j: number): boolean => {
    if (logoSize === 0) return false;
    const center = Math.floor(matrix.length / 2);
    const logoRadius = Math.floor(logoSize / 2);
    return (
      i >= center - logoRadius &&
      i <= center + logoRadius &&
      j >= center - logoRadius &&
      j <= center + logoRadius
    );
  };

  const renderElement = (
    corners: Corners,
    neighbors: Neighbors,
    i: number,
    j: number
  ): string => {
    const { q1, q2, q3, q4, center } = corners;
    const isDetectionPattern =
      (i < 7 && j < 7) ||
      (i < 7 && j >= matrix.length - 7) ||
      (i >= matrix.length - 7 && j < 7);
    const currentShape = isDetectionPattern ? detectionPatternShape : shape;
    const effectiveCellSize =
      cellSize -
      (isDetectionPattern ? detectionPatternPadding : internalPadding);

    switch (currentShape) {
      case 'circle':
        return `M${center.x} ${center.y} m-${effectiveCellSize / 2}, 0 a${effectiveCellSize / 2},${effectiveCellSize / 2} 0 1,0 ${effectiveCellSize},0 a${effectiveCellSize / 2},${effectiveCellSize / 2} 0 1,0 -${effectiveCellSize},0`;
      case 'rounded':
        return renderRoundedSquare(corners, neighbors, cornerRadius > 0);
      case 'diamond':
        return renderDiamond(corners);
      case 'triangle':
        return renderTriangle(corners);
      case 'star':
        return renderStar(corners, isDetectionPattern);
      case 'square':
      default:
        return `M${q4.x} ${q4.y} H${q1.x} V${q2.y} H${q3.x} Z`;
    }
  };

  const renderRoundedSquare = (
    corners: Corners,
    neighbors: Neighbors,
    useRadius: boolean
  ): string => {
    const { q1, q2, q3, q4, d1, d2, d3, d4 } = corners;

    const d1d2 =
      neighbors.top || neighbors.right || !useRadius
        ? `L${q1.x} ${q1.y} L${d2.x} ${d2.y}`
        : `L${d1.x} ${d1.y} Q${q1.x} ${q1.y} ${d2.x} ${d2.y}`;

    const d2d3 =
      neighbors.right || neighbors.bottom || !useRadius
        ? `L${q2.x} ${q2.y} L${d3.x} ${d3.y}`
        : `L${d2.x} ${d2.y} Q${q2.x} ${q2.y} ${d3.x} ${d3.y}`;

    const d3d4 =
      neighbors.bottom || neighbors.left || !useRadius
        ? `L${q3.x} ${q3.y} L${d4.x} ${d4.y}`
        : `L${d3.x} ${d3.y} Q${q3.x} ${q3.y} ${d4.x} ${d4.y}`;

    const d4d1 =
      neighbors.left || neighbors.top || !useRadius
        ? `L${q4.x} ${q4.y} L${d1.x} ${d1.y}`
        : `L${d4.x} ${d4.y} Q${q4.x} ${q4.y} ${d1.x} ${d1.y}`;

    return `M${d1.x} ${d1.y} ${d1d2} ${d2d3} ${d3d4} ${d4d1}`;
  };

  const renderDiamond = (corners: Corners): string => {
    const { center, q1, q2, q3, q4 } = corners;
    return `M${center.x} ${q4.y} L${q1.x} ${center.y} L${center.x} ${q2.y} L${q3.x} ${center.y} Z`;
  };

  const renderTriangle = (corners: Corners): string => {
    const { center, q1, q2, q3, q4 } = corners;
    return `M${center.x} ${q4.y} L${q1.x} ${q2.y} L${q3.x} ${q3.y} Z`;
  };

  const renderStar = (
    corners: Corners,
    isDetectionPattern: boolean
  ): string => {
    const { center, q4 } = corners;
    const outerRadius =
      (cellSize -
        (isDetectionPattern ? detectionPatternPadding : internalPadding)) /
      2;
    const innerRadius = outerRadius * 0.4;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    let path = `M${center.x} ${q4.y}`;
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI / 5) * i - Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = center.x + radius * Math.cos(angle);
      const y = center.y + radius * Math.sin(angle);
      path += ` L${x} ${y}`;
    }
    return path + ' Z';
  };

  matrix.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 1 && !isLogoArea(i, j)) {
        const isDetectionPattern =
          (i < 7 && j < 7) ||
          (i < 7 && j >= matrix.length - 7) ||
          (i >= matrix.length - 7 && j < 7);
        const corners = getCorners(i, j, isDetectionPattern);
        const neighbors = getNeighbors(i, j);
        path += renderElement(corners, neighbors, i, j);
      }
    });
  });

  return {
    cellSize,
    path,
  };
};

export { transformMatrixIntoPath };
