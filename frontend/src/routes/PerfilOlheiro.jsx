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

  if (!usuario) return <p className="text-center mt-10 text-[#0A192F]">Carregando...</p>;

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
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border-t-4 border-[#F06292]">
        {/* Foto e botão editar */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={formData.foto ? `http://localhost:3001/${formData.foto}` : "https://via.placeholder.com/150"}
            alt="Perfil"
            className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-[#1E3A5F] shadow-md"
          />
          {editando && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              className="mb-3"
            />
          )}
          <button
            onClick={() => (editando ? salvarPerfil() : setEditando(true))}
            className={`cursor-pointer px-6 py-2 rounded-full font-semibold transition
              ${editando ? 'bg-[#1E3A5F] hover:bg-[#16325b] text-white' : 'bg-[#F06292] hover:bg-[#1E3A5F] text-white'}
            `}
          >
            {editando ? "Salvar" : "Editar Perfil"}
          </button>
        </div>

        {/* Informações */}
        <div className="space-y-6">
          {/* Nome */}
          <div className="flex flex-col">
            <label className="text-[#0A192F] font-semibold mb-1">Nome:</label>
            {editando ? (
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#F06292]"
              />
            ) : (
              <p className="text-[#1E3A5F]">{usuario.nome}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-[#0A192F] font-semibold mb-1">Email:</label>
            <p className="text-[#1E3A5F]">{usuario.email}</p>
          </div>

          {/* Local de atuação */}
          <div className="flex flex-col">
            <label className="text-[#0A192F] font-semibold mb-1">Local de atuação:</label>
            {editando ? (
              <input
                type="text"
                name="localAtuacao"
                value={formData.localAtuacao}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#F06292]"
              />
            ) : (
              <p className="text-[#1E3A5F]">{usuario.localAtuacao || "-"}</p>
            )}
          </div>

          {/* Experiência */}
          <div className="flex flex-col">
            <label className="text-[#0A192F] font-semibold mb-1">Experiência:</label>
            {editando ? (
              <input
                type="text"
                name="experiencia"
                value={formData.experiencia}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#F06292]"
              />
            ) : (
              <p className="text-[#1E3A5F]">{usuario.experiencia || "-"}</p>
            )}
          </div>

          {/* Sobre */}
          <div className="flex flex-col">
            <label className="text-[#0A192F] font-semibold mb-1">Sobre:</label>
            {editando ? (
              <textarea
                name="sobre"
                value={formData.sobre}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#F06292] resize-none"
                rows={4}
              />
            ) : (
              <p className="text-[#1E3A5F] whitespace-pre-line">{usuario.sobre || "-"}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilOlheiro;
