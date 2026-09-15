"use client";

import Link from "next/link";

export default function Maintenance() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400&display=swap');

        .error-body-503 {
          font-family: 'Lato', system-ui, -apple-system, sans-serif;
          background-color: #f7f1eb;
          background-image: url('https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=1920&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          color: #4a4a4a;
          -webkit-font-smoothing: antialiased;
          position: relative;
        }
        .overlay-503 {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(135deg, rgba(255, 235, 225, 0.45) 0%, rgba(255, 255, 255, 0.65) 100%);
          z-index: 1;
          pointer-events: none;
        }
        .glass-container-503 {
          position: relative;
          z-index: 2;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          padding: 4.5rem 3rem;
          text-align: center;
          max-width: 650px;
          width: 90%;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1), 0 0 30px rgba(255,255,255, 0.4);
          animation: fadeInSoft503 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          will-change: transform, opacity;
          opacity: 0;
        }
        .glass-container-503 h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(4.5rem, 10vw, 7.5rem);
          line-height: 1;
          margin-bottom: 0.5rem;
          color: #c9a050;
          text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.9);
          animation: breatheOpt503 3.5s ease-in-out infinite;
          will-change: transform, opacity;
        }
        .glass-container-503 h2 {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(1.4rem, 4vw, 2.2rem);
          font-weight: 400;
          margin-bottom: 1.5rem;
          color: #5c4a4a;
        }
        .glass-container-503 p {
          font-size: clamp(1rem, 2vw, 1.15rem);
          font-weight: 300;
          line-height: 1.6;
          margin-bottom: 2.5rem;
          color: #665b5b;
          padding: 0 1rem;
        }
        .btn-503 {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-decoration: none;
          color: #fff;
          background: linear-gradient(135deg, #e3c0a5 0%, #d4af37 100%);
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 400;
          font-family: 'Lato', sans-serif;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 8px 15px rgba(212, 175, 55, 0.2);
          position: relative;
          overflow: hidden;
          will-change: transform;
        }
        .btn-503::after {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: left 0.5s ease;
        }
        .btn-503:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 20px rgba(212, 175, 55, 0.3);
        }
        .btn-503:hover::after { left: 100%; }
        .decoration-503 {
          margin: 1.5rem auto;
          width: 80px;
          height: 1px;
          background: #d4af37;
          position: relative;
        }
        .decoration-503::before, .decoration-503::after {
          content: '✿';
          position: absolute;
          top: -12px;
          color: #d4af37;
          font-size: 14px;
        }
        .decoration-503::before { left: -15px; }
        .decoration-503::after { right: -15px; }
        .back-btn-503 {
          position: fixed;
          top: 2rem; left: 2.5rem;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px; height: 48px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          color: #5c4a4a;
          text-decoration: none;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          will-change: transform;
        }
        .back-btn-503:hover {
          transform: translateX(-4px);
          background: rgba(255, 255, 255, 0.95);
          color: #c9a050;
          box-shadow: 0 8px 25px rgba(201, 160, 80, 0.25);
        }
        @keyframes breatheOpt503 {
          0% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
          100% { opacity: 0.85; transform: scale(1); }
        }
        @keyframes fadeInSoft503 {
          0% { opacity: 0; transform: translateY(25px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .loading-dots-503::after {
          content: '';
          animation: dots503 1.5s infinite steps(4, end);
          display: inline-block;
          width: 24px;
          text-align: left;
        }
        @keyframes dots503 {
          0%, 20% { content: ''; }
          40% { content: '.'; }
          60% { content: '..'; }
          80%, 100% { content: '...'; }
        }
        @media (max-width: 768px) {
          .glass-container-503 { padding: 3.5rem 2rem; }
        }
        @media (max-width: 480px) {
          .glass-container-503 { padding: 2.5rem 1.2rem; width: 95%; }
          .glass-container-503 p { padding: 0 0.5rem; margin-bottom: 2rem; }
          .btn-503 { padding: 0.8rem 1.8rem; font-size: 0.9rem; }
          .decoration-503 { margin: 1.2rem auto; }
          .back-btn-503 { top: 1.2rem; left: 1.2rem; width: 40px; height: 40px; }
        }
      `}</style>

      <Link
        href="/"
        className="back-btn-503"
        title="Volver al inicio"
        aria-label="Volver a la página principal"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </Link>

      <div className="error-body-503">
        <div className="overlay-503" />
        <div className="glass-container-503">
          <h1>503</h1>
          <div className="decoration-503" />
          <h2>
            Preparativos en curso<span className="loading-dots-503"></span>
          </h2>
          <p>
            Estamos ajustando los últimos detalles para que todo luzca
            perfecto. Nuestro sitio web se encuentra en un breve
            mantenimiento para embellecer su experiencia.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-503"
            aria-label="Recargar la página"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-11.45l5.25 5.25"/>
            </svg>
            Volver a intentarlo
          </button>
        </div>
      </div>
    </>
  );
}