import type { BaseSharedValue } from '../types';

// This function helps to manage the shared value as a normal value.
// If the value is a shared value, it will return the value property.
// Otherwise, it will return the value itself.
export const unwrapValue = <T>(val: T | BaseSharedValue<T>): T => {
  if ((val as BaseSharedValue<T>).value != null) {
    return (val as BaseSharedValue<T>).value;
  }
  return val as T;
};
