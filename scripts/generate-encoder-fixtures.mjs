// Generates src/__fixtures__/qrcode-symbols.json: the symbols produced by
// `qrcode@1.5.3` (the library the encoder was ported from) for a fixed set of
// values. The encoder tests check that it produces the same ones.
//
// `qrcode` is not a dependency of this repository; to regenerate:
//   npm install --no-save qrcode@1.5.3 && node scripts/generate-encoder-fixtures.mjs

import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const QRCode = require('qrcode');
const MaskPattern = require('qrcode/lib/core/mask-pattern');
const FormatInfo = require('qrcode/lib/core/format-info');

if (require('qrcode/package.json').version !== '1.5.3') {
  throw new Error('Expected qrcode@1.5.3');
}

// Values are stored as descriptors the tests expand with the same code
// (keep `expand` in sync with src/__tests__/encoder.test.ts):
// - a string;
// - `{ repeat, count }`: `repeat` repeated `count` times;
// - `{ mixed: seed }`: runs of characters from different pools, to exercise
//   the segmentation;
// - `{ seed, length }`: `length` random ASCII characters (byte mode).

const POOLS = [
  '0123456789',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:',
  'abcdefghijklmnopqrstuvwxyz?=&_#@!',
  'àèé€漢字テスト🐨ßΩ',
];

const random = (seed) => () =>
  (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;

const expand = (value) => {
  if (typeof value === 'string') return value;
  if ('repeat' in value) return value.repeat.repeat(value.count);
  let result = '';
  if ('mixed' in value) {
    const next = random(value.mixed);
    const runs = 1 + Math.floor(next() * 10);
    for (let r = 0; r < runs; r++) {
      const pool = Array.from(POOLS[Math.floor(next() * POOLS.length)]);
      const length = 1 + Math.floor(next() ** 2 * 40);
      for (let i = 0; i < length; i++) {
        result += pool[Math.floor(next() * pool.length)];
      }
    }
    return result;
  }
  const next = random(value.seed);
  const pool = POOLS[1] + POOLS[2];
  for (let i = 0; i < value.length; i++) {
    result += pool[Math.floor(next() * pool.length)];
  }
  return result;
};

const cases = [];
const add = (value, level) => cases.push({ value, level });

for (const value of [
  'a',
  '0',
  'A',
  ' ',
  '01234567890123456789',
  'https://qrcode.reactiive.io',
  'HTTPS://QRCODE.REACTIIVE.IO/ABC',
  'WIFI:S:My Network;T:WPA;P:p@ss;;',
  'mailto:a@b.co?subject=Hi 123',
  '',
  '\uD800', // lone surrogate
  { repeat: '🐨', count: 200 },
  { repeat: '1', count: 7089 }, // numeric capacity of version 40-L
  { repeat: 'A', count: 4296 }, // alphanumeric capacity of version 40-L
  { repeat: 'a', count: 2953 }, // byte capacity of version 40-L
  { repeat: '1', count: 7090 }, // too big
]) {
  for (const level of ['L', 'M', 'Q', 'H']) add(value, level);
}
for (const level of ['h', 'high', 'Quartile', 'low', 'invalid']) {
  add('hello', level);
}
for (let i = 1; i <= 300; i++) add({ mixed: i }, 'LMQH'[i % 4]);
// Lengths spread over all versions (up to the byte capacity of 40-L).
const nextLength = random(7);
for (let i = 1; i <= 80; i++) {
  add({ seed: i, length: 1 + Math.floor(nextLength() * 2953) }, 'L');
  add({ seed: i, length: 1 + Math.floor(nextLength() * 1273) }, 'H');
}

// The penalties of the 8 masks, as computed by `MaskPattern.getBestMask`.
const penalties = (value, level) => {
  const symbol = QRCode.create(value, {
    errorCorrectionLevel: level,
    maskPattern: 0,
  });
  const modules = symbol.modules;
  const size = modules.size;
  MaskPattern.applyMask(0, modules);
  const result = [];
  for (let p = 0; p < 8; p++) {
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
    result.push(
      MaskPattern.getPenaltyN1(modules) +
        MaskPattern.getPenaltyN2(modules) +
        MaskPattern.getPenaltyN3(modules) +
        MaskPattern.getPenaltyN4(modules)
    );
    MaskPattern.applyMask(p, modules);
  }
  return result;
};

const fixtures = cases.map(({ value, level }) => {
  const input = expand(value);
  try {
    const symbol = QRCode.create(input, { errorCorrectionLevel: level });
    return {
      value,
      level,
      size: symbol.modules.size,
      version: symbol.version,
      maskPattern: symbol.maskPattern,
      penalties: penalties(input, level),
      hash: createHash('sha256')
        .update(Buffer.from(symbol.modules.data))
        .digest('hex')
        .slice(0, 16),
    };
  } catch (error) {
    return { value, level, error: String(error.message).trim() };
  }
});

const output = new URL(
  '../src/__fixtures__/qrcode-symbols.json',
  import.meta.url
);
// One symbol per line.
writeFileSync(
  output,
  '[\n' + fixtures.map((f) => JSON.stringify(f)).join(',\n') + '\n]\n'
);
console.log(`Wrote ${fixtures.length} symbols to ${output.pathname}`);
