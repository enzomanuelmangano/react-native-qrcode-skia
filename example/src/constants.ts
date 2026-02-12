export const Themes = {
  bitmap: {
    colors: ['#000000', '#000000'],
  },
  mono: {
    colors: ['#333333', '#181818'],
  },
  sand: {
    colors: ['#EED5B6', '#AF8856'],
  },
  forest: {
    colors: ['#506853', '#213223'],
  },
  breeze: {
    colors: ['#CF2F98', '#6A3DEC'],
  },
  candy: {
    colors: ['#A58EFB', '#E9BFF8'],
  },
  crimson: {
    colors: ['#FF6363', '#733434'],
  },
  falcon: {
    colors: ['#BDE3EC', '#363654'],
  },
  meadow: {
    colors: ['#59D499', '#A0872D'],
  },
  midnight: {
    colors: ['#4CC8C8', '#202033'],
  },
  raindrop: {
    colors: ['#8EC7FB', '#1C55AA'],
  },
  sunset: {
    colors: ['#FFCF73', '#FF7A2F'],
  },
} as const;

export type ThemeName = keyof typeof Themes;
export type Theme = (typeof Themes)[ThemeName];
