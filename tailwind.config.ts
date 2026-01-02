import type { Config } from "tailwindcss"
import tailwindAnimate from "tailwindcss-animate"

export default {
  plugins: [tailwindAnimate],
} as const satisfies Config
