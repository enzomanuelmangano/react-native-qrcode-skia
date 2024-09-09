import { transformMatrixIntoPath } from '../qrcode/transform-matrix-into-path';

const mockMatrix = [
  [1, 0, 1],
  [0, 1, 0],
  [1, 0, 1],
] as (0 | 1)[][];

const size = 300;
describe('transformMatrixIntoPath', () => {
  it('should return an object with cellSize and path properties', () => {
    const result = transformMatrixIntoPath(mockMatrix, size);
    expect(result).toHaveProperty('cellSize');
    expect(result).toHaveProperty('path');
    expect(typeof result.cellSize).toBe('number');
    expect(typeof result.path).toBe('string');
  });

  it('should calculate correct cellSize', () => {
    const result = transformMatrixIntoPath(mockMatrix, size);
    expect(result.cellSize).toBe(size / mockMatrix.length);
  });

  it('should generate a non-empty path string', () => {
    const result = transformMatrixIntoPath(mockMatrix, size);
    expect(result.path.length).toBeGreaterThan(0);
  });

  it('should handle different shape options', () => {
    const shapes = [
      'square',
      'circle',
      'rounded',
      'diamond',
      'triangle',
      'star',
    ];
    shapes.forEach((shape) => {
      const result = transformMatrixIntoPath(mockMatrix, size, {
        shape: shape as any,
      });
      expect(result.path.length).toBeGreaterThan(0);
    });
  });

  it('should respect the logoSize option', () => {
    const resultWithoutLogo = transformMatrixIntoPath(mockMatrix, size);
    const resultWithLogo = transformMatrixIntoPath(mockMatrix, size, {
      logoSize: 1,
    });
    expect(resultWithoutLogo.path.length).toBeGreaterThan(
      resultWithLogo.path.length
    );
  });

  it('should apply detectionPatternPadding', () => {
    const resultWithoutPadding = transformMatrixIntoPath(mockMatrix, size);
    const resultWithPadding = transformMatrixIntoPath(mockMatrix, size, {
      detectionPatternPadding: 10,
    });
    expect(resultWithoutPadding.path.length).not.toBe(
      resultWithPadding.path.length
    );
  });
});
