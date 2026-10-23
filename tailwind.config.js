const { DEFAULT_CIPHERS } = require("node:tls");

module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Adjust this to your file paths
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screen: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        border: "hsl(var(--border)",
        input: "hsl(var(--input)",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        zcash: {
          gold: "hsl(var(--zcash-gold))",
          "gold-dim": "hsl(var(--zcash-gold-dim))",
          navy: "hsl(var(--zcash-navy))",
          "navy-light": "hsl(var(--zcash-navy-light))",
          green: "hsl(var(--zcash-green))",
          blue: "hsl(var(--zcash-blue))",
        },
        brand: {
          primary: "var(--primary-color)",
          secondary: "var(--secondary-color)",
          default: "#F4B728",
        },
      },
    },
  },
};
