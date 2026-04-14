import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  server: {
    open: true,
  },
  plugins: [glsl()],
});
