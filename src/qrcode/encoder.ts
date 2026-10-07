/* eslint-disable no-bitwise -- QR encoding is bit manipulation */

// QR code encoder.
//
// A port of the encoder of `qrcode` (https://github.com/soldair/node-qrcode,
// MIT License, Copyright (c) 2012 Ryan Day, itself based on the QR Code
// generator by Kazuhiko Arase, MIT License), including the shortest path search
// of `dijkstrajs` (https://github.com/tcort/dijkstrajs, MIT License) it uses to
// split the input into segments.
//
// It produces exactly the same symbols as `QRCode.create(value, {
// errorCorrectionLevel })` (same segments, version, mask and modules; checked
// by the tests against `qrcode` itself), but works on flat typed arrays and
// scores the 8 mask patterns without re-masking the matrix through per-module
// method calls, which is what made `qrcode` slow without a JIT (Hermes).
//
// Kanji mode is not supported: like `qrcode` without a `toSJISFunc`, Kanji
// characters are encoded in byte mode.

// ---------------------------------------------------------------------------
// Modes and error correction levels

type Mode = { bit: number; ccBits: [number, number, number] };

const NUMERIC: Mode = { bit: 1 << 0, ccBits: [10, 12, 14] };
const ALPHANUMERIC: Mode = { bit: 1 << 1, ccBits: [9, 11, 13] };
const BYTE: Mode = { bit: 1 << 2, ccBits: [8, 16, 16] };

const getCharCountIndicator = (mode: Mode, version: number): number => {
  if (version >= 1 && version < 10) return mode.ccBits[0];
  else if (version < 27) return mode.ccBits[1];
  return mode.ccBits[2];
};

// Format info bit and index into the per-level tables (L, M, Q, H).
type ErrorCorrectionLevel = { bit: number; index: number };

const LEVELS: Record<'L' | 'M' | 'Q' | 'H', ErrorCorrectionLevel> = {
  L: { bit: 1, index: 0 },
  M: { bit: 0, index: 1 },
  Q: { bit: 3, index: 2 },
  H: { bit: 2, index: 3 },
};

// Same parsing as `qrcode`: case-insensitive, long names allowed, defaults to M.
const levelFrom = (value: unknown): ErrorCorrectionLevel => {
  switch (typeof value === 'string' ? value.toLowerCase() : value) {
    case 'l':
    case 'low':
      return LEVELS.L;
    case 'q':
    case 'quartile':
      return LEVELS.Q;
    case 'h':
    case 'high':
      return LEVELS.H;
    default:
      return LEVELS.M;
  }
};

// ---------------------------------------------------------------------------
// Capacity tables (ISO/IEC 18004)

// Total codewords (data + error correction) per version.
const CODEWORDS_COUNT = [
  0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655,
  733, 815, 901, 991, 1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921,
  2051, 2185, 2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706,
];

// Error correction blocks per version and level (L, M, Q, H).
const EC_BLOCKS = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 4, 1, 2, 4, 4, 2, 4, 4, 4, 2, 4,
  6, 5, 2, 4, 6, 6, 2, 5, 8, 8, 4, 5, 8, 8, 4, 5, 8, 11, 4, 8, 10, 11, 4, 9, 12,
  16, 4, 9, 16, 16, 6, 10, 12, 18, 6, 10, 17, 16, 6, 11, 16, 19, 6, 13, 18, 21,
  7, 14, 21, 25, 8, 16, 20, 25, 8, 17, 23, 25, 9, 17, 23, 34, 9, 18, 25, 30, 10,
  20, 27, 32, 12, 21, 29, 35, 12, 23, 34, 37, 12, 25, 34, 40, 13, 26, 35, 42,
  14, 28, 38, 45, 15, 29, 40, 48, 16, 31, 43, 51, 17, 33, 45, 54, 18, 35, 48,
  57, 19, 37, 51, 60, 19, 38, 53, 63, 20, 40, 56, 66, 21, 43, 59, 70, 22, 45,
  62, 74, 24, 47, 65, 77, 25, 49, 68, 81,
];

// Error correction codewords per version and level (L, M, Q, H).
const EC_CODEWORDS = [
  7, 10, 13, 17, 10, 16, 22, 28, 15, 26, 36, 44, 20, 36, 52, 64, 26, 48, 72, 88,
  36, 64, 96, 112, 40, 72, 108, 130, 48, 88, 132, 156, 60, 110, 160, 192, 72,
  130, 192, 224, 80, 150, 224, 264, 96, 176, 260, 308, 104, 198, 288, 352, 120,
  216, 320, 384, 132, 240, 360, 432, 144, 280, 408, 480, 168, 308, 448, 532,
  180, 338, 504, 588, 196, 364, 546, 650, 224, 416, 600, 700, 224, 442, 644,
  750, 252, 476, 690, 816, 270, 504, 750, 900, 300, 560, 810, 960, 312, 588,
  870, 1050, 336, 644, 952, 1110, 360, 700, 1020, 1200, 390, 728, 1050, 1260,
  420, 784, 1140, 1350, 450, 812, 1200, 1440, 480, 868, 1290, 1530, 510, 924,
  1350, 1620, 540, 980, 1440, 1710, 570, 1036, 1530, 1800, 570, 1064, 1590,
  1890, 600, 1120, 1680, 1980, 630, 1204, 1770, 2100, 660, 1260, 1860, 2220,
  720, 1316, 1950, 2310, 750, 1372, 2040, 2430,
];

