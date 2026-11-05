import { useState } from "react";
import { getCenteredSectionScrollTop } from "../utils/sectionNavigation";
import "./Navbar.css";

const enlaces = [
  { texto: "Inicio", href: "#inicio" },
  { texto: "Nosotros", href: "#nosotros" },
  { texto: "Servicios", href: "#servicios" },
  { texto: "Sectores", href: "#sectores" },
  { texto: "Contacto", href: "#contacto" },
];

function Navbar({ theme = "dark", scrolled = false, onToggleTheme }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const modoOscuro = theme === "dark";

  const cerrarMenu = () => setMenuAbierto(false);

  const navegarA = (event, href) => {
    cerrarMenu();
    if (href !== "#nosotros" && href !== "#servicios") return;

    event.preventDefault();
    const seccion = document.getElementById(href.slice(1));
    if (!seccion) return;

    window.history.pushState(null, "", href);
    const sectionTop = seccion.getBoundingClientRect().top + window.scrollY;
    const destino =
      href === "#servicios"
        ? getCenteredSectionScrollTop({
            sectionTop,
            sectionHeight: seccion.getBoundingClientRect().height,
            viewportHeight: window.innerHeight,
            headerHeight: document.querySelector(".navbar")?.getBoundingClientRect().bottom ?? 0,
          })
        : sectionTop - Math.min(window.innerHeight * 0.26, 250);
    window.scrollTo({ top: Math.max(0, destino), behavior: "smooth" });
  };

  return (
    <header
      className={`navbar ${modoOscuro ? "navbar--dark" : "navbar--light"} ${scrolled ? "navbar--scrolled" : ""}`}
    >
      <nav className="navbar__glass" aria-label="Navegación principal">
        <a
          className="navbar__brand"
          href="#inicio"
          aria-label="INGETEC, ir al inicio"
          onClick={cerrarMenu}
        >
          <img
            src="/assets/logo-ingetec.png"
            alt="INGETEC Ingeniería y Servicios"
            className="navbar__logo"
          />
        </a>

        <button
          className="navbar__menu-toggle"
          type="button"
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuAbierto}
          aria-controls="navbar-links"
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          <img src="/assets/icon-menu.png" alt="" />
        </button>

        <div
          id="navbar-links"
          className={`navbar__navigation ${menuAbierto ? "navbar__navigation--open" : ""}`}
        >
          <ul className="navbar__links">
            {enlaces.map((enlace) => (
              <li key={enlace.href}>
                <a
                  href={enlace.href}
                  className="navbar__link"
                  onClick={(event) => navegarA(event, enlace.href)}
                >
                  {enlace.texto}
                </a>
              </li>
            ))}
          </ul>

          <div className="navbar__actions">
            <div className="navbar__theme" aria-label="Cambiar apariencia">
              <button
                type="button"
                className={`navbar__theme-button ${!modoOscuro ? "is-active" : ""}`}
                aria-label="Activar modo claro"
                aria-pressed={!modoOscuro}
                onClick={() => modoOscuro && onToggleTheme?.()}
              >
                <img src="/assets/icon-sun.png" alt="" />
              </button>

              <button
                type="button"
                className={`navbar__theme-button ${modoOscuro ? "is-active" : ""}`}
                aria-label="Activar modo oscuro"
                aria-pressed={modoOscuro}
                onClick={() => !modoOscuro && onToggleTheme?.()}
              >
                <img src="/assets/icon-moon.png" alt="" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
