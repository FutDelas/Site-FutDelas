import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdLocationOn, MdDateRange, MdAccessTime } from "react-icons/md";
import { FaTrophy } from "react-icons/fa";

const Eventos = () => {
  const [usuario, setUsuario] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [publicacoes, setPublicacoes] = useState([]);
  const [eventoAberto, setEventoAberto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!logado || logado.tipo !== "jogadora") {
      navigate("/login");
      return;
    }
    setUsuario(logado);

    const carregarEventos = async () => {
      try {
        const res = await fetch("http://localhost:3001/eventos");
        const data = await res.json();
        setEventos(data);
      } catch (err) {
        console.error("Erro ao carregar eventos:", err);
      }
    };

    const carregarPosts = async () => {
      try {
        const res = await fetch(`http://localhost:3001/posts`);
        const data = await res.json();
        data.sort((a, b) => new Date(b.data) - new Date(a.data));
        setPublicacoes(data);
      } catch (err) {
        console.error("Erro ao carregar posts:", err);
      }
    };

    carregarEventos();
    carregarPosts();
  }, [navigate]);

  if (!usuario) return <p className="text-center mt-10">Carregando...</p>;

  const campeonatos = eventos.filter(e => e.tipo === "campeonato");
  const encontrosSemanais = eventos.filter(e => e.tipo === "semanal");
  const peneiras = eventos.filter(e => e.tipo === "peneira");

  const renderCards = (lista) => {
    return lista.map((ev) => {
      let bgColor = "#FFFFFF";
      let textColor = "#003B5C";

      if (ev.tipo === "semanal") {
        bgColor = "#FBC02D";
        textColor = "#003B5C";
      }
      if (ev.tipo === "peneira") {
        bgColor = "#5a8ca6";
        textColor = "#FFFFFF";
      }
      if ((ev.inscritos?.length || 0) >= ev.vagas) {
        bgColor = "#E8E8E8";
        textColor = "#003B5C";
      }

      return (
        <div
          key={ev.id}
          className="rounded-lg shadow-md p-3 text-center cursor-pointer flex-1 flex flex-col justify-between transition hover:shadow-xl"
          style={{ backgroundColor: bgColor, color: textColor }}
          onClick={() => setEventoAberto(ev)}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl">{ev.emoji}</div>
            <h2 className="font-bold text-lg">{ev.titulo}</h2>
            <p className="text-xs mt-1">{ev.dia}</p>
            {(ev.tipo === "semanal") && <span className="text-xs font-semibold">Semanal</span>}
            {(ev.tipo === "peneira") && <span className="text-xs font-semibold">Peneira</span>}
          </div>
          <p className="text-xs mt-2">{ev.inscritos?.length || 0} / {ev.vagas} vagas</p>
        </div>
      );
    });
  };

  return (
    <div className="h-screen w-screen flex gap-4 p-3 bg-[#F8FAFC] overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-1/4 flex flex-col gap-4 h-full">
        {/* Perfil */}
        <div className="rounded-lg shadow-md p-4 flex flex-col items-center flex-1 min-h-[220px] border-l-4 border-[#F06292]" style={{ backgroundColor: "#FFFFFF" }}>
          <img
            src={usuario.foto ? `http://localhost:3001/${usuario.foto}` : "https://via.placeholder.com/150"}
            alt="Foto de perfil"
            className="w-20 h-20 rounded-full object-cover"
          />
          <h2 className="text-center text-lg font-bold mt-2 text-[#F06292]">{usuario.nome}</h2>
          <p className="text-center text-sm text-gray-500">{usuario.posicao || ""}</p>
          <div className="mt-auto w-full">
            <button
              onClick={() => navigate("/perfil-jogadora")}
              className="cursor-pointer w-full text-sm py-2 bg-[#003B5C] text-white rounded hover:bg-[#5a8ca6] transition"
            >
              Ver Perfil
            </button>
          </div>
        </div>

        {/* Última Publicação */}
        <div className="rounded-lg shadow-md p-4 flex flex-col gap-3 flex-1 min-h-[220px] border-l-4 border-[#FBC02D]" style={{ backgroundColor: "#FFFFFF" }}>
          <h2 className="text-lg font-bold text-[#FBC02D]">Última Publicação</h2>
          {publicacoes.length > 0 ? (
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-start gap-3">
                <img
                  src={publicacoes[0].foto ? `http://localhost:3001/${publicacoes[0].foto}` : usuario.foto ? `http://localhost:3001/${usuario.foto}` : "https://via.placeholder.com/80"}
                  alt="Autor"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col gap-1 text-sm text-[#003B5C]">
                  <h3 className="font-bold">{publicacoes[0].autor}</h3>
                  <p className="line-clamp-3 break-words">{publicacoes[0].texto}</p>
                </div>
              </div>
              <div className="mt-auto">
                <button
                  onClick={() => navigate("/feed")}
                  className="cursor-pointer w-full text-sm py-2 bg-[#003B5C] text-white rounded hover:bg-[#5a8ca6] transition"
                >
                  Ver no Feed
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 text-sm text-gray-400 flex-1 justify-center items-center">
              <p>Nenhum post ainda</p>
            </div>
          )}
        </div>

        {/* Recompensas */}
        <div className="rounded-lg shadow-md p-4 flex flex-col gap-3 flex-1 min-h-[220px] border-l-4 border-[#003B5C]"   style={{ backgroundColor: "#FFFFFF" }}>
          <h2 className="text-lg font-bold text-[#003B5C]">Recompensas</h2>
          <ul className="flex flex-col gap-2 flex-1 text-sm text-[#003B5C]">
            <li>🏅 Medalha - 10 pontos</li>
            <li>🎯 Melhor Jogadora - 50 pontos</li>
            <li>💎 Recompensa Especial - 100 pontos</li>
          </ul>
          <div className="mt-auto w-full">
            <button
              onClick={() => navigate("/recompensas")}
              className="cursor-pointer w-full text-sm py-2 bg-[#003B5C] text-white rounded hover:bg-[#5a8ca6] transition"
            >
              Ver Recompensas
            </button>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="w-3/4 flex flex-col gap-3 h-full">
        {/* Campeonatos */}
        {campeonatos.length > 0 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl font-extrabold text-[#F06292] mb-2">Campeonato FutDelas</h2>
            <div className="grid grid-cols-1 gap-3 flex-1 h-full">
              {campeonatos.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-lg shadow-md p-4 text-center text-white cursor-pointer border-2 border-[#003B5C] flex-1 flex flex-col justify-between"
                  style={{ backgroundColor: "#F06292" }}
                  onClick={() => setEventoAberto(ev)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-4xl">{ev.emoji}</div>
                    <h2 className="font-extrabold text-2xl">{ev.titulo}</h2>
                    <p className="text-white/90 text-base">{ev.dia}</p>
                    <span className="text-white font-semibold text-base">Campeonato</span>
                  </div>
                  <p className="text-white font-semibold text-sm mt-2">{ev.inscritos?.length || 0} / {ev.vagas} vagas</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Encontros Semanais */}
        {encontrosSemanais.length > 0 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl font-bold text-[#F06292] mb-2">Encontros Semanais</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1 h-full">
              {renderCards(encontrosSemanais)}
            </div>
          </div>
        )}

        {/* Peneiras */}
        {peneiras.length > 0 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl font-bold text-[#F06292] mb-2">Peneiras</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1 h-full">
              {renderCards(peneiras)}
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {eventoAberto && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-2/3 max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setEventoAberto(null)}
              className="cursor-pointer absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
            >
              ❌
            </button>
            <div className="flex flex-col items-center gap-3">
              <div className="text-6xl">{eventoAberto.emoji}</div>
              <h2 className="font-bold text-2xl text-[#F06292]">{eventoAberto.titulo}</h2>
              <p className="text-gray-500">{eventoAberto.dia}</p>
              {eventoAberto.tipo === "semanal" && <span className="text-yellow-700 font-semibold">Semanal</span>}
              {eventoAberto.tipo === "peneira" && <span className="text-blue-700 font-semibold">Peneira</span>}
              {eventoAberto.tipo === "campeonato" && <span className="text-[#F06292] font-semibold">Campeonato</span>}
              <p className="mt-4 text-gray-800 text-center">{eventoAberto.descricao}</p>
              <p className="mt-2 text-gray-800 text-center">
                Inscritas: {eventoAberto.inscritos?.length || 0} / {eventoAberto.vagas} vagas
              </p>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(`http://localhost:3001/eventos/${eventoAberto.id}/inscrever`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ nome: usuario.nome, email: usuario.email })
                    });
                    const data = await res.json();
                    if (res.ok) {
                      alert("Inscrição realizada com sucesso!");
                      setEventos(prev =>
                        prev.map(e =>
                          e.id === eventoAberto.id
                            ? { ...e, inscritos: [...(e.inscritos || []), { nome: usuario.nome, email: usuario.email }] }
                            : e
                        )
                      );
                      setEventoAberto(prev => ({
                        ...prev,
                        inscritos: [...(prev.inscritos || []), { nome: usuario.nome, email: usuario.email }]
                      }));
                    } else {
                      alert(data.erro);
                    }
                  } catch (err) {
                    console.error(err);
                    alert("Erro ao se inscrever.");
                  }
                }}
                className={`mt-4 px-6 py-2 rounded-lg transition w-full ${
                  (eventoAberto.inscritos?.length || 0) >= eventoAberto.vagas
                    ? "bg-gray-400 cursor-not-allowed"
                    : "cursor-pointer bg-[#003B5C] text-white hover:bg-[#5a8ca6]"
                }`}
                disabled={(eventoAberto.inscritos?.length || 0) >= eventoAberto.vagas}
              >
                Participar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Eventos;
