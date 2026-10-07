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

// Small least-recently-used cache: a Map keeps insertion order, so the first
// key is the least recently used one.
class LRUCache<V> {
  private map = new Map<string, V>();
  constructor(private capacity: number) {}

  get(key: string): V | undefined {
    const value = this.map.get(key);
    if (value !== undefined) {
      this.map.delete(key);
      this.map.set(key, value);
    }
    return value;
  }

  set(key: string, value: V) {
    this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      this.map.delete(this.map.keys().next().value!);
    }
  }
}

// Encoding a value is the expensive part and does not depend on how the code is
// drawn, so modules are cached separately from paths (e.g. resizing a QR code
// reuses its modules).
const modulesCache = new LRUCache<Modules>(128);
const pathCache = new LRUCache<ReturnType<typeof Skia.Path.MakeFromSVGString>>(
  64
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
  const modulesKey = `${errorCorrectionLevel}|${value}`;
  const pathKey = `${size}|${shape}|${eyePatternShape}|${gap}|${eyePatternGap}|${logoAreaSize}|${logoAreaBorderRadius}|${modulesKey}`;

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
  if (skPath) pathCache.set(pathKey, skPath);
  return skPath;
};

export { buildPath };
