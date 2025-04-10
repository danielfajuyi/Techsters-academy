/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      fontSize: {
        "course-deatails-heading-small": ["26px", "36px"],
        "course-deatails-heading-large": ["36px", "44px"],
        "home-heading-small": ["28px", "34px"],
        "home-heading-large": ["48px", "56px"],
        default: ["15px", "21px"],
      },

      gridTemplateColumns: {
        auto: "repeat(auto-fit, minmax(200px, 1fr))",
      },
      spacing: {
        "section-height": "500px",
      },
      maxWidth: {
        "course-card": "424px",
      },
      boxShadow: {
        "custom-card": "0px 4px 15px 2px rgba(0,0,0,0.1)",
      },
      colors: {
        "navbar-bg": "#0c1014",
        "hero-bg": "#111823",
        "span-color": "#FF2759",
        "text-color": "#CBCBCB",
        "link-color": "#4A4BFF",
        "active-color": "#FF2759",
      },
      backgroundImage: {
        "button-bg": "linear-gradient(90deg, #9e33ff 0%, #ff6ab1 100%)",
        "main-bg":
          "linear-gradient(180deg, rgba(17,24,35,0) 0%, #0C1014 51%, #0C1014 100%)",
        "hover-bg": "linear-gradient(90deg, #ff6ab1 0%, #9e33ff 100%)",
      },
    },
  },

  plugins: [],
};
