import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import garrafinha from "../assets/garrafinha.png";
import camiseta from "../assets/camiseta.png";
import ingresso from "../assets/ingresso.png";

export default function Recompensas() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [pontos, setPontos] = useState(0);

  // Verifica se usuário está logado
  useEffect(() => {
    const user = localStorage.getItem("usuarioLogado");
    if (!user) {
      alert("Você precisa fazer login para acessar as recompensas!");
      navigate("/login");
    } else {
      setUsuario(JSON.parse(user));
    }
  }, [navigate]);

  // Cálculo de pontos baseado em engajamento (exemplo)
  useEffect(() => {
    const curtidas = usuario?.curtidas || 20;
    const comentarios = usuario?.comentarios || 10;
    const pontosCalculados = curtidas * 2 + comentarios * 3;
    setPontos(pontosCalculados);
  }, [usuario]);

  return (
    <div className="min-h-screen bg-[#0A192F] text-white flex flex-col items-center py-12 px-4">
      {/* --- Cabeçalho e vídeo --- */}
      <section className="w-full max-w-5xl flex flex-col items-center text-center mb-10">
        <h1 className="text-4xl font-bold mb-6 text-[#F06292]">Recompensas</h1>

        <p className="text-lg text-gray-300 max-w-3xl mb-8 leading-relaxed">
          O <strong>Programa de Recompensas Passa Bola x Futdelas</strong> é a forma de reconhecer
          quem mais participa da nossa comunidade. A cada curtida, comentário e interação, 
          você acumula pontos que podem ser trocados por prêmios incríveis — como
          camisetas exclusivas, garrafinhas personalizadas e até descontos em jogos! ⚽
        </p>

        <div className="w-full aspect-video max-w-4xl rounded-2xl overflow-hidden shadow-2xl border-4 border-[#F06292]">
          <iframe
            src="https://www.youtube.com/embed/B8iMVIwiVe8?si=fqPhWWEWCe7Jihwe"
            title="Vídeo explicativo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </section>

      {/* --- Pontuação do usuário --- */}
      <section className="bg-white text-[#0A192F] rounded-2xl px-8 py-6 mb-12 shadow-xl flex flex-col items-center border-b-4 border-[#F06292]">
        <h2 className="text-2xl font-semibold mb-2">Seus Pontos</h2>
        <p className="text-lg">
          Você possui <strong>{pontos}</strong> pontos com base no seu engajamento 🔥
        </p>
      </section>

      {/* --- Lista de recompensas --- */}
      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Recompensa 1 - Camiseta */}
        <div className="border-b-4 border-[#F06292] bg-white text-[#0A192F] rounded-2xl shadow-2xl p-6 flex flex-col items-center hover:scale-105 transition">
          <img
            src={camiseta}
            alt="Camiseta Passa Bola"
            className="w-56 h-56 object-contain mb-4 rounded-xl border-2 border-[#FAD1DF] shadow-md"
          />
          <h3 className="text-xl font-bold mb-2">Camiseta Passa Bola</h3>
          <p className="text-gray-600 mb-3">Resgate com 500 pontos</p>
          <button
            className={`px-4 py-2 rounded text-white font-medium ${
              pontos >= 500
                ? "cursor-pointer bg-[#F06292] hover:bg-[#E65A7F]"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {pontos >= 500 ? "Resgatar" : "Pontos insuficientes"}
          </button>
        </div>

        {/* Recompensa 2 - Garrafinha */}
        <div className="border-b-4 border-[#F06292] bg-white text-[#0A192F] rounded-2xl shadow-2xl p-6 flex flex-col items-center hover:scale-105 transition">
          <img
            src={garrafinha}
            alt="Garrafinha exclusiva"
            className="w-48 h-56 object-contain mb-4 rounded-xl border-2 border-[#FAD1DF] shadow-md"
          />
          <h3 className="text-xl font-bold mb-2">Garrafinha exclusiva</h3>
          <p className="text-gray-600 mb-3">Resgate com 300 pontos</p>
          <button
            className={`px-4 py-2 rounded text-white font-medium ${
              pontos >= 300
                ? "cursor-pointer bg-[#F06292] hover:bg-[#E65A7F]"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {pontos >= 300 ? "Resgatar" : "Pontos insuficientes"}
          </button>
        </div>

        {/* Recompensa 3 - Ingresso */}
        <div className="border-b-4 border-[#F06292] bg-white text-[#0A192F] rounded-2xl shadow-2xl p-6 flex flex-col items-center hover:scale-105 transition">
          <img
            src={ingresso}
            alt="Ingresso com desconto"
            className="w-60 h-48 object-contain mb-4 rounded-xl border-2 border-[#FAD1DF] shadow-md"
          />
          <h3 className="text-center text-xl font-bold mb-2">
            Ingressos com desconto de 25%
          </h3>
          <p className="text-gray-600 mb-3">Resgate com 800 pontos</p>
          <button
            className={`px-4 py-2 rounded text-white font-medium ${
              pontos >= 800
                ? "cursor-pointer bg-[#F06292] hover:bg-[#E65A7F]"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {pontos >= 800 ? "Resgatar" : "Pontos insuficientes"}
          </button>
        </div>
      </section>
    </div>
  );
}
