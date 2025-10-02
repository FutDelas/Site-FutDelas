import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/login", {
        email,
        senha,
      });

      const { token, message } = response.data;

      // Salva token e email no localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("usuarioEmail", email);

      alert(message);

      // Redireciona dependendo do tipo (precisamos buscar o perfil)
      const perfilRes = await axios.get("http://localhost:3001/perfis");
      const usuario = perfilRes.data.find((u) => u.email === email);

      if (usuario.tipo === "jogadora") {
        navigate("/feed");
      } else {
        navigate("/atletas");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Erro de conexão com o servidor.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#FAD1DF]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-[#F06292]">
        <h1 className="text-3xl font-bold text-center text-[#0A192F] mb-6">
          Login
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-[#F06292] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06292]"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="border border-[#F06292] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06292]"
          />
          <button
            type="submit"
            className="bg-[#F06292] text-white font-semibold py-3 rounded-lg hover:bg-[#d94d7f] transition"
          >
            Entrar
          </button>

          <div className="flex justify-center gap-4 mt-2 text-sm">
            <span
              className="cursor-pointer text-[#F06292] hover:underline"
              onClick={() => navigate("/cadastro")}
            >
              Cadastre-se como Jogadora
            </span>
            <span className="text-[#0A192F]">|</span>
            <span
              className="cursor-pointer text-[#F06292] hover:underline"
              onClick={() => navigate("/cadastro-olheiro")}
            >
              Cadastre-se como Olheiro
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
