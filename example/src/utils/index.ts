// Thanks Claude & Cursor for this :)
// Claude.new

const hslToHex = (h: number, s: number, l: number): string => {
  h = h % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else if (h >= 300 && h < 360) {
    [r, g, b] = [c, 0, x];
  }

  const toHex = (value: number) => {
    return Math.round((value + m) * 255)
      .toString(16)
      .padStart(2, '0');
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const generateHarmonizedColors = (count: number = 5): string[] => {
  const baseHue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.random() * 20; // 70-90%
  const lightness = 40 + Math.random() * 20; // 40-60%

  return Array.from({ length: count }, (_, i) => {
    const hue = (baseHue + i * (360 / count)) % 360;
    return hslToHex(hue, saturation, lightness);
  });
};
