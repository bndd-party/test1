import { defineConfig } from "astro/config";
import { fileURLToPath } from "url";

export default defineConfig({
  site: "https://kit-connect.netlify.app/",

  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
