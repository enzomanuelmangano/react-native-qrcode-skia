import { encode, type ErrorCorrectionLevelType, type Modules } from './encoder';

export type { ErrorCorrectionLevelType, Modules };

// The QR code modules of a value, row by row in a flat array (1 = dark).
const generateModules = (
  value: string,
  errorCorrectionLevel: ErrorCorrectionLevelType
): Modules => encode(value, errorCorrectionLevel);

// The same modules as a matrix of rows:
// [[1, 1, 1, 1, 1, 1, 1, 0, 1, 0, ...],
//  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, ...], ...]
const generateMatrix = (
  value: string,
  errorCorrectionLevel: ErrorCorrectionLevelType
) => {
  const { size, data } = generateModules(value, errorCorrectionLevel);
  const matrix: (1 | 0)[][] = [];
  for (let i = 0; i < size; i++) {
    const row: (1 | 0)[] = [];
    for (let j = 0; j < size; j++) row.push(data[i * size + j] ? 1 : 0);
    matrix.push(row);
  }
  return matrix;
};

export { generateMatrix, generateModules };
