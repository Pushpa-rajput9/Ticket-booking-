// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Ticket-booking-", // IMPORTANT: must match GitHub repo name
  plugins: [react()],
});
