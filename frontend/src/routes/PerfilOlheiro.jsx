import { useEffect, useState } from "react";
import axios from "axios";

const PerfilOlheiro = () => {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    localAtuacao: "",
    experiencia: "",
    sobre: "",
    foto: ""
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
        foto: logado.foto || ""
      });
    } else {
      window.location.href = "/login";
    }
  }, []);

  if (!usuario) return <p className="text-center mt-10">Carregando...</p>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("foto", file);
    form.append("email", usuario.email);

    try {
      const res = await axios.post("http://localhost:3001/perfil/upload", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData(prev => ({ ...prev, foto: res.data.foto }));
    } catch (error) {
      console.error("Erro ao enviar foto:", error);
    }
  };

  const salvarPerfil = async () => {
    try {
      const res = await axios.put(`http://localhost:3001/perfil/${usuario.id}`, formData);
      setUsuario(res.data);
      localStorage.setItem("usuarioLogado", JSON.stringify(res.data));
      setEditando(false);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        {/* Foto e botão editar */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={formData.foto ? `http://localhost:3001/${formData.foto}` : "https://via.placeholder.com/150"}
            alt="Perfil"
            className="w-32 h-32 rounded-full object-cover mb-2"
          />
          {editando && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              className="mb-2"
            />
          )}
          <button
            onClick={() => (editando ? salvarPerfil() : setEditando(true))}
            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            {editando ? "Salvar" : "Editar Perfil"}
          </button>
        </div>

        {/* Informações */}
        <div className="space-y-4">
          <div>
            <strong>Nome:</strong>{" "}
            {editando ? (
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="border p-1 rounded w-full"
              />
            ) : (
              usuario.nome
            )}
          </div>

          <div>
            <strong>Email:</strong> {usuario.email}
          </div>

          <div>
            <strong>Local de atuação:</strong>{" "}
            {editando ? (
              <input
                type="text"
                name="localAtuacao"
                value={formData.localAtuacao}
                onChange={handleInputChange}
                className="border p-1 rounded w-full"
              />
            ) : (
              usuario.localAtuacao || "-"
            )}
          </div>

          <div>
            <strong>Experiência:</strong>{" "}
            {editando ? (
              <input
                type="text"
                name="experiencia"
                value={formData.experiencia}
                onChange={handleInputChange}
                className="border p-1 rounded w-full"
              />
            ) : (
              usuario.experiencia || "-"
            )}
          </div>

          <div>
            <strong>Sobre:</strong>{" "}
            {editando ? (
              <textarea
                name="sobre"
                value={formData.sobre}
                onChange={handleInputChange}
                className="border p-2 rounded w-full"
              />
            ) : (
              usuario.sobre || "-"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilOlheiro;
