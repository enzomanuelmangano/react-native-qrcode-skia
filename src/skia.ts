import type { ComponentType, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

// React Native Skia is published under two names:
// - `react-native-skia` (v2.15+ and v3, Graphite)
// - `@shopify/react-native-skia` (v1 and v2 up to 2.14)
// The drawing API used by this library is identical in both, so we resolve
// whichever one the app has installed.
//
// Each `require` must stay directly inside its `try` block: Metro (and webpack)
// treat it as an optional dependency, so a missing package does not break the
// bundle and only throws at runtime, where the `catch` handles it.

// The subset of the Skia API used by this library, typed locally so the
// package builds against either name. CI checks that both packages satisfy it,
// with `SkPath` set to each package's own path type.
export type SkiaModule<SkPath = unknown> = {
  Skia: {
    Path: {
      MakeFromSVGString: (svg: string) => SkPath | null;
    };
  };
  Canvas: ComponentType<{
    style?: StyleProp<ViewStyle>;
    children?: ReactNode;
  }>;
  Group: ComponentType<{
    transform?: ({ translateX: number } | { translateY: number })[];
    children?: ReactNode;
  }>;
  Path: ComponentType<{
    path: SkPath;
    color?: string;
    style?: 'fill' | 'stroke';
    strokeWidth?: number;
    children?: ReactNode;
  }>;
};

const loadSkia = (): SkiaModule => {
  try {
    return require('react-native-skia');
  } catch {}
  try {
    return require('@shopify/react-native-skia');
  } catch {}
  throw new Error(
    "react-native-qrcode-skia: couldn't find React Native Skia. Install `react-native-skia` (v3) or `@shopify/react-native-skia` (v1/v2)."
  );
};

export const { Skia, Canvas, Path, Group } = loadSkia();
