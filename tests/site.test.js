import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { after, before, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { getCenteredSectionScrollTop } from "../src/utils/sectionNavigation.js";
import { getImageLoadState } from "../src/utils/imageLoading.js";

const projectRoot = process.cwd();
let vite;
let html;
let skeletonMarkup;
let missingImageMarkup;

before(async () => {
  vite = await createServer({
    configFile: path.join(projectRoot, "vite.config.js"),
    appType: "custom",
    logLevel: "silent",
    server: { middlewareMode: true, hmr: false },
  });

  const [{ default: App }, { default: SkeletonImage }] = await Promise.all([
    vite.ssrLoadModule("/src/App.jsx"),
    vite.ssrLoadModule("/src/components/SkeletonImage.jsx"),
  ]);

  html = renderToStaticMarkup(React.createElement(App));
  skeletonMarkup = renderToStaticMarkup(
    React.createElement(SkeletonImage, {
      src: "/assets/skeleton-test.png",
      alt: "Imagen de prueba",
    }),
  );
  missingImageMarkup = renderToStaticMarkup(
    React.createElement(SkeletonImage, { src: "", alt: "Imagen opcional" }),
  );
});

after(async () => {
  await vite?.close();
});

test("renderiza las cinco secciones principales y las regiones accesibles", () => {
  for (const id of ["inicio", "servicios", "nosotros", "sectores", "contacto"]) {
    assert.match(html, new RegExp(`id="${id}"`), `Falta la sección #${id}`);
  }

  assert.match(html, /aria-label="Navegación principal"/);
  assert.match(html, /<main>/);
  assert.match(html, /<footer class="footer">/);
});

test("muestra las cuatro tarjetas de servicios y los cinco sectores", () => {
  const serviceCards = html.match(/<article class="service-card"/g) ?? [];
  assert.equal(serviceCards.length, 4);

  const sectorGrid = html.match(/<div class="sector-grid">([\s\S]*?)<\/div><\/section>/)?.[1];
  assert.ok(sectorGrid, "No se encontró la cuadrícula de sectores");
  assert.equal((sectorGrid.match(/<article/g) ?? []).length, 5);
});

test("mantiene controles requeridos en el formulario de cotización", () => {
  assert.match(html, /<form class="contact-form"/);
  assert.match(html, /<input(?=[^>]*type="email")(?=[^>]*required)[^>]*>/);
  assert.match(html, /<input(?=[^>]*name="nombre")(?=[^>]*required)[^>]*>/);
  assert.match(html, /<textarea(?=[^>]*name="mensaje")(?=[^>]*required)[^>]*>/);
});

test("las imágenes de servicios y Nosotros muestran su skeleton durante la carga", () => {
  assert.equal((html.match(/class="skeleton-image"/g) ?? []).length, 5);
  assert.equal((html.match(/class="skeleton-image__placeholder"/g) ?? []).length, 5);
  assert.match(html, /aria-busy="true"/);
});

test("el skeleton conserva el texto alternativo y renderiza la imagen diferida", () => {
  assert.match(skeletonMarkup, /data-image-state="loading"/);
  assert.match(skeletonMarkup, /aria-busy="true"/);
  assert.match(skeletonMarkup, /aria-hidden="true"/);
  assert.match(skeletonMarkup, /src="\/assets\/skeleton-test.png"/);
  assert.match(skeletonMarkup, /alt="Imagen de prueba"/);
  assert.match(skeletonMarkup, /loading="lazy"/);
});

test("el estado de imagen cubre carga pendiente, éxito y fallo", () => {
  assert.equal(getImageLoadState(null), "loading");
  assert.equal(getImageLoadState(undefined), "loading");
  assert.equal(getImageLoadState({ complete: false, naturalWidth: 0 }), "loading");
  assert.equal(getImageLoadState({ complete: true, naturalWidth: 960 }), "loaded");
  assert.equal(getImageLoadState({ complete: true, naturalWidth: 0 }), "error");
  assert.equal(getImageLoadState({ complete: true }), "error");
  assert.equal(getImageLoadState({ complete: true, naturalWidth: Number.NaN }), "error");
});

test("una imagen sin origen muestra un fallback accesible", () => {
  assert.match(missingImageMarkup, /data-image-state="error"/);
  assert.match(missingImageMarkup, /aria-busy="false"/);
  assert.match(missingImageMarkup, /role="img" aria-label="Imagen opcional"/);
  assert.match(missingImageMarkup, /Imagen no disponible/);
  assert.doesNotMatch(missingImageMarkup, /<img\b/);
});

test("todas las imágenes locales usadas en el HTML existen", () => {
  const imagePaths = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.ok(imagePaths.length > 0, "No se encontraron imágenes locales");

  for (const imagePath of imagePaths) {
    assert.ok(
      existsSync(path.join(projectRoot, "public", imagePath.slice(1))),
      `No existe el recurso ${imagePath}`,
    );
  }
});

test("centra la sección Servicios en el espacio visible debajo del menú fijo", () => {
  const scrollTop = getCenteredSectionScrollTop({
    sectionTop: 1800,
    sectionHeight: 760,
    viewportHeight: 900,
    headerHeight: 90,
  });

  assert.equal(scrollTop, 1685);
  const sectionTopInViewport = 1800 - scrollTop;
  const usableViewportCenter = 90 + (900 - 90) / 2;
  assert.equal(sectionTopInViewport + 760 / 2, usableViewportCenter);
});

test("no desplaza la sección por encima del menú cuando es más alta que la pantalla", () => {
  const scrollTop = getCenteredSectionScrollTop({
    sectionTop: 1200,
    sectionHeight: 1200,
    viewportHeight: 800,
    headerHeight: 88,
  });

  assert.equal(1200 - scrollTop, 88);
});
