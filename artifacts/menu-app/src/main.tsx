import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

// 🔥 Backend URL set karo - YEH SABSE IMPORTANT LINE HAI!
const apiUrl = import.meta.env.VITE_API_URL;


if (apiUrl) {
  setBaseUrl(apiUrl);
  console.log("✓ Backend URL set:", apiUrl);
} else {
  console.error("✗ VITE_API_URL not set in environment!");
}

// Register Service Worker for offline support
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✓ Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.log('✗ Service Worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
