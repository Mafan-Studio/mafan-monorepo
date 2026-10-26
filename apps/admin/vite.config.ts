import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Fixed ports so the admin (4200) and the public site (3200) can run side
  // by side.
  server: { port: 4200, strictPort: true },
  preview: { port: 4200, strictPort: true },
});
