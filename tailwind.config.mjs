/** @type {import('tailwindcss').Config} */
const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette');

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    supports: {
      'scroll-timeline': '(animation-timeline: scroll())',
      'no-scroll-timeline': 'not (animation-timeline: scroll())',
    },
    extend: {
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        scaledown2: {
          '0%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(0.95)' },
        },
        scaledown1: {
          '0%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(0.8)' },
        },
        'border-beam': {
          '100%': {
            'offset-distance': '100%',
          },
        },
      },
      animation: {
        marquee: 'marquee 50s linear infinite',
        marquee2: 'marquee2 50s linear infinite',
        scaledown1: 'scaledown1 0.5s ease-in-out forwards',
        scaledown2: 'scaledown2 0.5s ease-in-out forwards',
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
      },
    },
  },
  plugins: [addVariablesForColors],
};

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme('colors'));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  );

  addBase({
    ':root': newVars,
  });
}