const dataCodewordsBits = (version: number, level: ErrorCorrectionLevel) =>
  (CODEWORDS_COUNT[version]! - EC_CODEWORDS[(version - 1) * 4 + level.index]!) *
  8;

// ---------------------------------------------------------------------------
// Segments

const ALPHA_NUM_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';

const numericBitsLength = (length: number) =>
  10 * Math.floor(length / 3) + (length % 3 ? (length % 3) * 3 + 1 : 0);
const alphanumericBitsLength = (length: number) =>
  11 * Math.floor(length / 2) + 6 * (length % 2);
const byteBitsLength = (length: number) => length * 8;

const segmentBitsLength = (length: number, mode: Mode) =>
  mode === NUMERIC
    ? numericBitsLength(length)
    : mode === ALPHANUMERIC
      ? alphanumericBitsLength(length)
      : byteBitsLength(length);

// Same as `encode-utf8`, used by `qrcode` for byte mode.
const encodeUtf8 = (input: string): Uint8Array => {
  const result: number[] = [];
  const size = input.length;

  for (let index = 0; index < size; index++) {
    let point = input.charCodeAt(index);

    if (point >= 0xd800 && point <= 0xdbff && size > index + 1) {
      const second = input.charCodeAt(index + 1);

      if (second >= 0xdc00 && second <= 0xdfff) {
        point = (point - 0xd800) * 0x400 + second - 0xdc00 + 0x10000;
        index += 1;
      }
    }

    if (point < 0x80) {
      result.push(point);
    } else if (point < 0x800) {
      result.push((point >> 6) | 192, (point & 63) | 128);
    } else if (point < 0xd800 || (point >= 0xe000 && point < 0x10000)) {
      result.push(
        (point >> 12) | 224,
        ((point >> 6) & 63) | 128,
        (point & 63) | 128
      );
    } else if (point >= 0x10000 && point <= 0x10ffff) {
      result.push(
        (point >> 18) | 240,
        ((point >> 12) & 63) | 128,
        ((point >> 6) & 63) | 128,
        (point & 63) | 128
      );
    } else {
      // Invalid character
      result.push(0xef, 0xbf, 0xbd);
    }
  }

  return new Uint8Array(result);
};

// UTF-8 length as computed by `qrcode` (throws on lone surrogates, like it).
const getStringByteLength = (str: string): number =>
  unescape(encodeURIComponent(str)).length;

// An encodable segment: mode, number of characters/bytes and its bits.
type Segment = {
  mode: Mode;
  length: number;
  bitsLength: number;
  write: (buffer: BitBuffer) => void;
};

const createSegment = (data: string, mode: Mode): Segment => {
  if (mode === NUMERIC) {
    return {
      mode,
      length: data.length,
      bitsLength: numericBitsLength(data.length),
      write: (buffer) => {
        let i = 0;
        for (; i + 3 <= data.length; i += 3) {
          buffer.put(parseInt(data.substr(i, 3), 10), 10);
        }
        const remaining = data.length - i;
        if (remaining > 0) {
          buffer.put(parseInt(data.substr(i), 10), remaining * 3 + 1);
        }
      },
    };
  }
  if (mode === ALPHANUMERIC) {
    return {
      mode,
      length: data.length,
      bitsLength: alphanumericBitsLength(data.length),
      write: (buffer) => {
        let i = 0;
        for (; i + 2 <= data.length; i += 2) {
          buffer.put(
            ALPHA_NUM_CHARS.indexOf(data[i]!) * 45 +
              ALPHA_NUM_CHARS.indexOf(data[i + 1]!),
            11
          );
        }
        if (data.length % 2) {
          buffer.put(ALPHA_NUM_CHARS.indexOf(data[i]!), 6);
        }
      },
    };
  }
  const bytes = encodeUtf8(data);
  return {
    mode: BYTE,
    length: bytes.length,
    bitsLength: byteBitsLength(bytes.length),
    write: (buffer) => {
      for (let i = 0; i < bytes.length; i++) buffer.put(bytes[i]!, 8);
    },
  };
};

type RawSegment = { data: string; mode: Mode; length: number };

const NUMERIC_REGEX = /[0-9]+/g;
const ALPHANUMERIC_REGEX = /[A-Z $%*+\-./:]+/g;
const BYTE_REGEX = /[^A-Z0-9 $%*+\-./:]+/g;

const getSegments = (regex: RegExp, mode: Mode, str: string) => {
  const segments: (RawSegment & { index: number })[] = [];
  let result: RegExpExecArray | null;
  regex.lastIndex = 0;
  while ((result = regex.exec(str)) !== null) {
    segments.push({
      data: result[0],
      index: result.index,
      mode,
      length: result[0].length,
    });
  }
  return segments;
};

