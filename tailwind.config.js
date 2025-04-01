module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Adjust this to your file paths
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--primary-color)",
          seconday: "var(--secondary-color)",
          default: "#F4B728",
        },
      },
    },
  },
};
