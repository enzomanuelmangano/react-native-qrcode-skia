const fakeSkia = (name: string) => ({
  Skia: { name },
  Canvas: () => null,
  Path: () => null,
  Group: () => null,
});

const missing = () => {
  throw new Error('Cannot find module');
};

const loadShim = () => {
  let shim: typeof import('../skia') | undefined;
  jest.isolateModules(() => {
    shim = require('../skia');
  });
  return shim!;
};

describe('skia', () => {
  afterEach(() => {
    jest.resetModules();
    jest.dontMock('react-native-skia');
    jest.dontMock('@shopify/react-native-skia');
  });

  it('uses react-native-skia (v3) when installed', () => {
    jest.doMock('react-native-skia', () => fakeSkia('v3'), { virtual: true });
    jest.doMock('@shopify/react-native-skia', () => fakeSkia('shopify'));

    expect(loadShim().Skia).toEqual({ name: 'v3' });
  });

  it('falls back to @shopify/react-native-skia (v1/v2)', () => {
    jest.doMock('react-native-skia', missing, { virtual: true });
    jest.doMock('@shopify/react-native-skia', () => fakeSkia('shopify'));

    expect(loadShim().Skia).toEqual({ name: 'shopify' });
  });

  it('exports the components used by the QR code', () => {
    jest.doMock('react-native-skia', () => fakeSkia('v3'), { virtual: true });

    const shim = loadShim();
    expect(shim.Canvas).toBeInstanceOf(Function);
    expect(shim.Path).toBeInstanceOf(Function);
    expect(shim.Group).toBeInstanceOf(Function);
  });

  it('throws a helpful error when neither package is installed', () => {
    jest.doMock('react-native-skia', missing, { virtual: true });
    jest.doMock('@shopify/react-native-skia', missing);

    expect(loadShim).toThrow(/Install `react-native-skia` \(v3\)/);
  });
});

export {};