const getSegmentsFromString = (str: string): RawSegment[] =>
  getSegments(NUMERIC_REGEX, NUMERIC, str)
    .concat(
      getSegments(ALPHANUMERIC_REGEX, ALPHANUMERIC, str),
      getSegments(BYTE_REGEX, BYTE, str)
    )
    .sort((s1, s2) => s1.index - s2.index)
    .map(({ data, mode, length }) => ({ data, mode, length }));

const mergeSegments = (segs: RawSegment[]) =>
  segs.reduce<RawSegment[]>((acc, curr) => {
    const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
    if (prevSeg && prevSeg.mode === curr.mode) {
      acc[acc.length - 1]!.data += curr.data;
      return acc;
    }
    acc.push(curr);
    return acc;
  }, []);

// Each raw segment can also be encoded with any less restrictive mode.
const buildNodes = (segs: RawSegment[]): RawSegment[][] =>
  segs.map((seg) => {
    switch (seg.mode) {
      case NUMERIC:
        return [
          seg,
          { data: seg.data, mode: ALPHANUMERIC, length: seg.length },
          { data: seg.data, mode: BYTE, length: seg.length },
        ];
      case ALPHANUMERIC:
        return [seg, { data: seg.data, mode: BYTE, length: seg.length }];
      default:
        return [
          {
            data: seg.data,
            mode: BYTE,
            length: getStringByteLength(seg.data),
          },
        ];
    }
  });

type Graph = Record<string, Record<string, number>>;

// Edge weights are the bits needed to encode a node after the previous one.
// Mirrors `qrcode`, including how `lastCount` is carried between nodes.
const buildGraph = (nodes: RawSegment[][], version: number) => {
  const table: Record<string, { node: RawSegment; lastCount: number }> = {};
  const graph: Graph = { start: {} };
  let prevNodeIds = ['start'];

  for (let i = 0; i < nodes.length; i++) {
    const nodeGroup = nodes[i]!;
    const currentNodeIds: string[] = [];

    for (let j = 0; j < nodeGroup.length; j++) {
      const node = nodeGroup[j]!;
      const key = '' + i + j;

      currentNodeIds.push(key);
      table[key] = { node, lastCount: 0 };
      graph[key] = {};

      for (let n = 0; n < prevNodeIds.length; n++) {
        const prevNodeId = prevNodeIds[n]!;
        const prev = table[prevNodeId];

        if (prev && prev.node.mode === node.mode) {
          graph[prevNodeId]![key] =
            segmentBitsLength(prev.lastCount + node.length, node.mode) -
            segmentBitsLength(prev.lastCount, node.mode);

          prev.lastCount += node.length;
        } else {
          if (prev) prev.lastCount = node.length;

          graph[prevNodeId]![key] =
            segmentBitsLength(node.length, node.mode) +
            4 +
            getCharCountIndicator(node.mode, version); // switch cost
        }
      }
    }

    prevNodeIds = currentNodeIds;
  }

  for (let n = 0; n < prevNodeIds.length; n++) {
    graph[prevNodeIds[n]!]!.end = 0;
  }

  return { map: graph, table };
};

// Shortest path as computed by `dijkstrajs` (same queue and tie-breaking).
const findPath = (graph: Graph, s: string, d: string): string[] => {
  const predecessors: Record<string, string> = {};
  const costs: Record<string, number> = { [s]: 0 };
  const open: { value: string; cost: number }[] = [{ value: s, cost: 0 }];

  while (open.length !== 0) {
    const closest = open.shift()!;
    const u = closest.value;
    const adjacentNodes = graph[u] || {};

    for (const v in adjacentNodes) {
      if (Object.prototype.hasOwnProperty.call(adjacentNodes, v)) {
        const cost = closest.cost + adjacentNodes[v]!;
        if (typeof costs[v] === 'undefined' || costs[v]! > cost) {
          costs[v] = cost;
          open.push({ value: v, cost });
          open.sort((a, b) => a.cost - b.cost);
          predecessors[v] = u;
        }
      }
    }
  }

  if (typeof costs[d] === 'undefined') {
    throw new Error('Could not find a path from ' + s + ' to ' + d + '.');
  }

  const nodes: string[] = [];
  let u: string | undefined = d;
  while (u) {
    nodes.push(u);
    u = predecessors[u];
  }
  return nodes.reverse();
};

const segmentsFromString = (data: string, version: number): Segment[] => {
  const graph = buildGraph(buildNodes(getSegmentsFromString(data)), version);
  const path = findPath(graph.map, 'start', 'end');

  const optimizedSegs: RawSegment[] = [];
  for (let i = 1; i < path.length - 1; i++) {
    optimizedSegs.push(graph.table[path[i]!]!.node);
  }

  return mergeSegments(optimizedSegs).map((seg) =>
    createSegment(seg.data, seg.mode)
  );
};

// ---------------------------------------------------------------------------
// Version

const getCapacity = (
  version: number,
  level: ErrorCorrectionLevel,
  mode: Mode | null
): number => {
  const bits = dataCodewordsBits(version, level);
  if (mode === null) return bits;

  const usableBits = bits - (getCharCountIndicator(mode, version) + 4);
  switch (mode) {
    case NUMERIC:
      return Math.floor((usableBits / 10) * 3);
    case ALPHANUMERIC:
      return Math.floor((usableBits / 11) * 2);
    default:
      return Math.floor(usableBits / 8);
  }
};

