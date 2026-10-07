import { generateMatrix } from '../qrcode/generate-matrix';
import { transformMatrixIntoPath } from '../qrcode/transform-matrix-into-path';
import { transformMatrixIntoPath as referencePath } from '../__fixtures__/reference-path';

// The optimized path builder prints numbers with the fewest digits that parse
// to the same 32-bit float, which is how Skia stores path coordinates. Both
// paths must therefore have the same commands and the same float32 values.

const tokenize = (path: string) =>
  path.match(/[A-Za-z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) ?? [];

const expectSameGeometry = (actual: string, expected: string) => {
  const a = tokenize(actual);
  const b = tokenize(expected);
  expect(a.length).toBe(b.length);
  for (let i = 0; i < a.length; i++) {
    const x = a[i]!;
    const y = b[i]!;
    if (/[A-Za-z]/.test(y)) {
      if (x !== y) throw new Error(`command ${i}: ${x} !== ${y}`);
    } else if (!Object.is(Math.fround(Number(x)), Math.fround(Number(y)))) {
      throw new Error(`number ${i}: ${x} !== ${y}`);
    }
  }
};

const SHAPES = [
  'square',
  'circle',
  'rounded',
  'diamond',
  'triangle',
  'star',
] as const;

describe('path', () => {
  const values = [
    'a',
    'https://qrcode.reactiive.io',
    'https://github.com/enzomanuelmangano/react-native-qrcode-skia?q=' +
      'z'.repeat(80),
  ];

  it.each(values)('matches the reference geometry for %j', (value) => {
    const matrix = generateMatrix(value, 'H');
    for (const size of [80, 333.33]) {
      for (const shape of SHAPES) {
        for (const eyePatternShape of [shape, 'rounded'] as const) {
          for (const gap of [0, 0.7]) {
            for (const [logo, radius] of [
              [0, 0],
              [70, 12],
            ] as const) {
              const options = {
                shape,
                eyePatternShape,
                gap,
                eyePatternGap: gap * 1.5,
              };
              expectSameGeometry(
                transformMatrixIntoPath(matrix, size, options, logo, radius)
                  .path,
                referencePath(matrix, size, options, logo, radius).path
              );
            }
          }
        }
      }
    }
  });

  it('uses the same defaults as the reference', () => {
    const matrix = generateMatrix('defaults', 'M');
    expectSameGeometry(
      transformMatrixIntoPath(matrix, 120).path,
      referencePath(matrix, 120).path
    );
  });
});
