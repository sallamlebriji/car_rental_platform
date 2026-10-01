/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["Manrope", "Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        brand: {
          DEFAULT: "var(--primary-color)",
          accent: "var(--secondary-color)"
        },
        ink: {
          950: "#070b14",
          900: "#0b1220",
          800: "#141c2e",
          700: "#1f2937"
        },
        canvas: "#f5f6f8"
      },
      borderRadius: {
        // Radius hierarchy: info < secondary < primary
        "card-info": "1rem",
        "card-secondary": "1.25rem",
        "card-primary": "1.75rem"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(11, 18, 32, 0.04), 0 12px 32px -12px rgba(11, 18, 32, 0.12)",
        lift: "0 2px 4px rgba(11, 18, 32, 0.04), 0 24px 48px -20px rgba(11, 18, 32, 0.22)",
        deep: "0 2px 6px rgba(7, 11, 20, 0.2), 0 40px 80px -30px rgba(7, 11, 20, 0.55)",
        glow: "0 0 0 1px color-mix(in srgb, var(--primary-color) 30%, transparent), 0 10px 30px -10px color-mix(in srgb, var(--primary-color) 55%, transparent)"
      },
      transitionTimingFunction: {
        calm: "cubic-bezier(0.22, 1, 0.36, 1)"
      },
      transitionDuration: {
        calm: "400ms"
      },
      zIndex: {
        sidebar: "30",
        topbar: "40",
        overlay: "50",
        drawer: "60",
        toast: "70"
      },
      screens: {
        xs: "480px"
      }
    }
  },
  plugins: []
};
