import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cadastro = () => {
  const API_URL = "http://localhost:3001/perfil";
  const navigate = useNavigate();

  const [novoPerfil, setNovoPerfil] = useState({
    nome: "",
    dataNascimento: "",
    email: "",
    senha: "",
    tipo: "jogadora",
  });

  const cadastrarPerfil = async () => {
    if (
      !novoPerfil.nome ||
      !novoPerfil.dataNascimento ||
      !novoPerfil.email ||
      !novoPerfil.senha
    ) {
      alert("Todos os campos são obrigatórios");
      return;
    }

    try {
      const response = await axios.post(API_URL, novoPerfil);

      alert(`Usuária ${response.data.nome} cadastrada com sucesso!`);

      setNovoPerfil({
        nome: "",
        dataNascimento: "",
        email: "",
        senha: "",
        tipo: "jogadora",
      });

      navigate("/login");
    } catch (error) {
      console.log("Erro ao cadastrar perfil", error);
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Erro ao cadastrar. Tente novamente.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAD1DF] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-[#F06292]">
        <h1 className="text-3xl font-bold text-center text-[#0A192F] mb-6">
          Cadastro
        </h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            cadastrarPerfil();
          }}
        >
          <input
            type="text"
            placeholder="Nome completo"
            value={novoPerfil.nome}
            onChange={(e) =>
              setNovoPerfil({ ...novoPerfil, nome: e.target.value })
            }
            className="border border-[#F06292] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06292]"
          />
          <input
            type="date"
            value={novoPerfil.dataNascimento}
            onChange={(e) =>
              setNovoPerfil({ ...novoPerfil, dataNascimento: e.target.value })
            }
            className="border border-[#F06292] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06292]"
          />
          <input
            type="email"
            placeholder="E-mail"
            value={novoPerfil.email}
            onChange={(e) =>
              setNovoPerfil({ ...novoPerfil, email: e.target.value })
            }
            className="border border-[#F06292] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06292]"
          />
          <input
            type="password"
            placeholder="Senha"
            value={novoPerfil.senha}
            onChange={(e) =>
              setNovoPerfil({ ...novoPerfil, senha: e.target.value })
            }
            className="border border-[#F06292] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06292]"
          />

          <button
            type="submit"
            className="cursor-pointer bg-[#F06292] text-white font-semibold py-3 rounded-lg hover:bg-[#d94d7f] transition"
          >
            Cadastrar
          </button>
          <p
            onClick={() => navigate("/login")}
            className="text-center text-sm text-[#0A192F] mt-2 cursor-pointer hover:underline"
          >
            Já tem conta? Faça login
          </p>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