const getBestVersionForData = (
  segments: Segment[],
  level: ErrorCorrectionLevel
): number | undefined => {
  if (segments.length > 1) {
    for (let version = 1; version <= 40; version++) {
      let length = 0;
      for (const segment of segments) {
        length +=
          getCharCountIndicator(segment.mode, version) + 4 + segment.bitsLength;
      }
      if (length <= getCapacity(version, level, null)) return version;
    }
    return undefined;
  }
  if (segments.length === 0) return 1;

  const { mode, length } = segments[0]!;
  for (let version = 1; version <= 40; version++) {
    if (length <= getCapacity(version, level, mode)) return version;
  }
  return undefined;
};

// ---------------------------------------------------------------------------
// Data codewords

type BitBuffer = {
  buffer: number[];
  length: number;
  put: (num: number, length: number) => void;
  putBit: (bit: boolean) => void;
};

const createBitBuffer = (): BitBuffer => {
  const bitBuffer: BitBuffer = {
    buffer: [],
    length: 0,
    put: (num, length) => {
      for (let i = 0; i < length; i++) {
        bitBuffer.putBit(((num >>> (length - i - 1)) & 1) === 1);
      }
    },
    putBit: (bit) => {
      const bufIndex = Math.floor(bitBuffer.length / 8);
      if (bitBuffer.buffer.length <= bufIndex) bitBuffer.buffer.push(0);
      if (bit) bitBuffer.buffer[bufIndex]! |= 0x80 >>> (bitBuffer.length % 8);
      bitBuffer.length++;
    },
  };
  return bitBuffer;
};

// Galois field GF(2^8) with the QR code polynomial 0x11D.
const EXP_TABLE = new Uint8Array(512);
const LOG_TABLE = new Uint8Array(256);
{
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    LOG_TABLE[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) EXP_TABLE[i] = EXP_TABLE[i - 255]!;
}

const gfMul = (x: number, y: number) =>
  x === 0 || y === 0 ? 0 : EXP_TABLE[LOG_TABLE[x]! + LOG_TABLE[y]!]!;

// Reed-Solomon generator polynomials, by degree.
const generatorCache = new Map<number, Uint8Array>();

const getGenerator = (degree: number): Uint8Array => {
  const cached = generatorCache.get(degree);
  if (cached) return cached;
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    // poly * (x + 2^i)
    const next = new Uint8Array(poly.length + 1);
    for (let j = 0; j < poly.length; j++) {
      next[j]! ^= poly[j]!;
      next[j + 1]! ^= gfMul(poly[j]!, EXP_TABLE[i]!);
    }
    poly = next;
  }
  generatorCache.set(degree, poly);
  return poly;
};

// Error correction codewords: remainder of data(x) * x^degree / generator(x).
const reedSolomon = (data: Uint8Array, degree: number): Uint8Array => {
  const generator = getGenerator(degree);
  const remainder = new Uint8Array(degree);
  for (let i = 0; i < data.length; i++) {
    const factor = data[i]! ^ remainder[0]!;
    remainder.copyWithin(0, 1);
    remainder[degree - 1] = 0;
    if (factor !== 0) {
      const logFactor = LOG_TABLE[factor]!;
      for (let j = 0; j < degree; j++) {
        const g = generator[j + 1]!;
        if (g !== 0) remainder[j]! ^= EXP_TABLE[LOG_TABLE[g]! + logFactor]!;
      }
    }
  }
  return remainder;
};

const createCodewords = (
  segments: Segment[],
  version: number,
  level: ErrorCorrectionLevel
): Uint8Array => {
  const buffer = createBitBuffer();
  for (const segment of segments) {
    buffer.put(segment.mode.bit, 4);
    buffer.put(segment.length, getCharCountIndicator(segment.mode, version));
    segment.write(buffer);
  }

  const totalBits = dataCodewordsBits(version, level);
  // Terminator, then pad to a byte boundary and with pad codewords.
  if (buffer.length + 4 <= totalBits) buffer.put(0, 4);
  while (buffer.length % 8 !== 0) buffer.putBit(false);
  const remainingByte = (totalBits - buffer.length) / 8;
  for (let i = 0; i < remainingByte; i++) buffer.put(i % 2 ? 0x11 : 0xec, 8);

  const totalCodewords = CODEWORDS_COUNT[version]!;
  const ecTotalCodewords = EC_CODEWORDS[(version - 1) * 4 + level.index]!;
  const dataTotalCodewords = totalCodewords - ecTotalCodewords;
  const ecTotalBlocks = EC_BLOCKS[(version - 1) * 4 + level.index]!;

  const blocksInGroup2 = totalCodewords % ecTotalBlocks;
  const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
  const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
  const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
  const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
  const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;

  const bytes = new Uint8Array(buffer.buffer);
  const dcData: Uint8Array[] = [];
  const ecData: Uint8Array[] = [];
  let offset = 0;
  let maxDataSize = 0;
  for (let b = 0; b < ecTotalBlocks; b++) {
    const dataSize =
      b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
    const block = bytes.slice(offset, offset + dataSize);
    dcData.push(block);
    ecData.push(reedSolomon(block, ecCount));
    offset += dataSize;
    maxDataSize = Math.max(maxDataSize, dataSize);
  }

  // Interleave data and error correction codewords of all blocks.
  const data = new Uint8Array(totalCodewords);
  let index = 0;
  for (let i = 0; i < maxDataSize; i++) {
    for (let r = 0; r < ecTotalBlocks; r++) {
      if (i < dcData[r]!.length) data[index++] = dcData[r]![i]!;
    }
  }
  for (let i = 0; i < ecCount; i++) {
    for (let r = 0; r < ecTotalBlocks; r++) data[index++] = ecData[r]![i]!;
  }
  return data;
};

