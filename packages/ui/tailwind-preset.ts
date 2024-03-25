/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '0%, 100%': {
            opacity: 1
          },
          '50%': {
            opacity: 0.5
          }
        }
      },
      animation: {
        shimmer: 'shimmer 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;'
      },
      borderRadius: {
        small: '12px',
        medium: '16px',
        large: '20px'
      },
      screens: {
        tablet: '640px',
        laptop: '1024px',
        desktop: '1280px',
        ultrawide: '1800px'
      },
      colors: {
        // card bg in dark
        cod: '#0a0a0a',
        // hover states
        smoke: '#1a1a1a',
        gallery: '#eaeaea',
        brand: {
          50: '#EECFE8',
          100: '#E2B0D8',
          200: '#E9A0DA',
          300: '#E283CF',
          400: '#D56BC0',
          500: '#bf60ac',
          600: '#7f4073',
          700: '#6a3560',
          800: '#552a4c',
          900: '#3f2039',
          950: '#2a1526'
        }
      }
    }
  },
  variants: { extend: {} }
}
