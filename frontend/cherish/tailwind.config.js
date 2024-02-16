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
        "text-black": "#505050",
        "text-gray": "#9D9D9D",
      },
      gridTemplateColumns: {
        mainLayout: "150px 152px repeat(10, 1fr)",
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
      }
    },
    fontFamily: {
      light : ["GmarketSansTTFMedium"],
      bold : ["GmarketSansTTFBold"],
      gamja : ["GamjaFlower-Regular"]
    },
    keyframes: {
      bounce: {
        '0%, 100%': {
          transform: 'translateY(-10%)',
          'animation-timing-function': 'cubic-bezier(0.8,0,1,1)',
        },
        '50%': {
          transform: 'none',
          'animation-timing-function': 'cubic-bezier(0,0,0.2,1)',
        },
      },
      wiggle: {
        '0%, 100%': { transform: 'rotate(-3deg)' },
        '50%': { transform: 'rotate(3deg)' },
      }
    },
  },
  plugins: [require("daisyui")],
};
