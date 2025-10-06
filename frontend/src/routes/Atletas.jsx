import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDateRange, MdLocationOn } from "react-icons/md";

const Atletas = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [jogadoras, setJogadoras] = useState([]);

  const [filtroPosicao, setFiltroPosicao] = useState("");
  const [filtroAno, setFiltroAno] = useState("");
  const [filtroRegiao, setFiltroRegiao] = useState("");

  const categoriasPosicao = {
    "Goleira": ["Goleira"],
    "Defensoras": ["Zagueira", "Lateral-direita", "Lateral-esquerda"],
    "Meio-campo": ["Meia defensiva", "Meia ofensiva", "Volante", "Meia central"],
    "Atacantes": ["Centroavante", "Ponta-direita"]
  };

  const cidadeParaEstado = {
    "São Paulo": "SP",
    "Curitiba": "PR",
    "Belo Horizonte": "MG",
    "Natal": "RN",
    "Recife": "PE",
    "Fortaleza": "CE",
    "Brasília": "DF",
    "Campinas": "SP",
    "Porto Alegre": "RS",
    "Salvador": "BA",
    "Florianópolis": "SC"
  };

  const cidadeParaRegiao = (cidade) => {
    const estado = cidadeParaEstado[cidade];
    if (!estado) return null;

    const regioes = {
      "Norte": ["AM", "PA", "RO", "RR", "AP", "AC", "TO"],
      "Nordeste": ["BA", "PE", "CE", "RN", "PI", "AL", "SE", "MA", "PB"],
      "Centro-Oeste": ["GO", "MT", "MS", "DF"],
      "Sudeste": ["SP", "RJ", "MG", "ES"],
      "Sul": ["RS", "PR", "SC"]
    };

    for (const reg in regioes) {
      if (regioes[reg].includes(estado)) return reg;
    }
    return null;
  };

  const eventos = [
    { titulo: "Treinamento Regional", data: "12/10/2025", local: "Centro de Treinamento XYZ" },
    { titulo: "Observação Sub-20", data: "20/10/2025", local: "Estádio ABC" },
    { titulo: "Workshop Técnico", data: "05/11/2025", local: "Sala de Eventos FIAP" },
    { titulo: "Seleção Estadual", data: "15/11/2025", local: "Ginásio Municipal" }
  ];

  useEffect(() => {
    const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (logado && logado.tipo === "olheiro") {
      setUsuario(logado);
    } else {
      navigate("/login");
      return;
    }

    const carregarJogadoras = async () => {
      try {
        const response = await fetch("http://localhost:3001/perfis");
        const data = await response.json();
        const apenasJogadoras = data.filter(u => u.tipo === "jogadora");
        setJogadoras(apenasJogadoras);
      } catch (error) {
        console.error("Erro ao carregar jogadoras:", error);
      }
    };

    carregarJogadoras();
  }, [navigate]);

  if (!usuario) return <p className="text-center mt-10">Carregando...</p>;

  const atendeFaixaAno = (dataNascimento) => {
    if (!filtroAno || !dataNascimento) return true;
    const ano = parseInt(dataNascimento.split("-")[0]);
    switch (filtroAno) {
      case "1990-2000": return ano >= 1990 && ano <= 2000;
      case "2001-2010": return ano >= 2001 && ano <= 2010;
      case "2011-2020": return ano >= 2011 && ano <= 2020;
      default: return true;
    }
  };

  const jogadorasFiltradas = jogadoras.filter(j => {
    const atendePosicao = filtroPosicao
      ? categoriasPosicao[filtroPosicao]?.includes(j.posicao)
      : true;

    const atendeAno = atendeFaixaAno(j.dataNascimento);

    const regiaoJogadora = cidadeParaRegiao(j.localizacao);
    const atendeRegiao = filtroRegiao ? regiaoJogadora === filtroRegiao : true;

    return atendePosicao && atendeAno && atendeRegiao;
  });

  // Ordenar eventos pela data mais próxima e pegar 4
  const eventosProximos = eventos
    .sort((a, b) => {
      const [diaA, mesA, anoA] = a.data.split("/");
      const [diaB, mesB, anoB] = b.data.split("/");
      return new Date(`${anoA}-${mesA}-${diaA}`) - new Date(`${anoB}-${mesB}-${diaB}`);
    })
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white p-6 text-[#0A192F]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">

        {/* Coluna esquerda fixa */}
        <div className="md:w-1/4 flex flex-col gap-6 sticky top-6 self-start">

          {/* Perfil do Olheiro */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <img
              src={usuario.foto ? `http://localhost:3001/${usuario.foto}` : "https://via.placeholder.com/150"}
              alt={usuario.nome}
              className="w-28 h-28 object-cover rounded-full mb-4 border-4 border-[#1E3A5F]"
            />
            <h1 className="text-2xl font-bold text-[#1E3A5F] mb-2 text-center">{usuario.nome}</h1>
            <p className="text-center"><strong>Local de atuação:</strong> <br /> {usuario.localAtuacao || "Não informado"}</p>
            <button
              onClick={() => navigate("/perfil-olheiro")}
              className="cursor-pointer mt-4 w-full bg-[#1E3A5F] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#0A192F] transition"
            >
              Ver meu perfil
            </button>
          </div>

          {/* Card simplificado Eventos e Relatórios */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-pink-500 mb-4">Eventos e Relatórios</h2>
            <p className="text-gray-700 mb-6">
              Acesse os próximos eventos e acompanhe os relatórios das jogadoras em um só lugar.
            </p>
            <button
              onClick={() => navigate("/eventos-olheiro")}
              className="w-full bg-[#1E3A5F] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#0A192F] transition"
            >
              Ir para a seção
            </button>
          </div>
        </div>

        {/* Coluna direita: Jogadoras */}
        <div className="md:w-3/4 flex flex-col gap-6">

          {/* Filtros */}
          <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow grid grid-cols-1 md:grid-cols-3 gap-4">
            <select value={filtroPosicao} onChange={(e) => setFiltroPosicao(e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#F06292]">
              <option value="">Todas as posições</option>
              {Object.keys(categoriasPosicao).map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>

            <select value={filtroAno} onChange={(e) => setFiltroAno(e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#F06292]">
              <option value="">Todas as faixas</option>
              <option value="1990-2000">1990-2000</option>
              <option value="2001-2010">2001-2010</option>
              <option value="2011-2020">2011-2020</option>
            </select>

            <select value={filtroRegiao} onChange={(e) => setFiltroRegiao(e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#F06292]">
              <option value="">Todas as regiões</option>
              <option value="Norte">Norte</option>
              <option value="Nordeste">Nordeste</option>
              <option value="Centro-Oeste">Centro-Oeste</option>
              <option value="Sudeste">Sudeste</option>
              <option value="Sul">Sul</option>
            </select>
          </div>

          {/* Lista de Jogadoras */}
          {jogadorasFiltradas.length === 0 ? (
            <p className="text-center text-[#1E3A5F]">Nenhuma jogadora encontrada.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jogadorasFiltradas.map((jogadora, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-2xl shadow p-4 hover:shadow-xl transition relative"
                >
                  <img
                    src={jogadora.foto ? `http://localhost:3001/${jogadora.foto}` : "https://via.placeholder.com/150"}
                    alt={jogadora.nome}
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                  <h3 className="text-xl font-bold text-[#1E3A5F]">{jogadora.nome}</h3>
                  <p><strong>Posição:</strong> {jogadora.posicao || "Não informada"}</p>
                  <p><strong>Ano Nasc.:</strong> {jogadora.dataNascimento?.split("-")[0] || "-"}</p>
                  <p><strong>Estado:</strong> {jogadora.localizacao || "-"}</p>
                  <p><strong>Altura:</strong> {jogadora.altura ? `${jogadora.altura} cm` : "-"}</p>
                  <p><strong>Peso:</strong> {jogadora.peso ? `${jogadora.peso} kg` : "-"}</p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/perfil-jogadora-olheiro/${jogadora.id}`);
                    }}
                    className="cursor-pointer mt-3 w-full bg-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-600 transition"
                  >
                    Ver Perfil
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Atletas;
