import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CadastroOlheiro = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [localAtuacao, setLocalAtuacao] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const navigate = useNavigate();

  const handleCadastro = (e) => {
    e.preventDefault();

    const novoUsuario = {
      nome,
      email,
      senha,
      tipo: "treinador",
      localAtuacao,
      experiencia
    };

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existe = usuarios.find((u) => u.email === email);
    if (existe) {
      alert("E-mail já cadastrado! Vá para o login.");
      navigate("/login");
      return;
    }

    usuarios.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cadastro realizado com sucesso!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#FAD1DF] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-[#F06292]">
        <h1 className="text-3xl font-bold text-center text-[#0A192F] mb-6">Cadastro Olheiro</h1>
        <form onSubmit={handleCadastro} className="flex flex-col gap-4">
          <input type="text" placeholder="Nome completo" value={nome} onChange={e => setNome(e.target.value)} required className="border border-[#F06292] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06292]" />
          <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required className="border border-[#F06292] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06292]" />
          <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required className="border border-[#F06292] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06292]" />
          <input type="text" placeholder="Local de atuação" value={localAtuacao} onChange={e => setLocalAtuacao(e.target.value)} className="border border-[#F06292] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06292]" />
          <textarea placeholder="Experiência" value={experiencia} onChange={e => setExperiencia(e.target.value)} className="border border-[#F06292] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06292]" />
          <button type="submit" className="bg-[#F06292] text-white font-semibold py-3 rounded-lg hover:bg-[#d94d7f] transition">Cadastrar</button>
          <p onClick={() => navigate("/login")} className="text-center text-sm text-[#0A192F] mt-2 cursor-pointer hover:underline">Já tem conta? Faça login</p>
        </form>
      </div>
    </div>
  );
};

export default CadastroOlheiro;
