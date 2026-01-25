import { defineConfig } from "astro/config";
import { fileURLToPath } from "url";

export default defineConfig({
  site: "https://あなたのドメイン.example",

  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
