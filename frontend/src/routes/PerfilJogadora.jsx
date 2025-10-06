import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PerfilJogadora = () => {
  const navigate = useNavigate();
  const [jogadora, setJogadora] = useState(null);
  const [midias, setMidias] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [midiaSelecionada, setMidiaSelecionada] = useState(null);
  const [postsJogadora, setPostsJogadora] = useState([]);
  const [mostrarBotoesApagar, setMostrarBotoesApagar] = useState(false);
  const [relatorios, setRelatorios] = useState([]); // Array de relatórios

  useEffect(() => {
    const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!logado || logado.tipo !== "jogadora") {
      navigate("/login");
      return;
    }
    setJogadora(logado);

    // Carregar mídias do portfólio
    const carregarMidias = async () => {
      try {
        const res = await fetch("http://localhost:3001/perfis");
        const todosPerfis = await res.json();
        const perfil = todosPerfis.find((p) => p.email === logado.email);
        if (perfil?.midias?.length > 0) {
          setPortfolio(
            perfil.midias.map((m) => ({
              url: `http://localhost:3001/${m}`,
              tipo: m.endsWith(".mp4") ? "video" : "image",
            }))
          );
        }
      } catch (err) {
        console.error("Erro ao carregar mídias:", err);
      }
    };
    carregarMidias();

    // Carregar posts da jogadora
    const carregarPosts = async () => {
      try {
        const res = await fetch(`http://localhost:3001/posts/${logado.email}`);
        const data = await res.json();
        setPostsJogadora(data);
      } catch (err) {
        console.error("Erro ao carregar posts:", err);
      }
    };
    carregarPosts();

    // Carregar todos os relatórios do olheiro
    const carregarRelatorios = async () => {
      try {
        const res = await fetch(`http://localhost:3001/relatorios/${logado.id}`);
        const data = await res.json();
        setRelatorios(data);
      } catch (err) {
        console.error("Erro ao carregar relatórios:", err);
      }
    };
    carregarRelatorios();
  }, [navigate]);

  // Seleção de novas mídias
  const handleMidiaChange = (e) => {
    const arquivos = Array.from(e.target.files);
    setMidias(arquivos);
  };

  // Enviar mídias selecionadas
  const enviarMidias = async () => {
    if (midias.length === 0) {
      alert("Selecione fotos ou vídeos primeiro!");
      return;
    }

    const formData = new FormData();
    formData.append("email", jogadora.email);
    midias.forEach((arquivo) => formData.append("midias", arquivo));

    try {
      const res = await fetch("http://localhost:3001/perfil/upload-midias", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const novasMidias = data.midias.map((m) => ({
          url: `http://localhost:3001/${m}`,
          tipo: m.endsWith(".mp4") ? "video" : "image",
        }));
        setPortfolio(novasMidias);
        setMidias([]);
        alert("Mídias enviadas com sucesso!");
      } else {
        alert("Erro ao enviar as mídias.");
      }
    } catch (error) {
      console.error("Erro no envio:", error);
    }
  };

  // Deletar mídia do portfólio
  const deletarMidia = async (url) => {
    const nomeArquivo = url.split("/").pop();
    try {
      const res = await fetch(
        `http://localhost:3001/perfil/delete-midia?email=${jogadora.email}&arquivo=${nomeArquivo}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setPortfolio((prev) => prev.filter((m) => m.url !== url));
      } else {
        alert("Erro ao deletar mídia.");
      }
    } catch (err) {
      console.error("Erro ao deletar mídia:", err);
    }
  };

  if (!jogadora)
    return (
      <p className="text-center mt-10 text-[#F06292] font-semibold">
        Carregando perfil...
      </p>
    );

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-6 flex justify-center">
      <div className="w-full max-w-5xl bg-[#E0E4E8] rounded-2xl shadow-lg p-8 space-y-10">

        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl shadow-md bg-gradient-to-r from-[#0A192F] to-[#1E3A5F] text-white">
          <img
            src={jogadora.foto ? `http://localhost:3001/${jogadora.foto}` : "https://via.placeholder.com/150"}
            alt={jogadora.nome}
            className="w-36 h-36 rounded-full object-cover border-4 border-[#F06292]"
          />
          <div className="flex-1 flex flex-col justify-center gap-2">
            <h1 className="text-4xl font-extrabold">{jogadora.nome}</h1>
            <p className="text-[#F06292] text-lg">{jogadora.posicao || "-"}</p>
            <div className="grid grid-cols-2 gap-2 mt-4 text-white">
              <div><strong>Localização:</strong> {jogadora.localizacao || "-"}</div>
              <div className="col-span-2"><strong>Sobre:</strong> {jogadora.sobre || "-"}</div>
              <div className="col-span-2"><strong>Habilidades:</strong> {jogadora.habilidades?.join(", ") || "-"}</div>
            </div>
            <button
              onClick={() => navigate("/editar-jogadora")}
              className="cursor-pointer mt-4 bg-[#F06292] hover:bg-[#E65A7F] text-white font-semibold px-6 py-2 rounded-xl transition-colors w-max"
            >
              Editar Perfil
            </button>
          </div>
        </div>

        {/* Portfólio */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#0A192F]">Portfólio</h2>
            <div className="flex gap-2 items-center">
              {midias.length > 0 ? (
                <button
                  onClick={() => setMidias([])}
                  className="cursor-pointer bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition font-semibold text-sm"
                >
                  Remover Prévia
                </button>
              ) : (
                <button
                  onClick={() => setMostrarBotoesApagar((prev) => !prev)}
                  className={`${
                    mostrarBotoesApagar ? "bg-gray-500 hover:bg-gray-600" : "bg-red-600 hover:bg-red-800"
                  } text-white px-3 py-1 rounded transition font-semibold text-sm cursor-pointer`}
                >
                  {mostrarBotoesApagar ? "Cancelar" : "Apagar"}
                </button>
              )}

              {midias.length > 0 ? (
                <button
                  onClick={enviarMidias}
                  className="cursor-pointer bg-[#F06292] text-white px-3 py-1 rounded hover:bg-[#E65A7F] transition font-semibold text-sm"
                >
                  Enviar
                </button>
              ) : (
                <label className="cursor-pointer bg-[#1E3A5F] text-white px-4 py-1 rounded hover:bg-[#0A192F] transition font-semibold text-sm">
                  Adicionar Mídia
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleMidiaChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Pré-visualização de novas mídias */}
          {midias.length > 0 && (
            <div className="mb-6 grid grid-cols-3 gap-4">
              {midias.map((arquivo, index) => {
                const url = URL.createObjectURL(arquivo);
                const tipo = arquivo.type.startsWith("video") ? "video" : "image";
                return (
                  <div key={index} className="relative group">
                    {tipo === "video" ? (
                      <video src={url} controls className="rounded-xl w-full h-40 object-cover cursor-pointer" />
                    ) : (
                      <img src={url} alt="Prévia" className="rounded-xl w-full h-40 object-cover cursor-pointer" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Grade de mídias já enviadas */}
          <div className="grid grid-cols-3 gap-4">
            {portfolio.map((m, i) => (
              <div key={i} className="relative group">
                {m.tipo === "video" ? (
                  <video
                    src={m.url}
                    controls
                    onClick={() => !mostrarBotoesApagar && setMidiaSelecionada(m)}
                    className="rounded-xl w-full h-40 object-cover cursor-pointer"
                  />
                ) : (
                  <img
                    src={m.url}
                    alt="Portfólio"
                    onClick={() => !mostrarBotoesApagar && setMidiaSelecionada(m)}
                    className="rounded-xl w-full h-40 object-cover cursor-pointer"
                  />
                )}

                {mostrarBotoesApagar && (
                  <button
                    onClick={() => deletarMidia(m.url)}
                    className="cursor-pointer absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Modal fullscreen */}
          {midiaSelecionada && (
            <div
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
              onClick={() => setMidiaSelecionada(null)}
            >
              <div className="relative max-w-4xl w-full flex justify-center">
                <button
                  onClick={() => setMidiaSelecionada(null)}
                  className="cursor-pointer absolute top-4 right-4 bg-red-600 text-white rounded-full px-3 py-1 text-sm font-bold hover:bg-red-700 transition"
                >
                  X
                </button>
                {midiaSelecionada.tipo === "video" ? (
                  <video src={midiaSelecionada.url} controls autoPlay className="max-h-[80vh] rounded-xl shadow-lg" />
                ) : (
                  <img src={midiaSelecionada.url} alt="Visualização" className="max-h-[80vh] rounded-xl shadow-lg" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Relatórios do Olheiro */}
        <div>
          <h2 className="text-2xl font-bold text-[#0A192F] mb-4">Relatórios do Olheiro</h2>
          {relatorios.length === 0 ? (
            <p className="text-[#1E3A5F]">Ainda não há relatórios para você.</p>
          ) : (
            relatorios.map((relatorio) => (
              <div key={relatorio.id} className="bg-white rounded-xl shadow-md p-4 mb-4 flex gap-4 items-start">
                <img
                  src={relatorio.olheiro.foto ? `http://localhost:3001/${relatorio.olheiro.foto}` : "https://via.placeholder.com/60"}
                  alt={relatorio.olheiro.nome}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#F06292]"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-[#0A192F]">{relatorio.olheiro.nome}</h3>
                    <span className="text-xs text-gray-500">{new Date(relatorio.data).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <p className="text-[#1E3A5F]"><strong>Pontos Fortes:</strong> {relatorio.pontosFortes}</p>
                  {relatorio.pontosAMelhorar && (
                    <p className="text-[#1E3A5F]"><strong>Pontos a Melhorar:</strong> {relatorio.pontosAMelhorar}</p>
                  )}
                  <p className="text-[#1E3A5F]"><strong>Nota:</strong> {relatorio.nota}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Seção Posts */}
        <div>
          <h2 className="text-2xl font-bold text-[#0A192F] mb-4">Publicações</h2>
          {postsJogadora.length === 0 ? (
            <p className="text-[#1E3A5F]">Ainda não há posts.</p>
          ) : (
            postsJogadora.map((post) => (
              <div key={post.id} className="bg-[#FFFFFF] rounded-xl shadow-md p-4 mb-4">
                <div className="flex items-center gap-2">
                  <img
                    src={post.foto ? `http://localhost:3001/${post.foto}` : "https://via.placeholder.com/150"}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-bold text-[#0A192F]">{post.autor}</span>
                  <span className="text-[#1E3A5F] text-xs">{post.data}</span>
                </div>
                <p className="mt-2 text-[#1E3A5F]">{post.texto}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilJogadora;
