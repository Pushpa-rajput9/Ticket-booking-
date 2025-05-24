/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "bg-blue-to-red": {
          "0%": { backgroundColor: "rgb(220, 38, 38)" }, // blue-600
          "50%": { backgroundColor: "rgb(220, 38, 38)" }, // red-600
          "100%": { backgroundColor: "rgb(37, 99, 235)" }, // back to blue
        },
        popUp: {
          "0%": { opacity: 0, transform: "scale(0.9)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        popOut: {
          "0%": { opacity: 1, transform: "scale(1)" },
          "100%": { opacity: 0, transform: "scale(0.8)" },
        },
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        moveUp: {
          "0%": { transform: "translateY(20%)" },
          "100%": { transform: "translateY(0%)" },
        },
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "scale(1)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1.3) ",
          },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.6s ease-in-out",
        fadeIn: "fadeIn 0.3s ease-in-out",
        slideIn: "slideIn 0.5s ease-out",
        popUp: "popUp 0.3s ease-out ",
        popOut: "popOut 0.3s ease-in",
        moveUp: "moveUp 0.5s ease-in-out forwards",
        flashRed: "bg-blue-to-red 3s ease-in-out ",
      },
    },
  },

  plugins: [],
};
