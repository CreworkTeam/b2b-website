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
        scaledown: {
          '40%': { transform: 'scale(1)', opacity: 1 },
          '70%': { opacity: 1 },
          '100%': { transform: 'scale(var(--scale))', top: 'calc(15vh)', opacity: 0.4 },
        },
        'border-beam': {
          '100%': {
            'offset-distance': '100%',
          },
        },
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        marquee2: 'marquee2 25s linear infinite',
        scaledown: 'scaledown 1s linear forwards paused',
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
