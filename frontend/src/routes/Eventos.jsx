import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

    // Carregar eventos
    const carregarEventos = async () => {
      try {
        const res = await fetch("http://localhost:3001/eventos");
        const data = await res.json();
        setEventos(data);
      } catch (err) {
        console.error("Erro ao carregar eventos:", err);
      }
    };

    // Carregar todos os posts
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

  // Filtra eventos por tipo
  const campeonatos = eventos.filter(e => e.tipo === "campeonato");
  const encontrosSemanais = eventos.filter(e => e.tipo === "semanal");
  const peneiras = eventos.filter(e => e.tipo === "peneira");

  const renderCards = (lista) => {
    return lista.map((ev) => {
      let bgColor = "bg-white";
      let cardClasses = "rounded-xl shadow-md p-6 hover:shadow-xl transition flex flex-col items-center justify-center cursor-pointer";

      if (ev.tipo === "semanal") bgColor = "bg-yellow-100";
      if (ev.tipo === "peneira") bgColor = "bg-blue-100";
      if ((ev.inscritos?.length || 0) >= ev.vagas) bgColor = "bg-gray-200";

      return (
        <div
          key={ev.id}
          className={`${bgColor} ${cardClasses}`}
          onClick={() => setEventoAberto(ev)}
        >
          <div className="text-4xl mb-3">{ev.emoji}</div>
          <h2 className={`font-bold text-center ${ev.tipo === "campeonato" ? "text-2xl text-white" : "text-lg text-pink-600"}`}>
            {ev.titulo}
          </h2>
          <p className={`mt-1 text-center ${ev.tipo === "campeonato" ? "text-white/90" : "text-gray-500"}`}>{ev.dia}</p>
          {ev.tipo === "semanal" && <span className="mt-2 text-sm text-yellow-700 font-semibold">Semanal</span>}
          {ev.tipo === "peneira" && <span className="mt-2 text-sm text-blue-700 font-semibold">Peneira</span>}
          <p
            className={`mt-2 text-sm text-center ${
              (ev.inscritos?.length || 0) >= ev.vagas
                ? "text-red-500"
                : ev.tipo === "campeonato"
                ? "text-white"
                : "text-gray-700"
            }`}
          >
            Inscritas: {ev.inscritos?.length || 0} / {ev.vagas} vagas
          </p>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex gap-6 p-6">
      {/* SIDEBAR PERFIL */}
      <div className="w-1/4 flex flex-col gap-4">
        {/* Card de perfil */}
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-pink-500 flex flex-col items-center">
          <img
            src={usuario.foto ? `http://localhost:3001/${usuario.foto}` : "https://via.placeholder.com/150"}
            alt="Foto de perfil"
            className="w-24 h-24 rounded-full object-cover"
          />
          <h2 className="text-center text-xl font-bold mt-2 text-pink-600">{usuario.nome}</h2>
          <p className="text-center text-gray-500">{usuario.posicao || ""}</p>
          <button
            onClick={() => navigate("/perfil-jogadora")}
            className="cursor-pointer block w-full mt-4 bg-purple-900 text-white py-3 rounded-lg text-lg hover:bg-pink-600 transition"
          >
            Ver Perfil Completo
          </button>
        </div>

        {/* Card de Última Publicação */}
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500 flex flex-col gap-3 hover:shadow-lg transition">
          {/* Título do card */}
          <h2 className="text-lg font-bold text-yellow-600 mb-2">Última Publicação</h2>

          {publicacoes.length > 0 ? (
            <div className="flex items-start gap-3">
              {/* Foto do autor do post */}
              <img
                src={publicacoes[0].foto ? `http://localhost:3001/${publicacoes[0].foto}` : usuario.foto ? `http://localhost:3001/${usuario.foto}` : "https://via.placeholder.com/80"}
                alt="Foto do autor do post"
                className="w-14 h-14 rounded-full object-cover"
              />

              {/* Conteúdo do post */}
              <div className="flex flex-col gap-1 flex-1">
                <h3 className="text-base font-bold text-yellow-600">{publicacoes[0].autor}</h3>
                <p className="text-gray-700 text-sm line-clamp-3">{publicacoes[0].texto}</p>
                <button
                  onClick={() => navigate("/feed")}
                  className="self-start mt-2 bg-yellow-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-yellow-500 transition"
                >
                  Ver no Feed
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <img
                src={usuario.foto ? `http://localhost:3001/${usuario.foto}` : "https://via.placeholder.com/80"}
                alt="Foto da jogadora"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="flex flex-col gap-1 flex-1">
                <h3 className="text-base font-bold text-yellow-600">Nenhum post ainda</h3>
                <p className="text-gray-400 text-sm">Quando você ou outras jogadoras postarem, aqui aparecerá a última publicação.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="w-3/4 space-y-8">
        {/* CAMPEONATO FUTDELAS */}
        {campeonatos.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-purple-900 mb-4">Campeonato FutDelas</h2>
            <div className="grid grid-cols-1 gap-6">
              {campeonatos.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-pink-400 rounded-xl shadow-md p-8 hover:shadow-xl transition flex flex-col items-center justify-center cursor-pointer w-full border-4 border-pink-600"
                  onClick={() => setEventoAberto(ev)}
                >
                  <div className="text-5xl mb-4">{ev.emoji}</div>
                  <h2 className="font-bold text-3xl text-white text-center">{ev.titulo}</h2>
                  <p className="mt-1 text-white/90 text-center">{ev.dia}</p>
                  <span className="mt-2 text-white font-semibold">Campeonato</span>
                  <p className="mt-2 text-sm text-center text-white">
                    Inscritas: {ev.inscritos?.length || 0} / {ev.vagas} vagas
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEÇÃO ENCONTROS SEMANAIS */}
        {encontrosSemanais.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-purple-900 mb-4">Encontros Semanais</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderCards(encontrosSemanais)}
            </div>
          </div>
        )}

        {/* SEÇÃO PENEIRAS */}
        {peneiras.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-purple-900 mb-4">Peneiras</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderCards(peneiras)}
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE EVENTO */}
      {eventoAberto && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-2/3 max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setEventoAberto(null)}
              className="cursor-pointer absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
            >
              ❌
            </button>
            <div className="flex flex-col items-center gap-4">
              <div className="text-6xl">{eventoAberto.emoji}</div>
              <h2 className="font-bold text-2xl text-pink-600">{eventoAberto.titulo}</h2>
              <p className="text-gray-500 text-lg">{eventoAberto.dia}</p>
              {eventoAberto.tipo === "semanal" && <span className="text-yellow-700 font-semibold">Semanal</span>}
              {eventoAberto.tipo === "peneira" && <span className="text-blue-700 font-semibold">Peneira</span>}
              {eventoAberto.tipo === "campeonato" && <span className="text-pink-600 font-semibold">Campeonato</span>}
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
                className={`mt-4 px-6 py-2 rounded-lg transition ${
                  (eventoAberto.inscritos?.length || 0) >= eventoAberto.vagas
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-900 text-white hover:bg-pink-600"
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