// ---------------------------------------------------------------------------
// Matrix

const getBCHDigit = (data: number): number => {
  let digit = 0;
  while (data !== 0) {
    digit++;
    data >>>= 1;
  }
  return digit;
};

const G15 =
  (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);
const G15_BCH = getBCHDigit(G15);
const G18 =
  (1 << 12) |
  (1 << 11) |
  (1 << 10) |
  (1 << 9) |
  (1 << 8) |
  (1 << 5) |
  (1 << 2) |
  (1 << 0);
const G18_BCH = getBCHDigit(G18);

const formatBits = (level: ErrorCorrectionLevel, mask: number): number => {
  const data = (level.bit << 3) | mask;
  let d = data << 10;
  while (getBCHDigit(d) - G15_BCH >= 0) d ^= G15 << (getBCHDigit(d) - G15_BCH);
  return ((data << 10) | d) ^ G15_MASK;
};

const versionBits = (version: number): number => {
  let d = version << 12;
  while (getBCHDigit(d) - G18_BCH >= 0) d ^= G18 << (getBCHDigit(d) - G18_BCH);
  return (version << 12) | d;
};

const getAlignmentCoords = (version: number, size: number): number[] => {
  if (version === 1) return [];
  const posCount = Math.floor(version / 7) + 2;
  const intervals =
    size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
  const positions = [size - 7];
  for (let i = 1; i < posCount - 1; i++) {
    positions[i] = positions[i - 1]! - intervals;
  }
  positions.push(6);
  return positions.reverse();
};

// Byte length rounded up to whole 32-bit words, so XORs can run 4 modules at a
// time through Uint32Array views.
const wordAligned = (length: number) => (length + 3) & ~3;

type FunctionPatterns = {
  // Function pattern modules (finders, timing, alignment, version info, dark
  // module), with format info modules left at 0.
  base: Uint8Array;
  reserved: Uint8Array;
  // Positions of the data modules, in placement order.
  dataPositions: Int32Array;
};

// Function patterns only depend on the version.
const functionPatternsCache = new Map<number, FunctionPatterns>();

const getFunctionPatterns = (version: number): FunctionPatterns => {
  const cached = functionPatternsCache.get(version);
  if (cached) return cached;

  const size = version * 4 + 17;
  const base = new Uint8Array(wordAligned(size * size));
  const reserved = new Uint8Array(size * size);
  const set = (row: number, col: number, value: boolean) => {
    base[row * size + col] = value ? 1 : 0;
    reserved[row * size + col] = 1;
  };

  // Finder patterns
  for (const [row, col] of [
    [0, 0],
    [size - 7, 0],
    [0, size - 7],
  ] as const) {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || size <= row + r) continue;
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || size <= col + c) continue;
        set(
          row + r,
          col + c,
          (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
            (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        );
      }
    }
  }

  // Timing patterns
  for (let r = 8; r < size - 8; r++) {
    set(r, 6, r % 2 === 0);
    set(6, r, r % 2 === 0);
  }

  // Alignment patterns
  const coords = getAlignmentCoords(version, size);
  for (let i = 0; i < coords.length; i++) {
    for (let j = 0; j < coords.length; j++) {
      if (
        (i === 0 && j === 0) ||
        (i === 0 && j === coords.length - 1) ||
        (i === coords.length - 1 && j === 0)
      ) {
        continue;
      }
      const row = coords[i]!;
      const col = coords[j]!;
      for (let r = -2; r <= 2; r++) {
        for (let c = -2; c <= 2; c++) {
          set(
            row + r,
            col + c,
            r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)
          );
        }
      }
    }
  }

  // Format info (reserved only, written per mask) and the fixed dark module
  writeFormatInfo(base, size, 0, reserved);

  // Version info
  if (version >= 7) {
    const bits = versionBits(version);
    for (let i = 0; i < 18; i++) {
      const row = Math.floor(i / 3);
      const col = (i % 3) + size - 8 - 3;
      const mod = ((bits >> i) & 1) === 1;
      set(row, col, mod);
      set(col, row, mod);
    }
  }

  // Data placement order: two-module columns, zigzagging up and down.
  const positions: number[] = [];
  let inc = -1;
  let row = size - 1;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    while (true) {
      for (let c = 0; c < 2; c++) {
        const k = row * size + col - c;
        if (!reserved[k]) positions.push(k);
      }
      row += inc;
      if (row < 0 || size <= row) {
        row -= inc;
        inc = -inc;
        break;
      }
    }
  }

  const patterns = {
    base,
    reserved,
    dataPositions: Int32Array.from(positions),
  };
  functionPatternsCache.set(version, patterns);
  return patterns;
};

