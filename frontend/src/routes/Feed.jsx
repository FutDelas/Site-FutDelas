import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    posicao: "",
    altura: "",
    peso: "",
    localizacao: "",
    sobre: "",
    habilidades: "",
    fotoPerfil: "",
    galeriasFotos: [],
    galeriasVideos: [],
  });
  const [publicacoes, setPublicacoes] = useState([]);
  const [novaPublicacao, setNovaPublicacao] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (logado && logado.tipo === "jogadora") {
      setUsuario(logado);
      setFormData({
        nome: logado.nome || "",
        posicao: logado.posicao || "",
        altura: logado.altura || "",
        peso: logado.peso || "",
        localizacao: logado.localizacao || "",
        sobre: logado.sobre || "",
        habilidades: logado.habilidades ? logado.habilidades.join(", ") : "",
        fotoPerfil: logado.fotoPerfil || "",
        galeriasFotos: logado.galeriasFotos || [],
        galeriasVideos: logado.galeriasVideos || [],
      });
    } else {
      window.location.href = "/login";
    }

    const postsSalvos = JSON.parse(localStorage.getItem("publicacoes")) || [];
    setPublicacoes(postsSalvos);
  }, []);

  // Atualiza foto de perfil
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const novaFoto = reader.result;
      setUsuario((prev) => {
        const atualizado = { ...prev, fotoPerfil: novaFoto };
        localStorage.setItem("usuarioLogado", JSON.stringify(atualizado));

        // Atualiza no array de usuários
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const index = usuarios.findIndex((u) => u.email === atualizado.email);
        if (index !== -1) {
          usuarios[index].fotoPerfil = novaFoto;
          localStorage.setItem("usuarios", JSON.stringify(usuarios));
        }

        return atualizado;
      });
      setFormData((prev) => ({ ...prev, fotoPerfil: novaFoto }));
    };
    reader.readAsDataURL(file);
  };

  const handleGaleria = (e, tipo) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          [tipo]: [...prev[tipo], reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const salvarPerfil = () => {
    const usuarioAtualizado = {
      ...usuario,
      nome: formData.nome,
      posicao: formData.posicao,
      altura: formData.altura,
      peso: formData.peso,
      localizacao: formData.localizacao,
      sobre: formData.sobre,
      habilidades: formData.habilidades
        ? formData.habilidades.split(",").map((h) => h.trim())
        : [],
      fotoPerfil: formData.fotoPerfil,
      galeriasFotos: formData.galeriasFotos,
      galeriasVideos: formData.galeriasVideos,
    };

    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const index = usuarios.findIndex((u) => u.email === usuarioAtualizado.email);
    if (index !== -1) {
      usuarios[index] = usuarioAtualizado;
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }

    setUsuario(usuarioAtualizado);
    setEditando(false);
  };

  const handlePostar = () => {
    if (!novaPublicacao.trim()) return;
    const novoPost = {
      id: Date.now(),
      autor: usuario.nome,
      fotoPerfil: usuario.fotoPerfil,
      texto: novaPublicacao,
      data: new Date().toLocaleString("pt-BR"),
      curtidas: 0,
      comentarios: [],
    };
    const atualizado = [novoPost, ...publicacoes];
    setPublicacoes(atualizado);
    localStorage.setItem("publicacoes", JSON.stringify(atualizado));
    setNovaPublicacao("");
  };

  const curtirPost = (id) => {
    const atualizado = publicacoes.map((p) =>
      p.id === id ? { ...p, curtidas: p.curtidas + 1 } : p
    );
    setPublicacoes(atualizado);
    localStorage.setItem("publicacoes", JSON.stringify(atualizado));
  };

  const adicionarComentario = (id, comentario) => {
    if (!comentario.trim()) return;
    const atualizado = publicacoes.map((p) =>
      p.id === id
        ? { ...p, comentarios: [...p.comentarios, { texto: comentario, autor: usuario.nome }] }
        : p
    );
    setPublicacoes(atualizado);
    localStorage.setItem("publicacoes", JSON.stringify(atualizado));
  };

  const deletarComentario = (postId, comentarioIndex) => {
    const atualizado = publicacoes.map((p) => {
      if (p.id === postId) {
        const comentariosAtualizados = [...p.comentarios];
        const comentario = comentariosAtualizados[comentarioIndex];
        if (comentario && comentario.autor === usuario.nome) {
          comentariosAtualizados.splice(comentarioIndex, 1);
          return { ...p, comentarios: comentariosAtualizados };
        } else {
          alert("Você só pode deletar seus próprios comentários.");
          return p;
        }
      }
      return p;
    });
    setPublicacoes(atualizado);
    localStorage.setItem("publicacoes", JSON.stringify(atualizado));
  };

  const deletarPostagem = (postId) => {
    const atualizado = publicacoes.filter((p) => {
      if (p.id === postId) {
        return p.autor !== usuario.nome; // Remove apenas se for do usuário atual
      }
      return true;
    });
    if (atualizado.length === publicacoes.length) {
      alert("Você só pode deletar suas próprias postagens.");
    } else {
      setPublicacoes(atualizado);
      localStorage.setItem("publicacoes", JSON.stringify(atualizado));
    }
  };

  if (!usuario) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex gap-6 p-6">
      <div className="w-1/4 flex flex-col gap-4">
        {/* PERFIL */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="relative">
            <img
              src={formData.fotoPerfil || ""}
              alt="Foto de perfil"
              className="w-24 h-24 mx-auto rounded-full object-cover"
            />
            {editando && (
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer border border-[#003B5C]"
              />
            )}
          </div>
          <h2 className="text-center text-xl font-bold mt-2 text-[#003B5C]">{usuario.nome}</h2>
          <p className="text-center text-gray-600">{usuario.posicao || ""}</p>
          <p className="text-center text-gray-600">{usuario.sobre || ""}</p>
          <p className="text-center text-gray-600">{usuario.habilidades || ""}</p>
          <button
            onClick={() => navigate("/perfil-jogadora")}
            className="cursor-pointer block w-full mt-4 bg-[#003B5C] text-white py-2 rounded-lg hover:bg-[#005080] transition"
          >
            Ver Perfil Completo
          </button>
        </div>

        {/* EVENTOS */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-bold text-[#14001dff] mb-2">Próximos Eventos</h2>
          <ul className="space-y-2">
            <li className="p-2 bg-gray-100 rounded-lg">🏆 Torneio Feminino - Sábado</li>
            <li className="p-2 bg-gray-100 rounded-lg">📅 Treino Comunitário - Segunda</li>
            <li className="p-2 bg-gray-100 rounded-lg">🎓 Workshop de Técnicas - Quarta</li>
          </ul>
        </div>
      </div>

      {/* COLUNA CENTRAL - PUBLICAÇÕES */}
      <div className="w-3/4">
        {/* FORMULÁRIO DE POSTAGEM */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <textarea
            placeholder="Compartilhe algo..."
            value={novaPublicacao}
            onChange={(e) => setNovaPublicacao(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#003B5C]"
            rows={3}
          />
          <button
            onClick={handlePostar}
            className="cursor-pointer bg-[#003B5C] text-white px-4 py-2 rounded-lg hover:bg-[#005080] transition"
          >
            Publicar
          </button>
        </div>

        {/* FEED DE PUBLICAÇÕES */}
        {publicacoes.length === 0 ? (
          <p className="text-gray-500 text-center bg-white rounded-xl shadow-md p-4">
            Nenhuma publicação ainda.
          </p>
        ) : (
          publicacoes.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-md p-4 mb-4 border-l-4 border-[#003B5C]"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4 items-start">
                  <img
                    alt="Autor"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-[#003B5C]">{post.autor}</h3>
                      {post.autor === usuario.nome && (
                        <button
                          onClick={() => deletarPostagem(post.id)}
                          className="cursor-pointer text-red-500 hover:text-red-700 text-sm"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                      <div className="bg-gray-200 w-260 p-3 rounded-lg mt-3">
                        <p className="text-gray-800">{post.texto}</p>
                        <p className="text-xs text-gray-500 mt-1">{post.data}</p>
                      </div>

                    {/* Curtidas e comentários */}
                    <div className="flex gap-4 mt-2 items-center">
                      <button
                        onClick={() => curtirPost(post.id)}
                        className="cursor-pointer text-sm text-blue-500 hover:underline"
                      >
                        💜 ({post.curtidas})
                      </button>
                    </div>

                    <div className="mt-2">
                      {post.comentarios.map((c, i) => (
                        <div key={i} className="flex justify-between items-start mb-2 bg-gray-50 p-2 rounded-lg">
                          <p className="text-sm text-gray-600">
                            💬 <strong>{c.autor}:</strong> {c.texto}
                          </p>
                          {c.autor === usuario.nome && (
                            <button
                              onClick={() => deletarComentario(post.id, i)}
                              className="cursor-pointer ml-2 text-red-500 hover:text-red-700 text-sm"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      ))}
                      <input
                        type="text"
                        placeholder="Comentar..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            adicionarComentario(post.id, e.target.value);
                            e.target.value = "";
                          }
                        }}
                        className="w-full border border-gray-200 p-1 rounded-lg mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#003B5C]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;