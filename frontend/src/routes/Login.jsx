import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Faz a requisição para o backend
      const response = await fetch("http://localhost:3001/perfis");
      const usuarios = await response.json();

      // Verifica se o email e senha existem no backend
      const usuario = usuarios.find(
        (u) => u.email === email && u.senha === senha
      );

      if (usuario) {
        // Salva o usuário logado no localStorage (para manter sessão)
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

        // Redireciona de acordo com o tipo
        if (usuario.tipo === "jogadora") {
          navigate("/perfil-jogadora");
        } else {
          navigate("/perfil-olheiro");
        }
      } else {
        alert("E-mail ou senha inválidos!");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro de conexão com o servidor.");
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
          <p className="text-center text-sm text-[#0A192F] mt-2">
            Não tem conta?{" "}
            <span
              className="cursor-pointer text-[#F06292] hover:underline"
              onClick={() => navigate("/cadastro")}
            >
              Cadastre-se
            </span>{" "}
            |{" "}
            <span
              className="cursor-pointer text-[#F06292] hover:underline"
              onClick={() => navigate("/cadastro-olheiro")}
            >
              Cadastre-se Olheiro
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