// Writes the format info modules (and the fixed dark module); with `reserved`,
// also marks them as reserved.
function writeFormatInfo(
  data: Uint8Array,
  size: number,
  bits: number,
  reserved?: Uint8Array
) {
  const set = (k: number, value: number) => {
    data[k] = value;
    if (reserved) reserved[k] = 1;
  };
  for (let i = 0; i < 15; i++) {
    const mod = (bits >> i) & 1;

    // vertical
    if (i < 6) set(i * size + 8, mod);
    else if (i < 8) set((i + 1) * size + 8, mod);
    else set((size - 15 + i) * size + 8, mod);

    // horizontal
    if (i < 8) set(8 * size + size - i - 1, mod);
    else if (i < 9) set(8 * size + 15 - i - 1 + 1, mod);
    else set(8 * size + 15 - i - 1, mod);
  }

  // fixed module
  set((size - 8) * size + 8, 1);
}

// ---------------------------------------------------------------------------
// Masking

const PATTERNS = 8;

const isMasked = (pattern: number, i: number, j: number): boolean => {
  switch (pattern) {
    case 0:
      return (i + j) % 2 === 0;
    case 1:
      return i % 2 === 0;
    case 2:
      return j % 3 === 0;
    case 3:
      return (i + j) % 3 === 0;
    case 4:
      return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
    case 5:
      return ((i * j) % 2) + ((i * j) % 3) === 0;
    case 6:
      return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0;
    default:
      return (((i * j) % 3) + ((i + j) % 2)) % 2 === 0;
  }
};

// The 8 mask layers per version (1 where a data module flips).
const maskLayersCache = new Map<number, Uint8Array[]>();

const getMaskLayers = (
  version: number,
  size: number,
  reserved: Uint8Array
): Uint8Array[] => {
  let layers = maskLayersCache.get(version);
  if (!layers) {
    layers = [];
    for (let p = 0; p < PATTERNS; p++) {
      const layer = new Uint8Array(wordAligned(size * size));
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const k = i * size + j;
          if (!reserved[k] && isMasked(p, i, j)) layer[k] = 1;
        }
      }
      layers.push(layer);
    }
    maskLayersCache.set(version, layers);
  }
  return layers;
};

const xorInto = (out: Uint8Array, a: Uint8Array, b: Uint8Array) => {
  const words = out.length >> 2;
  const o = new Uint32Array(out.buffer, out.byteOffset, words);
  const x = new Uint32Array(a.buffer, a.byteOffset, words);
  const y = new Uint32Array(b.buffer, b.byteOffset, words);
  for (let w = 0; w < words; w++) o[w] = x[w]! ^ y[w]!;
};

// Penalty scoring (ISO/IEC 18004 N1 + N2 + N3 + N4, as computed by `qrcode`).
//
// Scored bit-parallel: every row and column is packed into 32-bit words (bit
// `c & 31` of word `c >> 5` is module `c`), so each rule is evaluated for 32
// modules at once with shifts and masks:
// - N1, runs of 5+ same-colored modules, each worth 3 + (length - 5): a run of
//   length L has L - 4 windows of 5 equal modules and one start, so the score
//   is (windows) + 2 * (windows that start a run).
// - N2, 2x2 blocks of the same color: rows r and r + 1 equal at c and c + 1,
//   and row r equal between c and c + 1.
// - N3, 1:1:3:1:1 finder-like patterns (0x5D0 / 0x05D over 11 modules).
// - N4, proportion of dark modules.

const popcount = (x: number): number => {
  x -= (x >>> 1) & 0x55555555;
  x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
  x = (x + (x >>> 4)) & 0x0f0f0f0f;
  return Math.imul(x, 0x01010101) >>> 24;
};

// Words with the first `bits` bits set.
const validMask = (bits: number, words: number): Int32Array => {
  const mask = new Int32Array(words);
  for (let w = 0; w < words; w++) {
    const remaining = bits - w * 32;
    mask[w] = remaining >= 32 ? -1 : remaining > 0 ? (1 << remaining) - 1 : 0;
  }
  return mask;
};

type PackedLayout = {
  words: number; // words per line
  valid1: Int32Array; // positions c with c + 1 < size
  valid4: Int32Array; // c + 4 < size (N1 windows)
  valid10: Int32Array; // c + 10 < size (N3 windows)
  // Format info modules: bit of the format info they hold, and their index in
  // the packed rows and columns.
  formatBitIndex: Int32Array;
  formatRowWord: Int32Array;
  formatRowBit: Int32Array;
  formatColWord: Int32Array;
  formatColBit: Int32Array;
};

const packedLayoutCache = new Map<number, PackedLayout>();

