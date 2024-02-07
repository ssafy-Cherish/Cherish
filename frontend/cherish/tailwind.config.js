/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cherry: "#FD8680",
        pink: "#FFEDEB",
        beige: "#FEF8EC",
        skyblue: "#E0F4FF",
        subpuple: "#B893F5",
        "text-black": "#685454",
        "text-gray": "#9D9D9D",
      },
      gridTemplateColumns: {
        mainLayout: "150px 152px repeat(10, 1fr)",
      },
    },
  },
  plugins: [require("daisyui")],
};
