/* eslint-disable no-bitwise */
import { createHash } from 'crypto';
import { encodeSymbol } from '../qrcode/encoder';
import fixtures from '../__fixtures__/qrcode-symbols.json';

// The encoder is a port of `qrcode@1.5.3`: it must produce exactly the same
// symbols. The fixtures were generated with `qrcode` itself, see
// scripts/generate-encoder-fixtures.mjs.

type Value =
  | string
  | { repeat: string; count: number }
  | { mixed: number }
  | { seed: number; length: number };

type Fixture = {
  value: Value;
  level: string;
  error?: string;
  size?: number;
  version?: number;
  maskPattern?: number;
  penalties?: number[];
  hash?: string;
};

// Same as `expand` in scripts/generate-encoder-fixtures.mjs.
const POOLS = [
  '0123456789',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:',
  'abcdefghijklmnopqrstuvwxyz?=&_#@!',
  'àèé€漢字テスト🐨ßΩ',
];

const random = (seed: number) => () =>
  (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;

const expand = (value: Value): string => {
  if (typeof value === 'string') return value;
  if ('repeat' in value) return value.repeat.repeat(value.count);
  let result = '';
  if ('mixed' in value) {
    const next = random(value.mixed);
    const runs = 1 + Math.floor(next() * 10);
    for (let r = 0; r < runs; r++) {
      const pool = Array.from(POOLS[Math.floor(next() * POOLS.length)]!);
      const length = 1 + Math.floor(next() ** 2 * 40);
      for (let i = 0; i < length; i++) {
        result += pool[Math.floor(next() * pool.length)];
      }
    }
    return result;
  }
  const next = random(value.seed);
  const pool = POOLS[1]! + POOLS[2]!;
  for (let i = 0; i < value.length; i++) {
    result += pool[Math.floor(next() * pool.length)];
  }
  return result;
};

const encode = (value: string, level: string): Omit<Fixture, 'value'> => {
  try {
    const symbol = encodeSymbol(value, level as 'L');
    return {
      level,
      size: symbol.size,
      version: symbol.version,
      maskPattern: symbol.maskPattern,
      penalties: symbol.penalties,
      hash: createHash('sha256').update(symbol.data).digest('hex').slice(0, 16),
    };
  } catch (error) {
    return { level, error: String((error as Error).message).trim() };
  }
};

describe('encoder', () => {
  it('covers all versions and mask patterns', () => {
    const symbols = (fixtures as Fixture[]).filter((f) => !f.error);
    expect(new Set(symbols.map((f) => f.version)).size).toBe(40);
    expect(new Set(symbols.map((f) => f.maskPattern)).size).toBe(8);
  });

  it('rejects non-string values like qrcode', () => {
    for (const value of [123, 0, null, {}]) {
      expect(() => encodeSymbol(value as unknown as string, 'M')).toThrow(
        'Invalid data'
      );
    }
  });

  it.each(fixtures as Fixture[])(
    'matches qrcode for %j',
    ({ value, ...expected }) => {
      expect(encode(expand(value), expected.level)).toEqual(expected);
    }
  );
});