const getPackedLayout = (size: number): PackedLayout => {
  let layout = packedLayoutCache.get(size);
  if (!layout) {
    const words = (size + 31) >> 5;
    // Same order as `writeFormatInfo` (15 bits twice, then the dark module).
    const cells: number[] = [];
    const probe = new Uint8Array(size * size);
    for (let bit = 0; bit < 15; bit++) {
      probe.fill(0);
      writeFormatInfo(probe, size, 1 << bit);
      const dark = (size - 8) * size + 8;
      for (let k = 0; k < probe.length; k++) {
        if (probe[k] && k !== dark) cells.push(bit, k);
      }
    }
    const count = cells.length / 2;
    layout = {
      words,
      valid1: validMask(size - 1, words),
      valid4: validMask(size - 4, words),
      valid10: validMask(size - 10, words),
      formatBitIndex: new Int32Array(count),
      formatRowWord: new Int32Array(count),
      formatRowBit: new Int32Array(count),
      formatColWord: new Int32Array(count),
      formatColBit: new Int32Array(count),
    };
    for (let n = 0; n < count; n++) {
      const k = cells[n * 2 + 1]!;
      const row = Math.floor(k / size);
      const col = k % size;
      layout.formatBitIndex[n] = cells[n * 2]!;
      layout.formatRowWord[n] = row * words + (col >> 5);
      layout.formatRowBit[n] = col & 31;
      layout.formatColWord[n] = col * words + (row >> 5);
      layout.formatColBit[n] = row & 31;
    }
    packedLayoutCache.set(size, layout);
  }
  return layout;
};

// Packs modules into rows (and, transposed, columns) of words.
const pack = (
  data: Uint8Array,
  size: number,
  words: number,
  rows: Int32Array,
  cols: Int32Array
) => {
  rows.fill(0);
  cols.fill(0);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (data[r * size + c]) {
        rows[r * words + (c >> 5)]! |= 1 << (c & 31);
        cols[c * words + (r >> 5)]! |= 1 << (r & 31);
      }
    }
  }
};

// Packed mask layers (rows and columns) per version.
const packedLayersCache = new Map<
  number,
  { rows: Int32Array; cols: Int32Array }[]
>();

const getPackedLayers = (
  version: number,
  size: number,
  layers: Uint8Array[],
  words: number
) => {
  let packed = packedLayersCache.get(version);
  if (!packed) {
    packed = layers.map((layer) => {
      const rows = new Int32Array(size * words);
      const cols = new Int32Array(size * words);
      pack(layer, size, words, rows, cols);
      return { rows, cols };
    });
    packedLayersCache.set(version, packed);
  }
  return packed;
};

// N1 + N3 * 40 of `size` lines of `words` words each.
const scoreLines = (
  lines: Int32Array,
  size: number,
  layout: PackedLayout
): number => {
  const { words, valid4, valid10 } = layout;
  let windows = 0;
  let starts = 0;
  let patterns = 0;
  for (let line = 0; line < size; line++) {
    const base = line * words;
    let prevEqual = 0;
    for (let w = 0; w < words; w++) {
      const cur = lines[base + w]!;
      const next = w + 1 < words ? lines[base + w + 1]! : 0;
      const next2 = w + 2 < words ? lines[base + w + 2]! : 0;

      // Equality between module c and c + 1, for this word and the next.
      const equal = ~(cur ^ ((cur >>> 1) | (next << 31)));
      const nextEqual = ~(next ^ ((next >>> 1) | (next2 << 31)));

      // N1: 4 consecutive equalities = a window of 5 equal modules.
      const window =
        equal &
        ((equal >>> 1) | (nextEqual << 31)) &
        ((equal >>> 2) | (nextEqual << 30)) &
        ((equal >>> 3) | (nextEqual << 29)) &
        valid4[w]!;
      // A window starts a run unless module c - 1 equals module c.
      const start = window & ~((equal << 1) | (prevEqual >>> 31));
      windows += popcount(window);
      starts += popcount(start);
      prevEqual = equal;

      // N3: modules c..c + 10 match 1011101 0000 or 0000 1011101.
      const s1 = (cur >>> 1) | (next << 31);
      const s2 = (cur >>> 2) | (next << 30);
      const s3 = (cur >>> 3) | (next << 29);
      const s4 = (cur >>> 4) | (next << 28);
      const s5 = (cur >>> 5) | (next << 27);
      const s6 = (cur >>> 6) | (next << 26);
      const s7 = (cur >>> 7) | (next << 25);
      const s8 = (cur >>> 8) | (next << 24);
      const s9 = (cur >>> 9) | (next << 23);
      const s10 = (cur >>> 10) | (next << 22);
      const finder = s4 & ~s5 & s6;
      const a = cur & ~s1 & s2 & s3 & finder & ~s7 & ~s8 & ~s9 & ~s10;
      const b = ~cur & ~s1 & ~s2 & ~s3 & finder & s7 & s8 & ~s9 & s10;
      patterns += popcount(a & valid10[w]!) + popcount(b & valid10[w]!);
    }
  }
  return windows + 2 * starts + patterns * 40;
};

