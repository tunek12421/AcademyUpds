/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./src/cursos/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#223B87',
          50: '#223B87',
          100: '#223B87',
          500: '#223B87',
          600: '#223B87',
          700: '#223B87',
          foreground: '#FFFFFF',
          hover: '#7FB5FF',
          select: '#7FB5FF',
        },
        secondary: {
          DEFAULT: "hsl(210 40% 96%)",
          50: '#fffcf0',
          100: '#fff8d4',
          500: "hsl(210 40% 96%)",
          600: "hsl(210 40% 96%)",
          700: "hsl(210 40% 96%)",
        },
        accent: {
          DEFAULT: '#c6f2ff',
          50: '#c6f2ff',
          100: '#c6f2ff',
          500: '#c6f2ff',
          600: '#c6f2ff',
          700: '#c6f2ff',
        },
        success: {
          DEFAULT: '#25d366',
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#25d366',
          600: '#16a34a',
          700: '#15803d',
        },
        info: {
          DEFAULT: '#007bff',
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#007bff',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      fontFamily: {
        'primary': ['Roboto', 'Arial', 'Tahoma', 'Verdana', 'sans-serif'],
        'heading': ['Montserrat', 'Arial', 'Tahoma', 'Verdana', 'sans-serif'],
      },
      fontSize: {
        'base': '17px',
        'h1': '50px',
        'h2': '32px',
        'h3': '22px',
      },
      spacing: {
        'xs': '5px',
        'sm': '10px',
        'md': '20px',
        'lg': '40px',
        'xl': '60px',
      },
      aspectRatio: {
        square: '1 / 1',
        logo: '4 / 1',
      },
    },
  },
  plugins: [
  ],
}
