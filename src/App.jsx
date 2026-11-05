import {
  ArrowRight,
  ArrowUp,
  Building2,
  Factory,
  Mail,
  MapPin,
  Phone,
  Settings,
  Wrench,
  Zap,
  Eye,
  Users,
  HardHat,
  Truck,
  Landmark,
  Store,
  X,
  Check,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SkeletonImage from "./components/SkeletonImage";
import WhatsAppButton from "./components/WhatsAppButton";
import "./App.css";
import "./components/ServiceCards.css";
import "./components/ScrollReveal.css";
import "./components/HeroScroll.css";
import "./components/AboutLayout.css";
import "./components/AppleStyle.css";
import "./components/PageMotion.css";
import "./components/ServiceDialog.css";
import "./components/PageLoad.css";
import "./components/MobileLayout.css";

const servicios = [
  {
    icon: Zap,
    imagen: "/assets/service-electrical.png",
    titulo: "Sistemas Eléctricos",
    texto:
      "Instalaciones y mantenimiento eléctrico industrial y domiciliario, tableros y puesta a tierra.",
    detalle:
      "Diseñamos, instalamos y mantenemos sistemas eléctricos seguros y eficientes para empresas, industrias y hogares.",
    incluye: ["Instalaciones eléctricas y tableros", "Mantenimiento preventivo y correctivo", "Puesta a tierra y diagnóstico"],
  },
  {
    icon: Settings,
    imagen: "/assets/service-machinery.png",
    titulo: "Mantenimiento de Maquinarias",
    texto: "Motores eléctricos, motores de combustión, electrobombas y compresoras de aire.",
    detalle:
      "Ayudamos a mantener tus equipos en operación con diagnóstico técnico, reparación y planes de mantenimiento.",
    incluye: ["Motores eléctricos y de combustión", "Electrobombas y compresoras", "Diagnóstico y mantenimiento de equipos"],
  },
  {
    icon: Building2,
    imagen: "/assets/service-metalwork.png",
    titulo: "Estructuras Metálicas y Soldadura",
    texto: "Fabricación, montaje y certificaciones de calidad para tus proyectos.",
    detalle:
      "Desarrollamos trabajos metalmecánicos a medida, desde la fabricación hasta el montaje en obra.",
    incluye: ["Fabricación de estructuras metálicas", "Trabajos de soldadura", "Montaje y control de calidad"],
  },
  {
    icon: Wrench,
    imagen: "/assets/service-electromechanical.png",
    titulo: "Servicios Electromecánicos",
    texto: "Diagnóstico, reparación y operatividad de equipos y herramientas.",
    detalle:
      "Integramos soluciones mecánicas y eléctricas para recuperar el rendimiento y la confiabilidad de tus equipos.",
    incluye: ["Evaluación y diagnóstico técnico", "Reparación de equipos y herramientas", "Puesta en marcha y soporte"],
  },
];
const sectores = [
  { icon: Factory, texto: "Industria\nManufacturera" },
  { icon: Settings, texto: "Fábricas y\nPlantas de Producción" },
  { icon: Truck, texto: "Empresas de\nTransporte" },
  { icon: Landmark, texto: "Sector Público" },
  { icon: Store, texto: "Comercio" },
];

function App() {
  const [theme, setTheme] = useState("light");
  const [scrolled, setScrolled] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const serviceDialogRef = useRef(null);
  const navigateToContactRef = useRef(false);

  useEffect(() => {
    const dialog = serviceDialogRef.current;
    if (!selectedService || !dialog || dialog.open) return undefined;

    const body = document.body;
    const root = document.documentElement;
    const scrollY = window.scrollY;
    const previousBodyStyles = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      overscrollBehavior: body.style.overscrollBehavior,
      paddingRight: body.style.paddingRight,
    };
    const previousScrollBehavior = root.style.scrollBehavior;
    const scrollbarWidth = window.innerWidth - root.clientWidth;

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    dialog.showModal();

    return () => {
      Object.assign(body.style, previousBodyStyles);
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      root.style.scrollBehavior = previousScrollBehavior;
    };
  }, [selectedService]);

  useEffect(() => {
    if (selectedService || !navigateToContactRef.current) return;

    navigateToContactRef.current = false;
    requestAnimationFrame(() => {
      document.getElementById("contacto")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [selectedService]);

  useLayoutEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 32);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    const targets = document.querySelectorAll(
      ".section-heading, .service-card, .about-photo, .about-copy, .values article, .sectors > .eyebrow, .sectors > h2, .sectors > p:not(.eyebrow), .sector-grid article, .contact-info > *, .contact-form, .footer > div",
    );
    const root = document.documentElement;
    root.classList.add("has-scroll-reveal");
    targets.forEach((element) => element.classList.add("scroll-reveal"));

    if (!("IntersectionObserver" in window)) {
      targets.forEach((element) => element.classList.add("is-visible"));
      return () => {
        window.removeEventListener("scroll", updateScrollState);
        root.classList.remove("has-scroll-reveal");
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
    );
    targets.forEach((element) => observer.observe(element));

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
      root.classList.remove("has-scroll-reveal");
    };
  }, []);

  return (
    <div className={`app app--${theme}`}>
      <Navbar
        theme={theme}
        scrolled={scrolled}
        onToggleTheme={() => setTheme((actual) => (actual === "light" ? "dark" : "light"))}
      />
      <Hero />
      <main>
        <section id="servicios" className="section services">
          <div className="section-heading">
            <div>
              <p className="eyebrow">NUESTROS SERVICIOS</p>
              <h2>
                Soluciones integrales para <span>cada necesidad</span>
              </h2>
              <p className="section-lead">
                Brindamos un portafolio de servicios diseñado para generar valor en cada etapa de tu
                proyecto.
              </p>
            </div>
            <a className="text-link" href="#contacto">
              Ver todos los servicios <ArrowRight size={16} />
            </a>
          </div>
          <div className="service-grid">
            {servicios.map(({ icon: Icon, imagen, titulo, texto, detalle, incluye }) => (
              <article className="service-card" key={titulo}>
                <div className="service-image">
                  <SkeletonImage src={imagen} alt={titulo} />
                </div>
                <div className="service-copy">
                  <span className="service-icon">
                    <Icon size={23} />
                  </span>
                  <h3>{titulo}</h3>
                  <p>{texto}</p>
                  <button
                    type="button"
                    aria-label={`Más información sobre ${titulo}`}
                    aria-haspopup="dialog"
                    onClick={() => setSelectedService({ icon: Icon, imagen, titulo, detalle, incluye })}
                  >
                    <ArrowRight size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section id="nosotros" className="about">
          <div className="about-photo">
            <SkeletonImage
              src="/assets/about-team-branded.png"
              alt="Dos ingenieros revisan un proyecto en una planta industrial"
            />
            <div className="team-badge">
              <Users size={32} />
              <strong>
                Equipo multidisciplinario
                <br />
                altamente calificado
              </strong>
            </div>
          </div>
          <div className="about-copy">
            <p className="eyebrow">NOSOTROS</p>
            <h2>
              Comprometidos con
              <br />
              el desarrollo de <span>tu industria</span>
            </h2>
            <p>
              Somos una empresa especializada en soluciones integrales de ingeniería, arquitectura y
              servicios electromecánicos, orientada a brindar un servicio completo que abarca desde
              la asesoría técnica y el diseño, hasta la ejecución, supervisión y certificación de
              proyectos.
            </p>
            <div className="values">
              <article>
                <span>
                  <HardHat size={22} />
                </span>
                <h3>Misión</h3>
                <p>
                  Brindar soluciones integrales con altos estándares de calidad, seguridad y
                  eficiencia.
                </p>
              </article>
              <article>
                <span>
                  <Eye size={22} />
                </span>
                <h3>Visión</h3>
                <p>
                  Ser una empresa líder y referente a nivel nacional, reconocida por la innovación y
                  confiabilidad.
                </p>
              </article>
            </div>
          </div>
        </section>
        <section id="sectores" className="sectors">
          <p className="eyebrow">SECTORES ATENDIDOS</p>
          <h2>
            Impulsamos <span>múltiples industrias</span>
          </h2>
          <p>
            Conocemos los desafíos de cada sector y brindamos soluciones adaptadas a su realidad.
          </p>
          <div className="sector-grid">
            {sectores.map(({ icon: Icon, texto }) => (
              <article key={texto}>
                <Icon size={29} />
                <span>
                  {texto.split("\n").map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </span>
              </article>
            ))}
          </div>
        </section>
        <section id="contacto" className="contact">
          <div className="contact-info">
            <p className="eyebrow">CONTÁCTANOS</p>
            <h2>
              Hablemos de <span>tu proyecto</span>
            </h2>
            <p className="section-lead">
              Completa el formulario y nos pondremos en contacto contigo a la brevedad.
            </p>
            <a className="contact-detail" href="tel:+51927547705">
              <span>
                <Phone />
              </span>
              <div>
                <small>Teléfono</small>
                <strong>
                  {" "}
                  927547705 <br />
                  984321510
                </strong>
              </div>
            </a>
            <a className="contact-detail" href="mailto:Ingetec.electroMecanica@gmail.com">
              <span>
                <Mail />
              </span>
              <div>
                <small>Correo electrónico</small>
                <strong>Ingetec.electroMecanica@gmail.com</strong>
              </div>
            </a>
            <div className="contact-detail contact-detail--address">
              <span>
                <MapPin />
              </span>
              <div>
                <small>Dirección</small>
                <strong>
                  Av. Brasil 3343, Magdalena del Mar
                  <br />
                  Lima, Perú
                </strong>
              </div>
            </div>
          </div>
          <form
            className="contact-form"
            action="mailto:Ingetec.electroMecanica@gmail.com"
            method="post"
            encType="text/plain"
          >
            <h3>Solicita una cotización</h3>
            <p>Cuéntanos sobre tu proyecto y te asesoraremos.</p>
            <div className="form-row">
              <label>
                Nombre completo
                <input name="nombre" placeholder="Tu nombre" required />
              </label>
              <label>
                Correo electrónico
                <input type="email" name="correo" placeholder="tucorreo@ejemplo.com" required />
              </label>
            </div>
            <label>
              Empresa (opcional)
              <input name="empresa" placeholder="Nombre de tu empresa" />
            </label>
            <label>
              Mensaje
              <textarea
                name="mensaje"
                placeholder="Cuéntanos sobre tu proyecto..."
                rows="3"
                required
              />
            </label>
            <button className="button button--yellow" type="submit">
              Enviar solicitud <ArrowRight size={16} />
            </button>
          </form>
        </section>
      </main>
      <dialog
        className="service-dialog"
        ref={serviceDialogRef}
        aria-labelledby="service-dialog-title"
        onClick={(event) => {
          if (event.target === serviceDialogRef.current) serviceDialogRef.current.close();
        }}
        onClose={() => setSelectedService(null)}
      >
        {selectedService && (
          <div className="service-dialog__panel">
            <button
              className="service-dialog__close"
              type="button"
              aria-label="Cerrar ventana"
              onClick={() => serviceDialogRef.current?.close()}
            >
              <X size={20} />
            </button>
            <div className="service-dialog__image">
              <img src={selectedService.imagen} alt="" />
            </div>
            <div className="service-dialog__content">
              <span className="service-icon service-dialog__icon">
                <selectedService.icon size={23} />
              </span>
              <p className="eyebrow">SERVICIO INGETEC</p>
              <h2 id="service-dialog-title">{selectedService.titulo}</h2>
              <p>{selectedService.detalle}</p>
              <h3>¿Qué podemos hacer por ti?</h3>
              <ul>
                {selectedService.incluye.map((item) => (
                  <li key={item}>
                    <Check size={17} /> {item}
                  </li>
                ))}
              </ul>
              <button
                className="button button--yellow"
                type="button"
                onClick={() => {
                  navigateToContactRef.current = true;
                  serviceDialogRef.current?.close();
                }}
              >
                Solicitar información <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </dialog>
      <footer className="footer">
        <div className="footer-brand">
          <img src="/assets/logo-ingetec.png" alt="INGETEC Ingeniería y Servicios" />
          <p>
            Soluciones integrales de ingeniería y servicios electromecánicos para un futuro más
            sostenible.
          </p>
        </div>
        <div>
          <h3>Navegación</h3>
          <a href="#inicio">Inicio</a>
          <a href="#servicios">Servicios</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#sectores">Sectores</a>
          <a href="#contacto">Contacto</a>
        </div>
        <div>
          <h3>Servicios</h3>
          {servicios.map((s) => (
            <a href="#servicios" key={s.titulo}>
              {s.titulo}
            </a>
          ))}
        </div>
        <div>
          <h3>Síguenos</h3>
          <p className="socials">in&nbsp;&nbsp;◎&nbsp;&nbsp;◉&nbsp;&nbsp;▶</p>
          <small>
            © 2026 INGETEC Ingeniería &amp; Servicios.
            <br />
            Todos los derechos reservados.
          </small>
          <small>Política de privacidad&nbsp; | &nbsp;Términos y condiciones</small>
        </div>
        <a className="back-top" href="#inicio" aria-label="Volver arriba">
          <ArrowUp />
        </a>
      </footer>
      <WhatsAppButton />
    </div>
  );
}
export default App;
