import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PerfilJogadoraOlheiro = () => {
  const { id } = useParams(); // id da jogadora
  const [jogadora, setJogadora] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [posts, setPosts] = useState([]);
  const [abrirFoto, setAbrirFoto] = useState(null); // para modal de foto
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Buscar perfis
        const resPerfis = await fetch("http://localhost:3001/perfis");
        const dataPerfis = await resPerfis.json();
        const perfil = dataPerfis.find((p) => p.id === id);

        if (!perfil) {
          setErro(true);
          return;
        }
        setJogadora(perfil);

        // Configurar portfólio (imagens/videos)
        if (perfil.midias?.length) {
          setPortfolio(
            perfil.midias.map((m) => ({
              url: `http://localhost:3001/${m}`,
              tipo: m.endsWith(".mp4") ? "video" : "image",
            }))
          );
        }

        // Buscar posts
        const resPosts = await fetch(`http://localhost:3001/posts/${perfil.email}`);
        const dataPosts = await resPosts.json();
        setPosts(dataPosts);

      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setErro(true);
      }
    };

    carregarDados();
  }, [id]);

  if (erro) return <p className="text-center mt-10 text-red-500 font-semibold">Jogadora não encontrada.</p>;
  if (!jogadora) return <p className="text-center mt-10 text-[#F06292] font-semibold">Carregando perfil...</p>;

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-6 flex justify-center">
      <div className="w-full max-w-5xl bg-[#E0E4E8] rounded-2xl shadow-lg p-8 space-y-10">

        {/* Cabeçalho: Foto + Informações */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl shadow-md bg-gradient-to-r from-[#0A192F] to-[#1E3A5F] text-white">
          <img
            src={jogadora.foto ? `http://localhost:3001/${jogadora.foto}` : "https://via.placeholder.com/150"}
            alt={jogadora.nome}
            className="w-36 h-36 rounded-full object-cover border-4 border-[#F06292] cursor-pointer"
            onClick={() => setAbrirFoto(jogadora.foto ? `http://localhost:3001/${jogadora.foto}` : null)}
          />

          <div className="flex-1 flex flex-col justify-center gap-2">
            <h1 className="text-4xl font-extrabold">{jogadora.nome}</h1>
            <p className="text-[#F06292] text-lg">{jogadora.posicao || "-"}</p>

            <div className="grid grid-cols-2 gap-2 mt-4 text-white">
              <div><strong>Localização:</strong> {jogadora.localizacao || "-"}</div>
              <div className="col-span-2"><strong>Sobre:</strong> {jogadora.sobre || "-"}</div>
              <div className="col-span-2"><strong>Habilidades:</strong> {jogadora.habilidades?.join(", ") || "-"}</div>
            </div>
          </div>
        </div>

        {/* Portfólio */}
        <div>
          <h2 className="text-2xl font-bold text-[#0A192F] mb-4">Portfólio</h2>
          {portfolio.length === 0 ? (
            <p className="text-[#1E3A5F]">Nenhuma mídia disponível.</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {portfolio.map((m, i) =>
                m.tipo === "video" ? (
                  <video
                    key={i}
                    src={m.url}
                    controls
                    className="rounded-xl w-full h-40 object-cover cursor-pointer"
                  />
                ) : (
                  <img
                    key={i}
                    src={m.url}
                    alt="Portfólio"
                    className="rounded-xl w-full h-40 object-cover cursor-pointer"
                    onClick={() => setAbrirFoto(m.url)}
                  />
                )
              )}
            </div>
          )}
        </div>

        {/* Posts */}
        <div>
          <h2 className="text-2xl font-bold text-[#0A192F] mb-4">Publicações</h2>
          {posts.length === 0 ? (
            <p className="text-[#1E3A5F]">Ainda não há posts.</p>
          ) : (
            posts.map((post) => (
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

        {/* Modal da foto */}
        {abrirFoto && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="relative">
              <img
                src={abrirFoto}
                alt="Mídia"
                className="max-h-[80vh] max-w-[80vw] rounded-xl shadow-lg"
              />
              <button
                onClick={() => setAbrirFoto(null)}
                className="cursor-pointer absolute top-2 right-2 text-white text-3xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PerfilJogadoraOlheiro;
