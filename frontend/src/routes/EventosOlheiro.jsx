import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDateRange, MdLocationOn } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import eventosData from "../../../backend/eventos.json";
import usuariosData from "../../../backend/perfis.json";

const EventosOlheiro = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [relatorios, setRelatorios] = useState([]);
  const [relatorioAberto, setRelatorioAberto] = useState(null);
  const [novoRelatorio, setNovoRelatorio] = useState({
    jogadoraId: "",
    pontosFortes: "",
    pontosAMelhorar: "",
    nota: ""
  });
  const [mostrarAntigos, setMostrarAntigos] = useState(false);

  const jogadoras = usuariosData.filter(u => u.tipo === "jogadora");

  useEffect(() => {
    const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!logado || logado.tipo !== "olheiro") {
      navigate("/login");
      return;
    }
    setUsuario(logado);
    setEventos(eventosData);

    const carregarRelatorios = async () => {
      try {
        const res = await fetch("http://localhost:3001/relatorios");
        const data = await res.json();
        setRelatorios(data);
      } catch (err) {
        console.error("Erro ao carregar relatórios:", err);
      }
    };

    carregarRelatorios();
  }, [navigate]);

  if (!usuario) return <p className="text-center mt-10">Carregando...</p>;

  const handleRelatorioChange = (e) => {
    const { name, value } = e.target;
    setNovoRelatorio({ ...novoRelatorio, [name]: value });
  };

  const adicionarRelatorio = async () => {
    if (!relatorioAberto || !novoRelatorio.jogadoraId) return;

    try {
      const response = await fetch("http://localhost:3001/relatorios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jogadoraId: novoRelatorio.jogadoraId,
          eventoId: relatorioAberto.id,
          pontosFortes: novoRelatorio.pontosFortes,
          pontosAMelhorar: novoRelatorio.pontosAMelhorar,
          nota: novoRelatorio.nota,
          olheiro: usuario.id,
        }),
      });

      if (!response.ok) throw new Error("Erro ao salvar relatório");

      const relatorioSalvo = await response.json();
      setRelatorios([...relatorios, relatorioSalvo]);
      setNovoRelatorio({ jogadoraId: "", pontosFortes: "", pontosAMelhorar: "", nota: "" });
      setRelatorioAberto(null);
    } catch (err) {
      console.error(err);
      alert("Não foi possível salvar o relatório. Tente novamente.");
    }
  };

  const parseData = (dataStr) => {
    const [dia, mes, ano] = dataStr.split("/");
    return new Date(`${ano}-${mes}-${dia}T00:00:00`);
  };

  const hoje = new Date();
  const futuros = eventos.filter(e => parseData(e.data) >= hoje);
  const passados = eventos.filter(e => parseData(e.data) < hoje);

  // Relatórios mais recentes
  const relatoriosRecentes = [...relatorios].sort((a,b) => b.id - a.id).slice(0,2);
  const relatoriosAntigos = [...relatorios].sort((a,b) => b.id - a.id).slice(2);

  // Limitar eventos a 4 mais próximos
  const passadosProximos = passados.sort((a, b) => parseData(b.data) - parseData(a.data)).slice(0,4);
  const futurosProximos = futuros.sort((a, b) => parseData(a.data) - parseData(b.data)).slice(0,4);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 text-[#0A192F]">
      <div className="flex flex-col md:flex-row gap-6">

        {/* Coluna esquerda: Relatórios recentes */}
        <div className="md:w-5/12 flex flex-col gap-6 justify-start">
          <h2 className="text-2xl font-bold text-[#0A192F]">Relatórios Recentes</h2>

          {relatoriosRecentes.length === 0 ? (
            <p className="text-gray-500">Nenhum relatório registrado ainda.</p>
          ) : (
            relatoriosRecentes.map((r) => {
              const jogadora = jogadoras.find(j => j.id === r.jogadoraId);
              const evento = eventos.find(e => e.id === r.eventoId);
              return (
                <div key={r.id} className="bg-white border border-pink-200 rounded-xl p-4 shadow-md hover:shadow-lg transition flex flex-col gap-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-pink-500">{jogadora?.nome}</h3>
                    <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-sm">{r.nota}</span>
                  </div>
                  <p><strong>Pontos Fortes:</strong> {r.pontosFortes}</p>
                  <p><strong>Pontos a Melhorar:</strong> {r.pontosAMelhorar}</p>
                  <p className="text-gray-500 text-sm">Evento: {evento?.titulo}</p>
                </div>
              );
            })
          )}

          {/* Botão para abrir os relatórios antigos */}
          {relatoriosAntigos.length > 0 && (
            <button
              onClick={() => setMostrarAntigos(true)}
              className="mt-6 w-full bg-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-600 transition text-lg shadow-md"
            >
              Ver Relatórios Antigos
            </button>
          )}
        </div>

        {/* Coluna direita: Eventos */}
        <div className="md:w-7/12 flex flex-col gap-6">
          {passadosProximos.length > 0 && (
            <div>
              <h1 className="text-2xl font-bold text-[#0A192F] mb-6">Eventos Passados</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {passadosProximos.map((evento) => (
                  <div key={evento.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-pink-500">{evento.titulo}</h3>
                      <p className="text-gray-700 text-sm flex items-center gap-1"><MdDateRange /> {evento.data}</p>
                      <p className="text-gray-700 text-sm flex items-center gap-1"><MdLocationOn /> {evento.local || "Não informado"}</p>
                    </div>
                    <button
                      onClick={() => setRelatorioAberto(evento)}
                      className="mt-3 flex items-center justify-center gap-2 bg-[#F06292] text-white font-semibold py-2 rounded hover:bg-pink-600 transition"
                    >
                      <FaClipboardList /> Fazer Relatório
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {futurosProximos.length > 0 && (
            <div>
              <h1 className="text-2xl font-bold text-[#0A192F] mb-3">Próximos Eventos</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {futurosProximos.map((evento) => (
                  <div key={evento.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-pink-500">{evento.titulo}</h3>
                      <p className="text-gray-700 text-sm flex items-center gap-1"><MdDateRange /> {evento.data}</p>
                      <p className="text-gray-700 text-sm flex items-center gap-1"><MdLocationOn /> {evento.local || "Não informado"}</p>
                    </div>
                    <button
                      onClick={() => alert(`Inscrição realizada no evento: ${evento.titulo}`)}
                      className="mt-3 bg-[#1E3A5F] text-white font-semibold py-2 rounded hover:bg-[#0A192F] transition"
                    >
                      Inscrever-se
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Relatório */}
      {relatorioAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative">
            <h1 className="text-2xl font-bold text-pink-500 mb-4">Novo Relatório</h1>
            <p className="mb-2"><strong>Evento:</strong> {relatorioAberto.titulo}</p>

            <select
              name="jogadoraId"
              value={novoRelatorio.jogadoraId}
              onChange={handleRelatorioChange}
              className="w-full p-2 border border-gray-300 rounded mb-3"
            >
              <option value="">Selecione a jogadora</option>
              {jogadoras.map(j => (
                <option key={j.id} value={j.id}>{j.nome}</option>
              ))}
            </select>

            <textarea
              name="pontosFortes"
              placeholder="Pontos fortes"
              value={novoRelatorio.pontosFortes}
              onChange={handleRelatorioChange}
              className="w-full p-2 border border-gray-300 rounded mb-3"
            />
            <textarea
              name="pontosAMelhorar"
              placeholder="Pontos a melhorar"
              value={novoRelatorio.pontosAMelhorar}
              onChange={handleRelatorioChange}
              className="w-full p-2 border border-gray-300 rounded mb-3"
            />
            <input
              type="number"
              name="nota"
              placeholder="Nota (0-10)"
              value={novoRelatorio.nota}
              onChange={handleRelatorioChange}
              className="w-full p-2 border border-gray-300 rounded mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={adicionarRelatorio}
                className="bg-pink-500 text-white font-semibold py-2 px-4 rounded hover:bg-pink-600 transition w-full"
              >
                Salvar
              </button>
              <button
                onClick={() => setRelatorioAberto(null)}
                className="bg-gray-300 text-[#1E3A5F] font-semibold py-2 px-4 rounded hover:bg-gray-400 transition w-full"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Relatórios Antigos */}
      {mostrarAntigos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative">
            <h1 className="text-2xl font-bold text-pink-500 mb-4">Relatórios Antigos</h1>
            <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
              {relatoriosAntigos.map((r) => {
                const jogadora = jogadoras.find(j => j.id === r.jogadoraId);
                const evento = eventos.find(e => e.id === r.eventoId);
                return (
                  <div key={r.id} className="bg-gray-100 rounded p-3">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-semibold text-pink-500">{jogadora?.nome}</h3>
                      <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-sm">{r.nota}</span>
                    </div>
                    <p><strong>Pontos Fortes:</strong> {r.pontosFortes}</p>
                    <p><strong>Pontos a Melhorar:</strong> {r.pontosAMelhorar}</p>
                    <p className="text-gray-500 text-sm">Evento: {evento?.titulo}</p>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setMostrarAntigos(false)}
              className="mt-4 bg-gray-300 text-[#1E3A5F] font-semibold py-2 px-4 rounded hover:bg-gray-400 transition w-full"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventosOlheiro;
