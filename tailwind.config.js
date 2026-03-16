const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '480px'
      },
      colors: {
        // ── Backward-compatible names (old purple → new warm palette) ──
        veryDarkPurple: '#1E1C19',
        darkPurple: '#3D3A35',
        purple: '#C8A96E',
        lightPurple: '#EDE8DE',
        veryLightPurple: '#F5F2EB',

        // ── New semantic aliases ──
        espresso: '#1E1C19',
        charcoal: '#3D3A35',
        gold: '#C8A96E',
        'gold-light': '#D4BA85',
        'gold-dark': '#A8894E',
        'gold-muted': '#C8A96E1A',
        sand: '#EDE8DE',
        cream: '#F5F2EB',
        'white-warm': '#FAFAF7',
        stone: '#D4CFC4',
        'warm-gray': '#8A857A',
        success: '#6B8F71',
        error: '#C4635A'
      },
      fontFamily: {
        sans: ['var(--cairo)', 'Instrument Sans', 'sans-serif'],
        cairo: ['var(--cairo)', 'sans-serif']
      },
      boxShadow: {
        warm: '0 2px 8px rgba(30, 28, 25, 0.08)',
        'warm-md': '0 4px 16px rgba(30, 28, 25, 0.10)',
        'warm-lg': '0 8px 32px rgba(30, 28, 25, 0.12)',
        'warm-xl': '0 16px 48px rgba(30, 28, 25, 0.16)'
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 }
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        blink: {
          '0%': { opacity: 0.2 },
          '20%': { opacity: 1 },
          '100% ': { opacity: 0.2 }
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(50px)' },
          '100% ': { opacity: 1, transform: 'translateY(0px)' }
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100% ': { opacity: 0 }
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        },
        whatsappPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.5)' },
          '50%': { boxShadow: '0 0 0 12px rgba(37, 211, 102, 0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn .3s ease-in-out',
        carousel: 'marquee 60s linear infinite',
        blink: 'blink 1.4s both infinite',
        fadeUp: 'fadeUp 0.5s ease-out forwards',
        fadeUpDelay: '0.5s ease-out 0.25s forwards fadeUp',
        fadeOut: 'fadeOut 0.5s ease-out forwards',
        shimmer: 'shimmer 2s ease-in-out infinite',
        whatsappPulse: 'whatsappPulse 2s ease-in-out infinite'
      }
    }
  },
  future: {},
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/typography'),
    require('tailwindcss-3d'),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'animation-delay': (value) => {
            return {
              'animation-delay': value
            };
          }
        },
        {
          values: theme('transitionDelay')
        }
      );
    })
  ]
};
