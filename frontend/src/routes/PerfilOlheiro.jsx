import { useEffect, useState } from "react";

const PerfilOlheiro = () => {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    localAtuacao: "",
    experiencia: "",
    sobre: "",
    foto: "",
  });

  useEffect(() => {
    const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (logado && logado.tipo === "olheiro") {
      setUsuario(logado);
      setFormData({
        nome: logado.nome || "",
        email: logado.email || "",
        localAtuacao: logado.localAtuacao || "",
        experiencia: logado.experiencia || "",
        sobre: logado.sobre || "",
        foto: logado.foto || "",
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

  const salvarPerfil = () => {
    const usuarioAtualizado = {
      ...usuario,
      ...formData
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
      <div className="relative h-64 bg-gradient-to-r from-blue-400 to-blue-600 rounded-b-3xl shadow-md">
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
      <div className="max-w-3xl mx-auto mt-20 bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            {editando ? (
              <>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full text-xl font-bold mb-2"
                  placeholder="Nome"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full mb-2"
                  placeholder="Email"
                />
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-800">{usuario.nome}</h1>
                <p className="text-gray-600">{usuario.email}</p>
              </>
            )}
          </div>
          <button
            onClick={() => (editando ? salvarPerfil() : setEditando(true))}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {editando ? "Salvar" : "Editar Perfil"}
          </button>
        </div>

        <div className="mb-4">
          <strong>Local de atuação:</strong>{" "}
          {editando ? (
            <input
              type="text"
              name="localAtuacao"
              value={formData.localAtuacao}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          ) : (
            usuario.localAtuacao || "-"
          )}
        </div>

        <div className="mb-4">
          <strong>Experiência:</strong>{" "}
          {editando ? (
            <input
              type="text"
              name="experiencia"
              value={formData.experiencia}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          ) : (
            usuario.experiencia || "-"
          )}
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Sobre</h2>
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
      </div>
    </div>
  );
};

export default PerfilOlheiro;
