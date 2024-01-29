import million from "million/compiler";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "./",
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  plugins: [million.vite({ auto: true }), react()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  assetsInclude: ["**/*.jpg"],
});
