/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/screens/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "poppins-regular": ["Poppins-Regular"],
        "poppins-bold": ["Poppins-Bold"],
        "poppins-extra-bold": ["Poppins-ExtraBold"],
        "poppins-light": ["Poppins-Light"],
        "poppins-medium": ["Poppins-Medium"],
        "poppins-semi-bold": ["Poppins-SemiBold"],
      },
    },
  },
  plugins: [],
};
