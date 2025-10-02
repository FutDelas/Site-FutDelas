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
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
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
            <strong>Posição:</strong>{" "}
            {editando ? (
              <input
                type="text"
                name="posicao"
                value={formData.posicao}
                onChange={handleInputChange}
                className="border p-1 rounded w-full"
              />
            ) : (
              usuario.posicao || "-"
            )}
          </div>

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
            ) : usuario.altura ? `${usuario.altura} cm` : "-"}
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
            ) : usuario.peso ? `${usuario.peso} kg` : "-"}
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
            ) : usuario.localizacao || "-"}
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
            ) : usuario.sobre || "-"}
          </div>

          <div>
            <strong>Habilidades:</strong>{" "}
            {editando ? (
              <input
                type="text"
                name="habilidades"
                value={formData.habilidades}
                onChange={handleInputChange}
                className="border p-2 rounded w-full"
                placeholder="Separe por vírgula"
              />
            ) : usuario.habilidades && usuario.habilidades.length > 0 ? (
              usuario.habilidades.join(", ")
            ) : (
              "-"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilJogadora;
