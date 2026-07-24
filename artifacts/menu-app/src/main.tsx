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

// Remove the legacy cache-first PWA. It cached navigation HTML and could pin
// mobile users to an old JavaScript bundle after a deployment.
if ('serviceWorker' in navigator) {
  void navigator.serviceWorker.getRegistrations().then((registrations) =>
    Promise.all(registrations.map((registration) => registration.unregister())),
  );
}
if ('caches' in window) {
  void caches.keys().then((names) => Promise.all(names.map((name) => caches.delete(name))));
}

createRoot(document.getElementById("root")!).render(<App />);
