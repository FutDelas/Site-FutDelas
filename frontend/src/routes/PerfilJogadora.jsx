import { useEffect, useState } from "react";
import axios from "axios";

const PerfilJogadora = () => {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    posicao: "",
    altura: "",
    peso: "",
    localizacao: "",
    sobre: "",
    habilidades: "",
    foto: ""
  });

  useEffect(() => {
    const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (logado && logado.tipo === "jogadora") {
      setUsuario(logado);
      setFormData({
        nome: logado.nome || "",
        email: logado.email || "",
        posicao: logado.posicao || "",
        altura: logado.altura || "",
        peso: logado.peso || "",
        localizacao: logado.localizacao || "",
        sobre: logado.sobre || "",
        habilidades: logado.habilidades ? logado.habilidades.join(", ") : "",
        foto: logado.foto || ""
      });
    } else {
      window.location.href = "/login";
    }
  }, []);

  if (!usuario) return <p className="text-center mt-10 text-purple-900 font-semibold">Carregando...</p>;

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
      const dadosAtualizados = {
        ...formData,
        habilidades: formData.habilidades ? formData.habilidades.split(",").map(h => h.trim()) : []
      };
      const res = await axios.put(`http://localhost:3001/perfil/${usuario.id}`, dadosAtualizados);
      setUsuario(res.data);
      localStorage.setItem("usuarioLogado", JSON.stringify(res.data));
      setEditando(false);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-purple-900 mb-6">Perfil 👤</h1>

        {/* Foto e botão editar */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={formData.foto ? `http://localhost:3001/${formData.foto}` : "https://via.placeholder.com/150"}
            alt="Perfil"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          {editando && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              className="mb-4 cursor-pointer"
            />
          )}
          <button
            onClick={() => (editando ? salvarPerfil() : setEditando(true))}
            className="cursor-pointer bg-purple-900 text-white px-6 py-2 rounded-xl hover:bg-pink-600 transition font-semibold"
          >
            {editando ? "Salvar" : "Editar Perfil"}
          </button>
        </div>

        {/* Informações */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <strong className="text-purple-900 w-32">Email:</strong>
            <span>{usuario.email}</span>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start">
            <strong className="text-purple-900 w-32">Nome:</strong>
            {editando ? (
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <span>{usuario.nome}</span>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start">
            <strong className="text-purple-900 w-32">Posição:</strong>
            {editando ? (
              <input
                type="text"
                name="posicao"
                value={formData.posicao}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <span>{usuario.posicao || "-"}</span>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start">
            <strong className="text-purple-900 w-32">Altura:</strong>
            {editando ? (
              <input
                type="number"
                name="altura"
                value={formData.altura}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <span>{usuario.altura ? `${usuario.altura} cm` : "-"}</span>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start">
            <strong className="text-purple-900 w-32">Peso:</strong>
            {editando ? (
              <input
                type="number"
                name="peso"
                value={formData.peso}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <span>{usuario.peso ? `${usuario.peso} kg` : "-"}</span>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start">
            <strong className="text-purple-900 w-32">Localização:</strong>
            {editando ? (
              <input
                type="text"
                name="localizacao"
                value={formData.localizacao}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <span>{usuario.localizacao || "-"}</span>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start">
            <strong className="text-purple-900 w-32">Sobre:</strong>
            {editando ? (
              <textarea
                name="sobre"
                value={formData.sobre}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <span>{usuario.sobre || "-"}</span>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start">
            <strong className="text-purple-900 w-32">Habilidades:</strong>
            {editando ? (
              <input
                type="text"
                name="habilidades"
                value={formData.habilidades}
                onChange={handleInputChange}
                placeholder="Separe por vírgula"
                className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <span>{usuario.habilidades && usuario.habilidades.length > 0 ? usuario.habilidades.join(", ") : "-"}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilJogadora;
