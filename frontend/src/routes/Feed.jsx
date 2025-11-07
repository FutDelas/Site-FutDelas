import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const [usuario, setUsuario] = useState(null);
  const [publicacoes, setPublicacoes] = useState([]);
  const [novaPublicacao, setNovaPublicacao] = useState("");
  const [publicacaoAberta, setPublicacaoAberta] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!logado || logado.tipo !== "jogadora") {
      navigate("/login");
      return;
    }
    setUsuario(logado);

    const carregarPosts = async () => {
      try {
        const res = await fetch("http://localhost:3001/posts");
        const data = await res.json();
        setPublicacoes(data.reverse());
      } catch (err) {
        console.error("Erro ao carregar posts:", err);
      }
    };

    carregarPosts();
  }, [navigate]);

  const handlePostar = async () => {
    if (!novaPublicacao.trim()) return;

    try {
      const res = await fetch("http://localhost:3001/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          autorEmail: usuario.email,
          autorNome: usuario.nome,
          foto: usuario.foto,
          texto: novaPublicacao,
        }),
      });

      if (res.ok) {
        const postCriado = await res.json();
        setPublicacoes((prev) => [postCriado, ...prev]);
        setNovaPublicacao("");
      } else {
        alert("Erro ao criar postagem");
      }
    } catch (err) {
      console.error("Erro ao postar:", err);
    }
  };

  const curtirPost = async (id) => {
    const atualizado = publicacoes.map((p) => {
      if (p.id === id) {
        if (p.curtidoPor?.includes(usuario.nome)) {
          return { ...p, curtidas: p.curtidas - 1, curtidoPor: p.curtidoPor.filter((n) => n !== usuario.nome) };
        } else {
          return { ...p, curtidas: p.curtidas + 1, curtidoPor: [...(p.curtidoPor || []), usuario.nome] };
        }
      }
      return p;
    });

    setPublicacoes(atualizado);
    if (publicacaoAberta && publicacaoAberta.id === id) {
      setPublicacaoAberta(atualizado.find((p) => p.id === id));
    }
  };

  const adicionarComentario = (id, comentario) => {
    if (!comentario.trim()) return;
    const atualizado = publicacoes.map((p) =>
      p.id === id ? { ...p, comentarios: [...(p.comentarios || []), { texto: comentario, autor: usuario.nome }] } : p
    );
    setPublicacoes(atualizado);
    if (publicacaoAberta && publicacaoAberta.id === id) {
      setPublicacaoAberta(atualizado.find((p) => p.id === id));
    }
  };

  const deletarPostagem = (postId) => {
    const post = publicacoes.find((p) => p.id === postId);
    if (!post || post.autorEmail !== usuario.email) {
      alert("Você só pode deletar suas próprias postagens.");
      return;
    }

    fetch(`http://localhost:3001/post/${postId}`, { method: "DELETE" })
      .then((res) => {
        if (res.ok) {
          setPublicacoes((prev) => prev.filter((p) => p.id !== postId));
          setPublicacaoAberta(null);
        } else {
          alert("Erro ao deletar postagem");
        }
      })
      .catch((err) => console.error(err));
  };

  if (!usuario) return <p className="text-center mt-10 text-[#0A192F]">Carregando...</p>;

  return (
    <div className="min-h-screen bg-[#F4F0F8] flex gap-6 p-6">
      {/* SIDEBAR FIXA */}
      <div className="w-1/4 flex flex-col gap-4 sticky top-6 self-start h-screen">
        {/* PERFIL */}
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-[#F06292] flex flex-col items-center">
          <img
            src={usuario.foto ? `http://localhost:3001/${usuario.foto}` : "https://via.placeholder.com/150"}
            alt="Foto de perfil"
            className="w-20 h-20 rounded-full object-cover border-2 border-[#1E3A5F]"
          />
          <h2 className="text-center text-lg font-bold mt-2 text-[#0A192F]">{usuario.nome}</h2>
          <p className="text-center text-gray-600 text-sm">{usuario.posicao || ""}</p>
          <button
            onClick={() => navigate("/perfil-jogadora")}
            className="cursor-pointer mt-3 w-full py-2 bg-[#F06292] text-white rounded-lg font-semibold hover:bg-[#993c54] transition"
          >
            Ver Perfil
          </button>
        </div>

        {/* EVENTOS */}
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-[#1E3A5F] flex flex-col">
          <h2 className="text-[#0A192F] text-lg font-bold mb-2">Próximos Eventos</h2>
          <ul className="space-y-1 text-sm max-h-36 overflow-auto">
            <li className="p-1 bg-gray-100 rounded-lg text-[#1E3A5F]">🏆 Torneio Feminino - Sábado</li>
            <li className="p-1 bg-gray-100 rounded-lg text-[#1E3A5F]">📅 Treino Comunitário - Segunda</li>
            <li className="p-1 bg-gray-100 rounded-lg text-[#1E3A5F]">🎓 Workshop de Técnicas - Quarta</li>
          </ul>
          <button
            onClick={() => navigate("/eventos")}
            className="cursor-pointer mt-2 w-full py-2 bg-[#1E3A5F] text-white rounded-lg font-semibold hover:bg-[#0d1d35] transition"
          >
            Ver Eventos
          </button>
        </div>

        {/* RECOMPENSAS */}
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-[#F06292] flex flex-col">
          <h2 className="text-[#0A192F] text-lg font-bold mb-2">Recompensas</h2>
          <ul className="space-y-1 text-sm max-h-36 overflow-auto">
            <li className="p-1 bg-gray-100 rounded-lg text-[#1E3A5F]">👕 Camiseta Passa Bola x FutDelas- 500 pontos</li>
            <li className="p-1 bg-gray-100 rounded-lg text-[#1E3A5F]"> 💧 Garrafinha exclusiva - 300 pontos</li>
            <li className="p-1 bg-gray-100 rounded-lg text-[#1E3A5F]"> 🎟 Ingresso com desconto - 800 pontos</li>
          </ul>
          <button
            onClick={() => navigate("/recompensas")}
            className="cursor-pointer mt-2 w-full py-2 bg-[#F06292] text-white rounded-lg font-semibold hover:bg-[#993c54] transition"
          >
            Ver Recompensas
          </button>
        </div>
      </div>

      {/* FEED */}
      <div className="w-3/4 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <textarea
            placeholder="Compartilhe algo..."
            value={novaPublicacao}
            onChange={(e) => setNovaPublicacao(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#F06292]"
            rows={3}
          />
          <button
            onClick={handlePostar}
            className="cursor-pointer bg-[#F06292] text-white px-4 py-2 rounded-lg hover:bg-[#993c54] transition"
          >
            Publicar
          </button>
        </div>

        <div className="space-y-6">
          {publicacoes.length === 0 ? (
            <p className="text-gray-500 text-center bg-white rounded-xl shadow-md p-4">
              Nenhuma publicação ainda.
            </p>
          ) : (
            publicacoes.map((pub) => (
              <div
                key={pub.id}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition cursor-pointer"
                onClick={() => setPublicacaoAberta(pub)}
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={pub.foto ? `http://localhost:3001/${pub.foto}` : "https://via.placeholder.com/150"}
                    alt="Autor"
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#1E3A5F]"
                  />
                  <div>
                    <h3 className="font-bold text-[#F06292]">{pub.autor}</h3>
                    <p className="text-xs text-gray-400">{pub.data || ""}</p>
                  </div>
                </div>

                <p className="mt-3 text-[#0A192F]">{pub.texto}</p>

                <div className="mt-3 flex items-center gap-6">
                  <button
                    onClick={(e) => { e.stopPropagation(); curtirPost(pub.id); }}
                    className={`cursor-pointer text-sm ${
                      pub.curtidoPor?.includes(usuario.nome)
                        ? "text-[#1E3A5F] font-semibold"
                        : "text-[#1E3A5F] hover:underline"
                    }`}
                  >
                    {pub.curtidoPor?.includes(usuario.nome) ? "💜 Curtir" : "💜 Curtir"} ({pub.curtidas || 0})
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      {publicacaoAberta && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-2/3 max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setPublicacaoAberta(null)}
              className="cursor-pointer absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
            >
              ❌
            </button>

            <div className="flex gap-4 items-center">
              <img
                src={publicacaoAberta.foto ? `http://localhost:3001/${publicacaoAberta.foto}` : "https://via.placeholder.com/150"}
                alt="Autor"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#1E3A5F]"
              />
              <div>
                <h3 className="font-bold text-[#F06292]">{publicacaoAberta.autor}</h3>
                <p className="text-xs text-gray-400">{publicacaoAberta.data}</p>
              </div>
            </div>

            <p className="mt-4 text-[#0A192F]">{publicacaoAberta.texto}</p>

            <div className="mt-4 flex gap-6 items-center">
              <button
                onClick={() => curtirPost(publicacaoAberta.id)}
                className={`cursor-pointer text-sm ${
                  publicacaoAberta.curtidoPor?.includes(usuario.nome)
                    ? "text-[#1E3A5F] font-semibold"
                    : "text-[#1E3A5F] hover:underline"
                }`}
              >
                {publicacaoAberta.curtidoPor?.includes(usuario.nome) ? "💜 Curtir" : "💜 Curtir"} ({publicacaoAberta.curtidas || 0})
              </button>

              {publicacaoAberta.autorEmail === usuario.email && (
                <button
                  onClick={() => deletarPostagem(publicacaoAberta.id)}
                  className="cursor-pointer text-sm text-red-500 hover:underline"
                >
                  🗑️ Excluir
                </button>
              )}
            </div>

            <div className="mt-4">
              {publicacaoAberta.comentarios?.map((c, i) => (
                <p key={i} className="text-sm text-[#1E3A5F] bg-gray-50 p-2 rounded-lg mb-2">
                  💬 <strong>{c.autor}:</strong> {c.texto}
                </p>
              ))}
              <input
                type="text"
                placeholder="Comentar..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim() !== "") {
                    adicionarComentario(publicacaoAberta.id, e.target.value);
                    e.target.value = "";
                  }
                }}
                className="w-full border border-[#F06292] p-2 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F06292]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
