import type { Config } from "tailwindcss";

import baseConfig from "@refeed/tailwind-config";

export default {
  content: ["./components/**/*.tsx"],
  presets: [baseConfig],
} satisfies Config;
