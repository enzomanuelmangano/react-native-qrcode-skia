import { Skia } from '../skia';
import {
  generateModules,
  type ErrorCorrectionLevelType,
  type Modules,
} from './generate-matrix';
import {
  modulesToPath,
  type BaseShapeOptions,
} from './transform-matrix-into-path';

// Least-recently-used cache bounded by the total weight of its entries. A Map
// keeps insertion order, so the first key is the least recently used one.
class LRUCache<V> {
  private map = new Map<string, { value: V; weight: number }>();
  private weight = 0;
  constructor(private capacity: number) {}

  get(key: string): V | undefined {
    const entry = this.map.get(key);
    if (entry) {
      this.map.delete(key);
      this.map.set(key, entry);
    }
    return entry?.value;
  }

  set(key: string, value: V, weight = 1) {
    this.delete(key);
    this.map.set(key, { value, weight });
    this.weight += weight;
    while (this.weight > this.capacity) {
      this.delete(this.map.keys().next().value!);
    }
  }

  private delete(key: string) {
    const entry = this.map.get(key);
    if (entry) {
      this.weight -= entry.weight;
      this.map.delete(key);
    }
  }
}

// Encoding a value is the expensive part and does not depend on how the code is
// drawn, so modules are cached separately from paths (e.g. resizing a QR code
// reuses its modules).
const modulesCache = new LRUCache<Modules>(128);

// Paths hold native memory proportional to their number of points, so they are
// weighted by the length of their SVG string: the budget fits dozens of
// typical codes, while very large ones (e.g. version 40) are not kept.
const PATH_CACHE_BUDGET = 8_000_000;
const pathCache = new LRUCache<ReturnType<typeof Skia.Path.MakeFromSVGString>>(
  PATH_CACHE_BUDGET
);

const buildPath = (
  value: string,
  errorCorrectionLevel: ErrorCorrectionLevelType,
  size: number,
  shape: BaseShapeOptions | undefined,
  eyePatternShape: BaseShapeOptions | undefined,
  gap: number | undefined,
  eyePatternGap: number | undefined,
  logoAreaSize: number,
  logoAreaBorderRadius: number
) => {
  const modulesKey = JSON.stringify([errorCorrectionLevel, value]);
  const pathKey = JSON.stringify([
    modulesKey,
    size,
    shape,
    eyePatternShape,
    gap,
    eyePatternGap,
    logoAreaSize,
    logoAreaBorderRadius,
  ]);

  const cached = pathCache.get(pathKey);
  if (cached) return cached;

  let modules = modulesCache.get(modulesKey);
  if (!modules) {
    modules = generateModules(value, errorCorrectionLevel);
    modulesCache.set(modulesKey, modules);
  }

  const { path } = modulesToPath(
    modules.data,
    modules.size,
    size,
    { shape, eyePatternShape, gap, eyePatternGap },
    logoAreaSize,
    logoAreaBorderRadius
  );
  const skPath = Skia.Path.MakeFromSVGString(path)!;
  if (skPath && path.length <= PATH_CACHE_BUDGET / 4) {
    pathCache.set(pathKey, skPath, path.length);
  }
  return skPath;
};

export { buildPath };
