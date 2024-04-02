import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        secondary: {
          DEFAULT: colors.gray[200],
          hover: colors.gray[300],
          border: colors.gray[400],
          text: colors.gray[500],
          dark: colors.black,
          ["dark-hover"]: colors.gray[900],
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
