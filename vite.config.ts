import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // met à jour le service worker automatiquement
      manifest: {
        name: "CyclesSync", // nom de l'app
        short_name: "Cycles", // nom court affiché sur l’écran d’accueil
        description: "Suivi de cycles sur mobile",
        theme_color: "#242424",
        background_color: "#ffffff",
        display: "standalone", // clé pour ressembler à une app native
        scope: "/",
        start_url: "/",
        icons: [
          { src: "/icons/icon_72.png", sizes: "72x72", type: "image/png" },
          { src: "/icons/icon_96.png", sizes: "96x96", type: "image/png" },
          { src: "/icons/icon_128.png", sizes: "128x128", type: "image/png" },
          { src: "/icons/icon_144.png", sizes: "144x144", type: "image/png" },
          { src: "/icons/icon_152.png", sizes: "152x152", type: "image/png" },
          { src: "/icons/icon_192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon_512.png", sizes: "512x512", type: "image/png" },
        ],
      },
    }),
  ],
});
