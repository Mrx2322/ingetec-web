import {
  ArrowDown,
  ArrowRight,
  Play,
  ShieldCheck,
  Settings,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";
import "./Hero.css";

function Hero() {
  return (
    <section id="inicio" className="hero">
      <picture className="hero__background" aria-hidden="true">
        <source media="(max-width: 760px)" srcSet="/assets/hero-mobile.png" />
        <img
          src="/assets/hero-industrial.png"
          alt=""
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className="hero__shade" />
      <div className="hero__inner">
        <p className="hero__eyebrow">INGENIERÍA &amp; SERVICIOS</p>
        <h1 className="hero__title">
          Soluciones de
          <br />
          <span>ingeniería</span>
          <br />
          que impulsan tu industria
        </h1>
        <p className="hero__description">
          Instalaciones, mantenimiento y proyectos electromecánicos con altos estándares de calidad,
          seguridad y eficiencia.
        </p>
        <div className="hero__buttons">
          <a className="button button--yellow" href="#contacto">
            Solicitar cotización <ArrowRight size={17} />
          </a>
          <a className="button button--outline" href="#servicios">
            <Play size={17} fill="currentColor" /> Conocer servicios
          </a>
        </div>
        <div className="hero__features">
          <span>
            <ShieldCheck />
            Calidad
            <br />y seguridad
          </span>
          <span>
            <Settings />
            Soluciones
            <br />
            integrales
          </span>
          <span>
            <ChartNoAxesColumnIncreasing />
            Asesoría
            <br />
            técnica especializada
          </span>
        </div>
      </div>
      <a className="hero__scroll" href="#servicios" aria-label="Desplazarse a servicios">
        <ArrowDown size={18} />
      </a>
    </section>
  );
}
export default Hero;
