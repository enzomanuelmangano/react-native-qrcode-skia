// No-op implementation for native (Expo Go doesn't support burnt)
export const toast = (_options: {
  title: string;
  message?: string;
  preset?: string;
  haptic?: string;
  duration?: number;
  shouldDismissByDrag?: boolean;
  icon?: unknown;
}) => {};

export const alert = (_options: unknown) => {};

export const dismissAllAlerts = () => {};

// Toaster is web-only, provide empty component for native
export const Toaster = () => null;
