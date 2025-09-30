import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, X } from "lucide-react";

import encontro1 from "../assets/encontro1.jpg";
import encontro2 from "../assets/encontro2.jpg";
import encontro3 from "../assets/encontro3.jpg";

const fotosExemplo = [encontro1, encontro2, encontro3];

export default function Encontros() {
  const encontrosPadrao = [
    {
      id: 1,
      titulo: "Encontro FutDelas",
      data: "04/09",
      horario: "20h - 23h",
      local: "Av. dos Campeões, 45 – Centro",
      vagas: 44,
      inscritos: 44,
      status: "passado",
      resultados: ["Time A 3 x 2 Time B", "Time C 1 x 1 Time D"],
      fotos: fotosExemplo,
      participantes: [],
    },
    {
      id: 2,
      titulo: "Encontro FutDelas",
      data: "11/09",
      horario: "20h - 23h",
      local: "Av. dos Campeões, 45 – Centro",
      vagas: 44,
      inscritos: 44,
      status: "passado",
      resultados: ["Time E 2 x 0 Time F", "Time G 1 x 3 Time H"],
      fotos: fotosExemplo,
      participantes: [],
    },
    {
      id: 3,
      titulo: "Encontro FutDelas",
      data: "18/09",
      horario: "20h - 23h",
      local: "Av. dos Campeões, 45 – Centro",
      vagas: 44,
      inscritos: 5,
      status: "aberto",
      participantes: [],
    },
    {
      id: 4,
      titulo: "Encontro FutDelas",
      data: "25/09",
      horario: "20h - 23h",
      local: "Av. dos Campeões, 45 – Centro",
      vagas: 44,
      inscritos: 0,
      status: "em_breve",
      participantes: [],
    },
  ];

  const [encontros, setEncontros] = useState(encontrosPadrao);
  const [modalAberto, setModalAberto] = useState(false);
  const [visualizacaoAberta, setVisualizacaoAberta] = useState(false);
  const [encontroSelecionado, setEncontroSelecionado] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    idade: "",
    email: "",
    whatsapp: "",
    nivel: "",
  });

  useEffect(() => {
    try {
      const salvos = localStorage.getItem("encontros");
      if (salvos) setEncontros(JSON.parse(salvos));
    } catch {
      setEncontros(encontrosPadrao);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("encontros", JSON.stringify(encontros));
  }, [encontros]);

  const abrirModal = (encontro) => {
    setEncontroSelecionado(encontro);
    setModalAberto(true);
  };

  const abrirVisualizacao = (encontro) => {
    setEncontroSelecionado(encontro);
    setVisualizacaoAberta(true);
  };

  const confirmarPresenca = () => {
    if (!form.nome || !form.email) {
      alert("Preencha nome e e-mail para confirmar a inscrição.");
      return;
    }

    setEncontros((prev) =>
      prev.map((e) =>
        e.id === encontroSelecionado.id && e.inscritos < e.vagas
          ? {
              ...e,
              inscritos: e.inscritos + 1,
              participantes: [...(e.participantes || []), { ...form }],
            }
          : e
      )
    );

    setForm({ nome: "", idade: "", email: "", whatsapp: "", nivel: "" });
    setModalAberto(false);
  };

  const cancelarPresenca = (encontroId, email) => {
    setEncontros((prev) =>
      prev.map((e) =>
        e.id === encontroId
          ? {
              ...e,
              inscritos: e.inscritos - 1,
              participantes: (e.participantes || []).filter(
                (p) => p.email !== email
              ),
            }
          : e
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#0A192F] p-6">
      <h1 className="text-3xl font-bold text-center text-[#F06292] mb-6">
        Encontros deste Mês
      </h1>

      <p className="text-center max-w-xl mx-auto text-lg mb-8 text-white">
        Toda <strong>quinta-feira</strong> nos reunimos para jogar futebol,
        se divertir e aprender juntas. Confira os encontros abaixo!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {encontros.map((encontro) => {
          const jaInscrito = ((encontro.participantes || []).some(
            (p) => p.email === form.email
          ));
          const lotado = encontro.inscritos >= encontro.vagas;

          // Estilos por status
          let bgCard = "bg-[#FAD1DF]";
          let tituloCor = "text-[#0A192F]";
          let botaoEstilo = "bg-[#F06292] text-white hover:bg-[#E65A7F]";
          let textIconColor = "text-[#0A192F]";
          let botaoDisabled = false;

          if (encontro.status === "passado") {
            botaoEstilo = "bg-[#0A192F] text-white hover:bg-[#1A2B4D]";
          } else if (encontro.status === "em_breve") {
            botaoDisabled = true;
            botaoEstilo = "bg-white text-[#0A192F] cursor-default";
          }

          return (
            <div
              key={encontro.id}
              className={`${bgCard} rounded-2xl shadow-lg p-6 flex flex-col text-left transition hover:shadow-2xl`}
            >
              <h2 className={`text-xl font-bold mb-4 ${tituloCor}`}>
                {encontro.titulo}
              </h2>

              <div className="flex flex-col items-start gap-1 mb-3 w-full">
                <div className={`flex items-center gap-2 ${textIconColor}`}>
                  <Calendar size={18} />
                  <span>{encontro.data}</span>
                </div>
                <div className={`flex items-center gap-2 ${textIconColor}`}>
                  <Clock size={18} />
                  <span>{encontro.horario}</span>
                </div>
                <div className={`flex items-center gap-2 ${textIconColor}`}>
                  <MapPin size={16} />
                  <span>{encontro.local}</span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${textIconColor}`}>
                  <Users size={16} />
                  <span>
                    {encontro.inscritos}/{encontro.vagas} vagas
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  jaInscrito
                    ? cancelarPresenca(encontro.id, form.email)
                    : encontro.status === "passado" || lotado
                    ? abrirVisualizacao(encontro)
                    : encontro.status === "em_breve"
                    ? null
                    : abrirModal(encontro)
                }
                disabled={botaoDisabled}
                className={`mt-auto px-5 py-2 rounded-xl font-medium shadow-md w-full transition ${botaoEstilo}`}
              >
                {encontro.status === "em_breve"
                  ? "Em Breve"
                  : jaInscrito
                  ? "Cancelar inscrição"
                  : encontro.status === "passado"
                  ? "Veja como foi"
                  : "Quero Participar"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal de inscrição */}
      {modalAberto && encontroSelecionado && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-[#0A192F] mb-4">
              Ficha de Inscrição
            </h2>

            <input
              type="text"
              placeholder="Nome completo"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="w-full mb-3 p-2 border rounded focus:outline-pink-500"
            />
            <input
              type="number"
              placeholder="Idade"
              value={form.idade}
              onChange={(e) => setForm({ ...form, idade: e.target.value })}
              className="w-full mb-3 p-2 border rounded focus:outline-pink-500"
            />
            <input
              type="email"
              placeholder="Seu e-mail"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full mb-3 p-2 border rounded focus:outline-pink-500"
            />
            <input
              type="tel"
              placeholder="WhatsApp (opcional)"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className="w-full mb-3 p-2 border rounded focus:outline-pink-500"
            />
            <select
              value={form.nivel}
              onChange={(e) => setForm({ ...form, nivel: e.target.value })}
              className="w-full mb-3 p-2 border rounded focus:outline-pink-500"
            >
              <option value="">Nível de jogo (opcional)</option>
              <option value="iniciante">Iniciante</option>
              <option value="intermediaria">Intermediária</option>
              <option value="avancada">Avançada</option>
            </select>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setModalAberto(false)}
                className="px-4 py-2 rounded-xl bg-[#0A192F] text-white hover:bg-[#14233C]"
              >
                Fechar
              </button>
              <button
                onClick={confirmarPresenca}
                className="px-4 py-2 rounded-xl bg-[#F06292] text-white hover:bg-[#E65A7F]"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal "Veja como foi" atualizado */}
      {visualizacaoAberta && encontroSelecionado && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0A192F] text-white p-6 rounded-2xl shadow-lg w-full max-w-md overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{encontroSelecionado.titulo}</h2>
              <button onClick={() => setVisualizacaoAberta(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Resultados de jogos */}
            {encontroSelecionado.resultados && (
              <div className="mb-3">
                <h3 className="font-semibold mb-2">Resultados:</h3>
                <ul className="list-disc list-inside">
                  {encontroSelecionado.resultados.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            <h3 className="font-semibold mb-2">Fotos:</h3>
            <div className="grid grid-cols-3 gap-2">
              {(encontroSelecionado.fotos || []).map((f, i) => (
                <img key={i} src={f} alt={`Foto ${i + 1}`} className="rounded" />
              ))}
            </div>

            <button
              onClick={() => setVisualizacaoAberta(false)}
              className="mt-4 px-4 py-2 rounded-xl bg-[#FAD1DF] text-[#0A192F] hover:bg-[#F9C7D8]"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
