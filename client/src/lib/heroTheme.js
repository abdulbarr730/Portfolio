// 60 / 30 / 10 hero palette: near-black (60%), white (30%) and the site's
// admin-chosen accent colour (10%). Applied as scoped CSS variables, so only
// the hero (and the navbar while it sits over the hero) goes dark.
import { hexToRgbTriplet } from './color';

// Relative luminance of a hex colour (0 = black, 1 = white)
function luminance(hex) {
  const rgb = hexToRgbTriplet(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.split(' ').map((v) => {
    const c = Number(v) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function heroThemeVars(heroTheme, accentHex) {
  if (heroTheme && heroTheme.dark === false) return undefined;
  return {
    '--c-background': '10 10 10', //  #0A0A0A  (60%)
    '--c-surface': '24 24 24',
    '--c-muted': '36 36 36',
    '--c-primary': '245 245 242', //  near-white text (30%)
    '--c-secondary': '160 160 155',
    // text on accent-coloured buttons: dark on light accents, white on dark ones
    '--c-ink': luminance(accentHex) > 0.4 ? '10 10 10' : '255 255 255',
    // --accent-rgb is NOT overridden: the hero uses the admin brand colour (the 10%)
    colorScheme: 'dark',
  };
}
