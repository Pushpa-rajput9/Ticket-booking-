// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Booking-", // IMPORTANT: must match GitHub repo name
  plugins: [react()],
});
