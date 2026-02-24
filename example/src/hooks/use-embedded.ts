import { Platform } from 'react-native';

declare const window: { self: unknown; top: unknown } | undefined;

const getIsEmbedded = (): boolean => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return false;
  }

  try {
    return window.self !== window.top;
  } catch {
    // Cross-origin iframe - we're embedded
    return true;
  }
};

export const isEmbedded = Platform.OS === 'web' && getIsEmbedded();