// N2 * 3 + N4 * 10 from the packed rows.
const scoreBlocksAndBalance = (
  rows: Int32Array,
  size: number,
  layout: PackedLayout
): number => {
  const { words, valid1 } = layout;
  let blocks = 0;
  let dark = 0;
  for (let r = 0; r < size; r++) {
    const top = r * words;
    const bottom = top + words;
    for (let w = 0; w < words; w++) {
      const a = rows[top + w]!;
      dark += popcount(a);
      if (r === size - 1) continue;
      const aNext = w + 1 < words ? rows[top + w + 1]! : 0;
      const b = rows[bottom + w]!;
      const bNext = w + 1 < words ? rows[bottom + w + 1]! : 0;
      const vertical = ~(a ^ b);
      const verticalNext = ~(aNext ^ bNext);
      const horizontal = ~(a ^ ((a >>> 1) | (aNext << 31)));
      blocks += popcount(
        vertical &
          ((vertical >>> 1) | (verticalNext << 31)) &
          horizontal &
          valid1[w]!
      );
    }
  }
  return (
    blocks * 3 + Math.abs(Math.ceil((dark * 100) / (size * size) / 5) - 10) * 10
  );
};

// Penalty of each of the 8 mask patterns.
const scoreMasks = (
  raw: Uint8Array,
  version: number,
  size: number,
  level: ErrorCorrectionLevel,
  layers: Uint8Array[]
): number[] => {
  const layout = getPackedLayout(size);
  const { words, formatBitIndex } = layout;
  const packedLayers = getPackedLayers(version, size, layers, words);
  const rawRows = new Int32Array(size * words);
  const rawCols = new Int32Array(size * words);
  pack(raw, size, words, rawRows, rawCols);

  const rows = new Int32Array(size * words);
  const cols = new Int32Array(size * words);
  const penalties: number[] = [];
  for (let p = 0; p < PATTERNS; p++) {
    const layer = packedLayers[p]!;
    for (let w = 0; w < rows.length; w++) {
      rows[w] = rawRows[w]! ^ layer.rows[w]!;
      cols[w] = rawCols[w]! ^ layer.cols[w]!;
    }
    const bits = formatBits(level, p);
    for (let n = 0; n < formatBitIndex.length; n++) {
      const rowBit = 1 << layout.formatRowBit[n]!;
      const colBit = 1 << layout.formatColBit[n]!;
      if ((bits >> formatBitIndex[n]!) & 1) {
        rows[layout.formatRowWord[n]!]! |= rowBit;
        cols[layout.formatColWord[n]!]! |= colBit;
      } else {
        rows[layout.formatRowWord[n]!]! &= ~rowBit;
        cols[layout.formatColWord[n]!]! &= ~colBit;
      }
    }
    penalties.push(
      scoreLines(rows, size, layout) +
        scoreLines(cols, size, layout) +
        scoreBlocksAndBalance(rows, size, layout)
    );
  }
  return penalties;
};

// ---------------------------------------------------------------------------

export type ErrorCorrectionLevelType = 'L' | 'H' | 'Q' | 'M';

export type Modules = {
  size: number;
  // Modules (1 = dark), row by row.
  data: Uint8Array;
};

// The encoded symbol, with the details the tests compare against `qrcode`.
type QRSymbol = Modules & {
  version: number;
  maskPattern: number;
  penalties: number[];
};

const encodeSymbol = (
  value: string,
  errorCorrectionLevel: ErrorCorrectionLevelType
): QRSymbol => {
  if (typeof value === 'undefined' || value === '') {
    throw new Error('No input text');
  }
  const level = levelFrom(errorCorrectionLevel);

  // Estimate the version from the raw split, then build optimal segments.
  const rawSegments = getSegmentsFromString(value).map((seg) =>
    createSegment(seg.data, seg.mode)
  );
  const estimatedVersion = getBestVersionForData(rawSegments, level);
  const segments = segmentsFromString(value, estimatedVersion || 40);

  const version = getBestVersionForData(segments, level);
  if (!version) {
    throw new Error('The amount of data is too big to be stored in a QR Code');
  }

  const codewords = createCodewords(segments, version, level);
  const size = version * 4 + 17;
  const { base, reserved, dataPositions } = getFunctionPatterns(version);

  // Place the data bits (unmasked).
  const raw = base.slice();
  const bitsCount = Math.min(dataPositions.length, codewords.length * 8);
  for (let n = 0; n < bitsCount; n++) {
    raw[dataPositions[n]!] = (codewords[n >> 3]! >>> (7 - (n & 7))) & 1;
  }

  const layers = getMaskLayers(version, size, reserved);
  // Lowest penalty wins, the first one on ties.
  const penalties = scoreMasks(raw, version, size, level, layers);
  let bestPattern = 0;
  for (let p = 1; p < PATTERNS; p++) {
    if (penalties[p]! < penalties[bestPattern]!) bestPattern = p;
  }
  const candidate = new Uint8Array(raw.length);
  xorInto(candidate, raw, layers[bestPattern]!);
  writeFormatInfo(candidate, size, formatBits(level, bestPattern));
  return {
    size,
    data: candidate.subarray(0, size * size),
    version,
    maskPattern: bestPattern,
    penalties,
  };
};

const encode = (
  value: string,
  errorCorrectionLevel: ErrorCorrectionLevelType
): Modules => {
  const { size, data } = encodeSymbol(value, errorCorrectionLevel);
  return { size, data };
};

export { encode, encodeSymbol };
