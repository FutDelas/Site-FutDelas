import { useEffect, useState } from "react";

const PerfilOlheiro = () => {
  const [usuario, setUsuario] = useState(null);
  const [jogadoras, setJogadoras] = useState([]);
  const [selecionada, setSelecionada] = useState(null);

  useEffect(() => {
    const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (logado && logado.tipo === "treinador") {
      setUsuario(logado);
    } else {
      window.location.href = "/login";
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const apenasJogadoras = usuarios.filter(u => u.tipo === "jogadora");
    setJogadoras(apenasJogadoras);
  }, []);

  if (!usuario) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-6">
      {/* Perfil do Olheiro */}
      <div className="max-w-4xl bg-white rounded-2xl shadow-lg p-8 mx-auto mb-8">
        <h1 className="text-3xl font-bold text-[#003B5C] mb-4">{usuario.nome}</h1>
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>Local de atuação:</strong> {usuario.localAtuacao || "Não informado"}</p>
        <p><strong>Experiência:</strong> {usuario.experiencia || "Não informada"}</p>
      </div>

      {/* Lista de Jogadoras */}
      <h2 className="text-2xl font-bold text-[#003B5C] mb-4 mx-auto max-w-4xl">Jogadoras</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {jogadoras.map((jogadora, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow p-4 cursor-pointer hover:shadow-xl transition"
            onClick={() => setSelecionada(jogadora)}
          >
            <img
              src={jogadora.foto || "https://via.placeholder.com/150"}
              alt={jogadora.nome}
              className="w-full h-48 object-cover rounded-lg mb-2"
            />
            <h3 className="text-xl font-bold">{jogadora.nome}</h3>
            <p>{jogadora.posicao || "Posição não informada"}</p>
            <p>{jogadora.localizacao || "Localização não informada"}</p>
          </div>
        ))}
      </div>

      {/* Modal do perfil da jogadora */}
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
                src={selecionada.foto || "https://via.placeholder.com/150"}
                alt={selecionada.nome}
                className="w-48 h-48 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{selecionada.nome}</h2>
                <p><strong>Posição:</strong> {selecionada.posicao || "Não informada"}</p>
                <p><strong>Localização:</strong> {selecionada.localizacao || "Não informada"}</p>
                <p><strong>Altura:</strong> {selecionada.altura ? `${selecionada.altura} cm` : "-"}</p>
                <p><strong>Peso:</strong> {selecionada.peso ? `${selecionada.peso} kg` : "-"}</p>
                <p><strong>Sobre:</strong> {selecionada.sobre || "Não informado"}</p>
                <p><strong>Habilidades:</strong> {selecionada.habilidades && selecionada.habilidades.length > 0 ? selecionada.habilidades.join(", ") : "Nenhuma habilidade cadastrada"}</p>
                {/* Galeria de Fotos */}
                {selecionada.galeriasFotos && selecionada.galeriasFotos.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-bold mb-2">Fotos</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selecionada.galeriasFotos.map((foto, idx) => (
                        <img key={idx} src={foto} alt={`Foto ${idx}`} className="w-full h-32 object-cover rounded-lg"/>
                      ))}
                    </div>
                  </div>
                )}
                {/* Galeria de Vídeos */}
                {selecionada.galeriasVideos && selecionada.galeriasVideos.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-bold mb-2">Vídeos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selecionada.galeriasVideos.map((video, idx) => (
                        <video key={idx} src={video} controls className="w-full h-48 rounded-lg"/>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfilOlheiro;
