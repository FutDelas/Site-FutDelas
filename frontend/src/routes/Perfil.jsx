import { useEffect, useState } from "react";

const Perfil = () => {
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
    foto: "",
    galeriasFotos: [],
    galeriasVideos: []
  });

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
        foto: logado.foto || "",
        galeriasFotos: logado.galeriasFotos || [],
        galeriasVideos: logado.galeriasVideos || []
      });
    } else {
      window.location.href = "/login";
    }
  }, []);

  if (!usuario) return <p className="text-center mt-10">Carregando...</p>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFormData(prev => ({ ...prev, foto: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleGaleria = (e, tipo) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          [tipo]: [...prev[tipo], reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
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
      habilidades: formData.habilidades ? formData.habilidades.split(",").map(h => h.trim()) : [],
      foto: formData.foto,
      galeriasFotos: formData.galeriasFotos,
      galeriasVideos: formData.galeriasVideos
    };

    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const index = usuarios.findIndex(u => u.email === usuarioAtualizado.email);
    if (index !== -1) {
      usuarios[index] = usuarioAtualizado;
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }

    setUsuario(usuarioAtualizado);
    setEditando(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner */}
      <div className="relative h-64 bg-gradient-to-r from-pink-400 to-pink-600 rounded-b-3xl shadow-md">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <img
            src={formData.foto || "https://via.placeholder.com/120"}
            alt="Perfil"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
          />
          {editando && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer"
            />
          )}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-5xl mx-auto mt-20 bg-white rounded-2xl shadow-lg p-8">
        {/* Nome e botão editar */}
        <div className="flex justify-between items-center mb-6">
          <div>
            {editando ? (
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="border p-2 rounded w-full text-xl font-bold"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-800">{usuario.nome}</h1>
            )}
            <p className="text-gray-600">{usuario.posicao || "Posição não informada"}</p>
          </div>
          <button
            onClick={() => (editando ? salvarPerfil() : setEditando(true))}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
          >
            {editando ? "Salvar" : "Editar Perfil"}
          </button>
        </div>

        {/* Informações básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <strong>Altura:</strong>{" "}
            {editando ? (
              <input
                type="number"
                name="altura"
                value={formData.altura}
                onChange={handleInputChange}
                className="border p-1 rounded w-full"
              />
            ) : usuario.altura ? (
              `${usuario.altura} cm`
            ) : (
              "-"
            )}
          </div>
          <div>
            <strong>Peso:</strong>{" "}
            {editando ? (
              <input
                type="number"
                name="peso"
                value={formData.peso}
                onChange={handleInputChange}
                className="border p-1 rounded w-full"
              />
            ) : usuario.peso ? (
              `${usuario.peso} kg`
            ) : (
              "-"
            )}
          </div>
          <div>
            <strong>Localização:</strong>{" "}
            {editando ? (
              <input
                type="text"
                name="localizacao"
                value={formData.localizacao}
                onChange={handleInputChange}
                className="border p-1 rounded w-full"
              />
            ) : (
              usuario.localizacao || "-"
            )}
          </div>
        </div>

        {/* Sobre mim */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Sobre mim</h2>
          {editando ? (
            <textarea
              name="sobre"
              value={formData.sobre}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          ) : (
            <p className="text-gray-600">{usuario.sobre || "Não informado"}</p>
          )}
        </div>

        {/* Habilidades */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Habilidades</h2>
          {editando ? (
            <input
              type="text"
              name="habilidades"
              value={formData.habilidades}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              placeholder="Separe por vírgula"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {usuario.habilidades && usuario.habilidades.length > 0
                ? usuario.habilidades.map((h, i) => (
                    <span
                      key={i}
                      className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {h}
                    </span>
                  ))
                : "Nenhuma habilidade cadastrada"}
            </div>
          )}
        </div>

        {/* Galeria de Fotos */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Galeria de Fotos</h2>
          {editando && (
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleGaleria(e, "galeriasFotos")}
              className="border p-2 rounded w-full mb-2"
            />
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.galeriasFotos.map((foto, i) => (
              <img
                key={i}
                src={foto}
                alt={`Foto ${i}`}
                className="w-full h-32 object-cover rounded-lg shadow"
              />
            ))}
          </div>
        </div>

        {/* Galeria de Vídeos */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Galeria de Vídeos</h2>
          {editando && (
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => handleGaleria(e, "galeriasVideos")}
              className="border p-2 rounded w-full mb-2"
            />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.galeriasVideos.map((video, i) => (
              <video
                key={i}
                src={video}
                controls
                className="w-full h-48 rounded-lg shadow"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
