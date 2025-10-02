import { useEffect, useState } from "react";

const Atletas = () => {
  const [usuario, setUsuario] = useState(null);
  const [jogadoras, setJogadoras] = useState([]);
  const [selecionada, setSelecionada] = useState(null);

  const [filtroPosicao, setFiltroPosicao] = useState("");
  const [filtroAno, setFiltroAno] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  useEffect(() => {
    const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (logado && logado.tipo === "olheiro") {
      setUsuario(logado);
    } else {
      window.location.href = "/login";
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
  }, []);

  if (!usuario) return <p className="text-center mt-10">Carregando...</p>;

  const jogadorasFiltradas = jogadoras.filter(j => {
    const atendePosicao = filtroPosicao ? j.posicao === filtroPosicao : true;
    const atendeAno = filtroAno ? j.dataNascimento?.split("-")[0] === filtroAno : true;
    const atendeEstado = filtroEstado ? j.localizacao === filtroEstado : true;
    return atendePosicao && atendeAno && atendeEstado;
  });

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-6">
      {/* Layout com coluna à esquerda */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        
        {/* Coluna do Olheiro */}
        <div className="md:w-1/4 bg-white rounded-2xl shadow-lg p-6 flex-shrink-0">
          <h1 className="text-3xl font-bold text-[#003B5C] mb-4">{usuario.nome}</h1>
          <p><strong>Email:</strong> {usuario.email}</p>
          <p><strong>Local de atuação:</strong> {usuario.localAtuacao || "Não informado"}</p>
          <p><strong>Experiência:</strong> {usuario.experiencia || "Não informada"}</p>
        </div>

        {/* Coluna principal */}
        <div className="md:w-3/4 flex flex-col gap-6">

          {/* Filtros */}
          <div className="bg-white p-4 rounded-2xl shadow grid grid-cols-1 md:grid-cols-3 gap-4">
            <select value={filtroPosicao} onChange={(e) => setFiltroPosicao(e.target.value)} className="p-2 border rounded">
              <option value="">Todas as posições</option>
              <option value="Goleira">Goleira</option>
              <option value="Zagueira">Zagueira</option>
              <option value="Lateral">Lateral</option>
              <option value="Meio-campo">Meio-campo</option>
              <option value="Atacante">Atacante</option>
            </select>

            <select value={filtroAno} onChange={(e) => setFiltroAno(e.target.value)} className="p-2 border rounded">
              <option value="">Todos os anos</option>
              <option value="2005">2005</option>
              <option value="2006">2006</option>
              <option value="2007">2007</option>
              <option value="2008">2008</option>
            </select>

            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="p-2 border rounded">
              <option value="">Todos os estados</option>
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="MG">Minas Gerais</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="BA">Bahia</option>
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
                  className="bg-white rounded-2xl shadow p-4 cursor-pointer hover:shadow-xl transition"
                  onClick={() => setSelecionada(jogadora)}
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
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Modal com detalhes */}
      {selecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-11/12 md:w-3/4 max-w-3xl relative shadow-lg">
            <button
              onClick={() => setSelecionada(null)}
              className="absolute top-2 right-2 font-bold text-xl text-gray-600 hover:text-gray-900"
            >
              ×
            </button>
            <div className="flex flex-col md:flex-row gap-4">
              <img
                src={selecionada.foto ? `http://localhost:3001/${selecionada.foto}` : "https://via.placeholder.com/150"}
                alt={selecionada.nome}
                className="w-48 h-48 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{selecionada.nome}</h2>
                <p><strong>Posição:</strong> {selecionada.posicao || "Não informada"}</p>
                <p><strong>Ano de Nascimento:</strong> {selecionada.dataNascimento?.split("-")[0] || "Não informado"}</p>
                <p><strong>Estado:</strong> {selecionada.localizacao || "Não informado"}</p>
                <p><strong>Altura:</strong> {selecionada.altura ? `${selecionada.altura} cm` : "-"}</p>
                <p><strong>Peso:</strong> {selecionada.peso ? `${selecionada.peso} kg` : "-"}</p>
                <p><strong>Sobre:</strong> {selecionada.sobre || "Não informado"}</p>
                <p><strong>Habilidades:</strong> {selecionada.habilidades && selecionada.habilidades.length > 0 ? selecionada.habilidades.join(", ") : "Nenhuma habilidade cadastrada"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Atletas;
