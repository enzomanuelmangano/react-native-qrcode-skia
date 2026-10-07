/* eslint-disable no-bitwise */
import QRCode from 'qrcode';
import { encodeSymbol } from '../qrcode/encoder';

const MaskPattern = require('qrcode/lib/core/mask-pattern');
const FormatInfo = require('qrcode/lib/core/format-info');

// The encoder is a port of `qrcode`: it must produce exactly the same symbols.

type Level = 'L' | 'M' | 'Q' | 'H';

const reference = (value: string, level: string) => {
  try {
    const symbol = QRCode.create(value, { errorCorrectionLevel: level as any });
    return {
      size: symbol.modules.size,
      data: Array.from(symbol.modules.data),
      version: symbol.version,
      maskPattern: symbol.maskPattern,
    };
  } catch (error) {
    return { error: String((error as Error).message).trim() };
  }
};

const encoded = (value: string, level: string) => {
  try {
    const symbol = encodeSymbol(value, level as Level);
    return {
      size: symbol.size,
      data: Array.from(symbol.data),
      version: symbol.version,
      maskPattern: symbol.maskPattern,
    };
  } catch (error) {
    return { error: String((error as Error).message).trim() };
  }
};

// Deterministic pseudo-random generator.
const random = (seed: number) => () =>
  (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;

const POOLS = [
  '0123456789',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:',
  'abcdefghijklmnopqrstuvwxyz?=&_#@!',
  'àèé€漢字テスト🐨ßΩ',
];

// Runs of characters from different pools, to exercise the segmentation.
const mixedValue = (next: () => number) => {
  let value = '';
  const runs = 1 + Math.floor(next() * 10);
  for (let r = 0; r < runs; r++) {
    const pool = Array.from(POOLS[Math.floor(next() * POOLS.length)]!);
    const length = 1 + Math.floor(next() ** 2 * 40);
    for (let i = 0; i < length; i++) {
      value += pool[Math.floor(next() * pool.length)];
    }
  }
  return value;
};

describe('encoder', () => {
  it.each([
    'a',
    '0',
    'A',
    ' ',
    '01234567890123456789',
    'https://qrcode.reactiive.io',
    'HTTPS://QRCODE.REACTIIVE.IO/ABC',
    'WIFI:S:My Network;T:WPA;P:p@ss;;',
    'mailto:a@b.co?subject=Hi 123',
    '🐨'.repeat(200),
    '1'.repeat(7089), // numeric capacity of version 40-L
    'A'.repeat(4296), // alphanumeric capacity of version 40-L
    'a'.repeat(2953), // byte capacity of version 40-L
    '1'.repeat(7090), // too big
    '',
    '\uD800', // lone surrogate
  ])('matches qrcode for %j', (value) => {
    for (const level of ['L', 'M', 'Q', 'H']) {
      expect(encoded(value, level)).toEqual(reference(value, level));
    }
  });

  it('parses error correction levels like qrcode', () => {
    for (const level of ['h', 'high', 'Quartile', 'low', 'invalid']) {
      expect(encoded('hello', level)).toEqual(reference('hello', level));
    }
  });

  it('matches qrcode for random mixed-mode values', () => {
    const next = random(42);
    for (let i = 0; i < 300; i++) {
      const value = mixedValue(next);
      const level = 'LMQH'[i % 4]!;
      expect(encoded(value, level)).toEqual(reference(value, level));
    }
  });

  it('scores the 8 masks like qrcode', () => {
    const next = random(7);
    for (let i = 0; i < 40; i++) {
      const value = mixedValue(next);
      const level = 'LMQH'[i % 4] as Level;
      const { penalties } = encodeSymbol(value, level);

      // qrcode's own scoring, as done in `MaskPattern.getBestMask`.
      const symbol = QRCode.create(value, {
        errorCorrectionLevel: level,
        maskPattern: 0,
      });
      const modules = symbol.modules;
      MaskPattern.applyMask(0, modules);
      const expected: number[] = [];
      for (let p = 0; p < 8; p++) {
        const size = modules.size;
        const bits = FormatInfo.getEncodedBits(symbol.errorCorrectionLevel, p);
        for (let b = 0; b < 15; b++) {
          const mod = (bits >> b) & 1;
          if (b < 6) modules.set(b, 8, mod, true);
          else if (b < 8) modules.set(b + 1, 8, mod, true);
          else modules.set(size - 15 + b, 8, mod, true);
          if (b < 8) modules.set(8, size - b - 1, mod, true);
          else if (b < 9) modules.set(8, 15 - b - 1 + 1, mod, true);
          else modules.set(8, 15 - b - 1, mod, true);
        }
        MaskPattern.applyMask(p, modules);
        expected.push(
          MaskPattern.getPenaltyN1(modules) +
            MaskPattern.getPenaltyN2(modules) +
            MaskPattern.getPenaltyN3(modules) +
            MaskPattern.getPenaltyN4(modules)
        );
        MaskPattern.applyMask(p, modules);
      }
      expect(penalties).toEqual(expected);
    }
  });
});
