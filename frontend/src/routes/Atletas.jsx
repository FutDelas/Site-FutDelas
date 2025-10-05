import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      "Norte": ["AM","PA","RO","RR","AP","AC","TO"],
      "Nordeste": ["BA","PE","CE","RN","PI","AL","SE","MA","PB"],
      "Centro-Oeste": ["GO","MT","MS","DF"],
      "Sudeste": ["SP","RJ","MG","ES"],
      "Sul": ["RS","PR","SC"]
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
    switch(filtroAno) {
      case "1990-2000": return ano >= 1990 && ano <= 2000;
      case "2001-2010": return ano >= 2001 && ano <= 2010;
      case "2011-2020": return ano >= 2011 && ano <= 2020;
      default: return true;
    }
  }

  const jogadorasFiltradas = jogadoras.filter(j => {
    const atendePosicao = filtroPosicao
      ? categoriasPosicao[filtroPosicao]?.includes(j.posicao)
      : true;

    const atendeAno = atendeFaixaAno(j.dataNascimento);

    const regiaoJogadora = cidadeParaRegiao(j.localizacao);
    const atendeRegiao = filtroRegiao ? regiaoJogadora === filtroRegiao : true;

    return atendePosicao && atendeAno && atendeRegiao;
  });

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">

        {/* Coluna esquerda: Olheiro + Eventos */}
        <div className="md:w-1/4 flex flex-col gap-6">

          {/* Perfil do Olheiro */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <img
              src={usuario.foto ? `http://localhost:3001/${usuario.foto}` : "https://via.placeholder.com/150"}
              alt={usuario.nome}
              className="w-28 h-28 object-cover rounded-full mb-4"
            />
            <h1 className="text-2xl font-bold text-[#003B5C] mb-2 text-center">{usuario.nome}</h1>
            <p><strong>Local de atuação:</strong> {usuario.localAtuacao || "Não informado"}</p>
            <p><strong>Experiência:</strong> {usuario.experiencia || "Não informada"}</p>
            <button
              onClick={() => navigate("/perfil-olheiro")}
              className="mt-4 w-full bg-[#003B5C] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#00527A] transition"
            >
              Ver meu perfil
            </button>
          </div>

          {/* Seção de Eventos */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <h2 className="text-xl font-bold text-[#003B5C] mb-4 text-center">Eventos</h2>
            <div className="flex flex-col gap-3">
              {eventos.map((evento, i) => (
                <div key={i} className="bg-[#E8E8E8] p-3 rounded-lg">
                  <h3 className="font-semibold text-[#6a1838]">{evento.titulo}</h3>
                  <p className="text-sm text-[#003B5C]"><strong>Data:</strong> {evento.data}</p>
                  <p className="text-sm text-[#003B5C]"><strong>Local:</strong> {evento.local}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna direita: Jogadoras */}
        <div className="md:w-3/4 flex flex-col gap-6">

          {/* Filtros */}
          <div className="bg-white p-4 rounded-2xl shadow grid grid-cols-1 md:grid-cols-3 gap-4">
            <select value={filtroPosicao} onChange={(e) => setFiltroPosicao(e.target.value)} className="p-2 border rounded">
              <option value="">Todas as posições</option>
              {Object.keys(categoriasPosicao).map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>

            <select value={filtroAno} onChange={(e) => setFiltroAno(e.target.value)} className="p-2 border rounded">
              <option value="">Todas as faixas</option>
              <option value="1990-2000">1990-2000</option>
              <option value="2001-2010">2001-2010</option>
              <option value="2011-2020">2011-2020</option>
            </select>

            <select value={filtroRegiao} onChange={(e) => setFiltroRegiao(e.target.value)} className="p-2 border rounded">
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
            <p className="text-center">Nenhuma jogadora encontrada.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jogadorasFiltradas.map((jogadora, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow p-4 hover:shadow-xl transition relative"
                >
                  <img
                    src={jogadora.foto ? `http://localhost:3001/${jogadora.foto}` : "https://via.placeholder.com/150"}
                    alt={jogadora.nome}
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                  <h3 className="text-xl font-bold">{jogadora.nome}</h3>
                  <p><strong>Posição:</strong> {jogadora.posicao || "Não informada"}</p>
                  <p><strong>Ano Nasc.:</strong> {jogadora.dataNascimento?.split("-")[0] || "-"}</p>
                  <p><strong>Estado:</strong> {jogadora.localizacao || "-"}</p>
                  <p><strong>Altura:</strong> {jogadora.altura ? `${jogadora.altura} cm` : "-"}</p>
                  <p><strong>Peso:</strong> {jogadora.peso ? `${jogadora.peso} kg` : "-"}</p>

                  {/* Botão para ir ao perfil da jogadora */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // evita abrir modal
                      navigate(`/perfil-jogadora-olheiro/${jogadora.id}`);
                    }}
                    className="mt-3 w-full bg-[#6a1838] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#8a2050] transition"
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
