// The purpose of this function is to generate a path from a matrix of 1s and 0s.
// The path is used later to generate a QR code.
// Since we have a Path, we can easily use Skia in order to draw the QR code after that.

// Deeply Inspired by https://github.com/awesomejerry/react-native-qrcode-svg/blob/master/src/transformMatrixIntoPath.js
type Point = { x: number; y: number };
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

type ShapeOptions = {
  shape?: 'square' | 'circle' | 'rounded';
  cornerRadius?: number;
};

const transformMatrixIntoPath = (
  matrix: (1 | 0)[][],
  size: number,
  options: ShapeOptions = {
    shape: 'circle',
    cornerRadius: 30,
  }
) => {
  const { shape = 'square', cornerRadius = 0 } = options;
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

  const renderElement = (corners: Corners, neighbors: Neighbors): string => {
    const { q1, q2, q3, q4, d1, d2, d3, d4, center } = corners;

    switch (shape) {
      case 'circle':
        return `M${center.x} ${center.y} m-${cellSize / 2}, 0 a${cellSize / 2},${cellSize / 2} 0 1,0 ${cellSize},0 a${cellSize / 2},${cellSize / 2} 0 1,0 -${cellSize},0`;
      case 'rounded':
        // Use existing rounded corner logic
        return renderRoundedSquare(corners, neighbors, cornerRadius > 0);
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

  matrix.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 1) {
        const corners = getCorners(i, j);
        const neighbors = getNeighbors(i, j);
        path += renderElement(corners, neighbors);
      }
    });
  });

  return {
    cellSize,
    path,
  };
};

export { transformMatrixIntoPath };
