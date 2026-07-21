import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://franchisor.id",
  output: "static",
  trailingSlash: "never",
  build: {
    format: "preserve",
  },
});
