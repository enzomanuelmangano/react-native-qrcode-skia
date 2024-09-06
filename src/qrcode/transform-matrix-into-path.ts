type ShapeOptions = {
  shape?: 'square' | 'circle' | 'rounded' | 'diamond' | 'triangle';
  cornerRadius?: number;
  detectionPatternShape?:
    | 'square'
    | 'circle'
    | 'rounded'
    | 'diamond'
    | 'triangle';
};

const transformMatrixIntoPath = (
  matrix: (1 | 0)[][],
  size: number,
  options: ShapeOptions = {
    shape: 'diamond',
    cornerRadius: 30,
    detectionPatternShape: 'rounded',
  }
) => {
  const {
    shape = 'square',
    cornerRadius = 0,
    detectionPatternShape = 'square',
  } = options;
  const cellSize = size / matrix.length;
  let path = '';

  const getCorners = (i: number, j: number): Corners => {
    const x = j * cellSize;
    const y = i * cellSize;
    const center = { x: x + cellSize / 2, y: y + cellSize / 2 };
    const offset = Math.min(cornerRadius, cellSize / 2);
    return {
      q1: { x: x + cellSize, y },
      q2: { x: x + cellSize, y: y + cellSize },
      q3: { x, y: y + cellSize },
      q4: { x, y },
      d1: { x: x + cellSize - offset, y },
      d2: { x: x + cellSize, y: y + cellSize - offset },
      d3: { x: x + offset, y: y + cellSize },
      d4: { x, y: y + offset },
      center,
    };
  };

  const getNeighbors = (i: number, j: number): Neighbors => ({
    top: i > 0 && matrix[i - 1][j] === 1,
    right: j < matrix.length - 1 && matrix[i][j + 1] === 1,
    bottom: i < matrix.length - 1 && matrix[i + 1][j] === 1,
    left: j > 0 && matrix[i][j - 1] === 1,
  });

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

    switch (currentShape) {
      case 'circle':
        return `M${center.x} ${center.y} m-${cellSize / 2}, 0 a${cellSize / 2},${cellSize / 2} 0 1,0 ${cellSize},0 a${cellSize / 2},${cellSize / 2} 0 1,0 -${cellSize},0`;
      case 'rounded':
        return renderRoundedSquare(corners, neighbors, cornerRadius > 0);
      case 'diamond':
        return renderDiamond(corners);
      case 'triangle':
        return renderTriangle(corners);
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

  matrix.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 1) {
        const corners = getCorners(i, j);
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
