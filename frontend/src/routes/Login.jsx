import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(
      (u) => u.email === email && u.senha === senha
    );

    if (usuario) {
      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      if (usuario.tipo === "jogadora") {
        navigate("/perfil-jogadora");
      } else {
        navigate("/perfil-olheiro");
      }
    } else {
      alert("E-mail ou senha inválidos!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#FAD1DF]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-[#F06292]">
        <h1 className="text-3xl font-bold text-center text-[#0A192F] mb-6">Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required className="border border-[#F06292] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06292]" />
          <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required className="border border-[#F06292] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06292]" />
          <button type="submit" className="bg-[#F06292] text-white font-semibold py-3 rounded-lg hover:bg-[#d94d7f] transition">Entrar</button>
          <p className="text-center text-sm text-[#0A192F] mt-2">
            Não tem conta?{" "}
            <span className="cursor-pointer text-[#F06292] hover:underline" onClick={() => navigate("/cadastro-jogadora")}>Cadastre-se Jogadora</span> |{" "}
            <span className="cursor-pointer text-[#F06292] hover:underline" onClick={() => navigate("/cadastro-olheiro")}>Cadastre-se Olheiro</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
