import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(async () => {
        const registration = await navigator.serviceWorker.ready;
        const documentAssets = [
          ...Array.from(document.querySelectorAll("img[src]"), (image) => image.getAttribute("src")),
          ...Array.from(document.querySelectorAll("source[srcset]"), (source) =>
            source
              .getAttribute("srcset")
              .split(",")
              .map((candidate) => candidate.trim().split(/\s+/)[0]),
          ).flat(),
          ...Array.from(
            document.querySelectorAll('script[src], link[rel="stylesheet"], link[rel="icon"]'),
            (element) => element.getAttribute("src") || element.getAttribute("href"),
          ),
          "/assets/sectors-industrial.png",
          "/assets/logo-ingetec-cobalt-transparent.png",
          "/assets/logo-ingetec-navy-transparent.png",
        ].filter(Boolean);

        registration.active?.postMessage({ type: "CACHE_URLS", urls: documentAssets });
      })
      .catch((error) => console.error("No se pudo activar el modo sin conexión:", error));
  });
}
