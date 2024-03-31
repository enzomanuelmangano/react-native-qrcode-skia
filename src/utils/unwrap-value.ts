import type { BaseSharedValue } from '../types';

export const unwrapValue = <T>(val: T | BaseSharedValue<T>): T => {
  if ((val as BaseSharedValue<T>).value != null) {
    return (val as BaseSharedValue<T>).value;
  }
  return val as T;
};
