import { generateMatrix } from '../qrcode/generate-matrix';

describe('generateMatrix', () => {
  it('should generate a matrix for a given value and error correction level', () => {
    const value = 'Test QR Code';
    const errorCorrectionLevel = 'M';
    const matrix = generateMatrix(value, errorCorrectionLevel);

    // Check if the result is a 2D array
    expect(Array.isArray(matrix)).toBe(true);
    expect(Array.isArray(matrix[0])).toBe(true);

    // Check if all elements are either 0 or 1
    matrix.forEach((row) => {
      row.forEach((cell) => {
        expect(cell === 0 || cell === 1).toBe(true);
      });
    });

    // Check if the matrix is square
    const size = matrix.length;
    matrix.forEach((row) => {
      expect(row.length).toBe(size);
    });
  });

  it('should generate different matrices for different values', () => {
    const value1 = 'Test QR Code 1';
    const value2 = 'Test QR Code 2';
    const errorCorrectionLevel = 'H';

    const matrix1 = generateMatrix(value1, errorCorrectionLevel);
    const matrix2 = generateMatrix(value2, errorCorrectionLevel);

    // Check if the matrices are different
    expect(matrix1).not.toEqual(matrix2);
  });

  it('should generate different matrices for different error correction levels', () => {
    const value = 'Test QR Code';
    const errorCorrectionLevel1 = 'L';
    const errorCorrectionLevel2 = 'H';

    const matrix1 = generateMatrix(value, errorCorrectionLevel1);
    const matrix2 = generateMatrix(value, errorCorrectionLevel2);

    // Check if the matrices are different
    expect(matrix1).not.toEqual(matrix2);
  });
});
