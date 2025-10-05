import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PerfilJogadora = () => {
  const navigate = useNavigate();
  const [jogadora, setJogadora] = useState(null);
  const [midias, setMidias] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [postsJogadora, setPostsJogadora] = useState([]);
  const [mostrarBotoesApagar, setMostrarBotoesApagar] = useState(false);

  // Carregar perfil, portfólio e posts
  useEffect(() => {
    const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!logado || logado.tipo !== "jogadora") {
      navigate("/login");
      return;
    }
    setJogadora(logado);

    // Carregar portfólio
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
  }, [navigate]);

  const handleMidiaChange = (e) => {
    const arquivos = Array.from(e.target.files);
    setMidias(arquivos);
  };

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
      <p className="text-center mt-10 text-purple-900 font-semibold">
        Carregando perfil...
      </p>
    );

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-purple-900 mb-6">
          Perfil 👤
        </h1>

        {/* Foto e botão editar */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={
              jogadora.foto
                ? `http://localhost:3001/${jogadora.foto}`
                : "https://via.placeholder.com/150"
            }
            alt={jogadora.nome}
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <button
            onClick={() => navigate("/editar-jogadora")}
            className="cursor-pointer bg-purple-900 text-white px-6 py-2 rounded-xl hover:bg-pink-600 transition font-semibold"
          >
            Editar Perfil
          </button>
        </div>

        {/* Informações básicas */}
        <div className="space-y-4 mb-8">
          <div><strong>Email:</strong> {jogadora.email}</div>
          <div><strong>Nome:</strong> {jogadora.nome}</div>
          <div><strong>Posição:</strong> {jogadora.posicao || "-"}</div>
          <div><strong>Altura:</strong> {jogadora.altura ? `${jogadora.altura} cm` : "-"}</div>
          <div><strong>Peso:</strong> {jogadora.peso ? `${jogadora.peso} kg` : "-"}</div>
          <div><strong>Localização:</strong> {jogadora.localizacao || "-"}</div>
          <div><strong>Sobre:</strong> {jogadora.sobre || "-"}</div>
          <div><strong>Habilidades:</strong> {jogadora.habilidades?.join(", ") || "-"}</div>
        </div>

        {/* Seção Portfólio */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-purple-900">Portfólio</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setMostrarBotoesApagar((prev) => !prev)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800 transition font-semibold text-sm"
              >
                Apagar
              </button>
              {midias.length > 0 ? (
                <button
                  onClick={enviarMidias}
                  className="bg-pink-600 text-white px-3 py-1 rounded hover:bg-purple-900 transition font-semibold text-sm"
                >
                  Enviar
                </button>
              ) : null}
            </div>
          </div>

          {/* Upload */}
          <div className="mb-4">
            <label className="cursor-pointer bg-purple-900 text-white px-4 py-2 rounded hover:bg-pink-600 transition font-semibold text-sm">
              Adicionar Mídia
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleMidiaChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Mídias do portfólio */}
          <div className="grid grid-cols-3 gap-4">
            {portfolio.map((m, i) =>
              m.tipo === "video" ? (
                <div key={i} className="relative group">
                  <video
                    src={m.url}
                    controls
                    className="rounded-xl w-full h-40 object-cover cursor-pointer"
                  />
                  {mostrarBotoesApagar && (
                    <button
                      onClick={() => deletarMidia(m.url)}
                      className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded"
                    >
                      X
                    </button>
                  )}
                </div>
              ) : (
                <div key={i} className="relative group">
                  <img
                    src={m.url}
                    alt="Portfólio"
                    className="rounded-xl w-full h-40 object-cover cursor-pointer"
                  />
                  {mostrarBotoesApagar && (
                    <button
                      onClick={() => deletarMidia(m.url)}
                      className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded"
                    >
                      X
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Seção Posts da Jogadora */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">Publicações</h2>
          {postsJogadora.length === 0 ? (
            <p className="text-gray-500">Ainda não há posts.</p>
          ) : (
            postsJogadora.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-md p-4 mb-4">
                <div className="flex items-center gap-2">
                  <img
                    src={post.foto ? `http://localhost:3001/${post.foto}` : "https://via.placeholder.com/150"}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-bold text-purple-900">{post.autor}</span>
                  <span className="text-gray-400 text-xs">{post.data}</span>
                </div>
                <p className="mt-2 text-gray-800">{post.texto}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilJogadora;
