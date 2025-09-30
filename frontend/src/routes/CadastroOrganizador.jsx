import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CadastroOrganizador = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const navigate = useNavigate();

  const handleCadastro = (e) => {
    e.preventDefault();

    const novoOrganizador = { nome, email, senha, telefone };
    const organizadores = JSON.parse(localStorage.getItem("organizadores")) || [];

    const existe = organizadores.find((u) => u.email === email);
    if (existe) {
      alert("E-mail já cadastrado! Vá para o login de organizador.");
      navigate("/login-organizador");
      return;
    }

    organizadores.push(novoOrganizador);
    localStorage.setItem("organizadores", JSON.stringify(organizadores));

    alert("Cadastro de organizador realizado com sucesso!");
    navigate("/login-organizador");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#FAD1DF]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-[#F06292]">
        <h1 className="text-3xl font-bold text-center text-[#0A192F] mb-6">
          Cadastro Organizador
        </h1>
        <form onSubmit={handleCadastro} className="flex flex-col gap-4">
          
          <input
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="border border-[#F06292] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06292]"
          />
          
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
          
          <input
            type="tel"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
            className="border border-[#F06292] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06292]"
          />

          <button
            type="submit"
            className="bg-[#F06292] text-white font-semibold py-3 rounded-lg hover:bg-[#d94d7f] transition"
          >
            Cadastrar Organizador
          </button>

          <p
            onClick={() => navigate("/login-organizador")}
            className="text-center text-sm text-[#0A192F] mt-2 cursor-pointer hover:underline"
          >
            Já tem conta de organizador? Faça login
          </p>
        </form>
      </div>
    </div>
  );
};

export default CadastroOrganizador;
