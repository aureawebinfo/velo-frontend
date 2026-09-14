"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400&display=swap');

        .error-body-404 {
          font-family: 'Lato', sans-serif;
          background-image: url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2500&auto=format&fit=crop');
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
          position: relative;
        }
        .overlay-404 {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(135deg, rgba(255, 245, 238, 0.4) 0%, rgba(255, 255, 255, 0.6) 100%);
          z-index: 1;
        }
        .glass-container-404 {
          position: relative;
          z-index: 2;
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 20px;
          padding: 4.5rem 3rem;
          text-align: center;
          max-width: 650px;
          width: 90%;
          box-shadow: 0 25px 40px -10px rgba(0, 0, 0, 0.1), 0 0 40px rgba(255,255,255, 0.5);
          animation: fadeInSoft404 2s ease-out;
        }
        .glass-container-404 h1 {
          font-family: 'Playfair Display', serif;
          font-size: 7.5rem;
          line-height: 1;
          margin-bottom: 0.5rem;
          color: #d4af37;
          text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.8);
          animation: pulseSoft404 4s ease-in-out infinite;
        }
        .glass-container-404 h2 {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 2.2rem;
          font-weight: 400;
          margin-bottom: 1.5rem;
          color: #5c4a4a;
        }
        .glass-container-404 p {
          font-size: 1.15rem;
          font-weight: 300;
          line-height: 1.7;
          margin-bottom: 2.5rem;
          color: #665b5b;
          padding: 0 1rem;
        }
        .btn-404 {
          display: inline-block;
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
          transition: all 0.4s ease;
          box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2);
          position: relative;
          overflow: hidden;
        }
        .btn-404::after {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: all 0.6s ease;
        }
        .btn-404:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 25px rgba(212, 175, 55, 0.4);
          background: linear-gradient(135deg, #efd1b8 0%, #e6c04a 100%);
        }
        .btn-404:hover::after { left: 100%; }
        @keyframes pulseSoft404 {
          0% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.03); opacity: 1; }
          100% { transform: scale(1); opacity: 0.9; }
        }
        @keyframes fadeInSoft404 {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .decoration-404 {
          margin: 1.5rem auto;
          width: 80px;
          height: 1px;
          background: #d4af37;
          position: relative;
        }
        .decoration-404::before, .decoration-404::after {
          content: '♦';
          position: absolute;
          top: -10px;
          color: #d4af37;
          font-size: 12px;
        }
        .decoration-404::before { left: -15px; }
        .decoration-404::after { right: -15px; }
        @media (max-width: 600px) {
          .glass-container-404 h1 { font-size: 5.5rem; }
          .glass-container-404 h2 { font-size: 1.6rem; }
          .glass-container-404 { padding: 3rem 1.5rem; }
          .glass-container-404 p { font-size: 1rem; }
        }
      `}</style>

      <div className="error-body-404">
        <div className="overlay-404" />
        <div className="glass-container-404">
          <h1>404</h1>
          <div className="decoration-404" />
          <h2>Un ligero desvío...</h2>
          <p>
            Parece que nos perdimos de camino al altar. La página que estás
            buscando se ha extraviado entre los preparativos, pero nuestro
            amor por ayudarte sigue intacto.
          </p>
          <Link href="/" className="btn-404">
            Volver a la celebración
          </Link>
        </div>
      </div>
    </>
  );
}