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
    tipo: "",
  });

  const cadastrarPerfil = async () => {
    if (
      !novoPerfil.nome ||
      !novoPerfil.dataNascimento ||
      !novoPerfil.email ||
      !novoPerfil.senha ||
      !novoPerfil.tipo
    ) {
      alert("Todos os campos são obrigatórios");
      return;
    }

    try {
      const response = await axios.post(API_URL, novoPerfil);

      // Mensagem de sucesso
      alert(`Usuário ${response.data.nome} cadastrado com sucesso!`);

      // Limpa o formulário
      setNovoPerfil({
        nome: "",
        dataNascimento: "",
        email: "",
        senha: "",
        tipo: "",
      });

      // Redireciona para a página de login
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
          <select
            value={novoPerfil.tipo}
            onChange={(e) =>
              setNovoPerfil({ ...novoPerfil, tipo: e.target.value })
            }
            className="border border-[#F06292] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06292] text-[#0A192F]"
          >
            <option value="" disabled>
              Selecione o tipo de conta
            </option>
            <option value="jogadora">Jogadora</option>
            <option value="treinador">Treinador</option>
            <option value="empresa/patrocinador">Empresa/Patrocinador</option>
          </select>
          <button
            type="submit"
            className="bg-[#F06292] text-white font-semibold py-3 rounded-lg hover:bg-[#d94d7f] transition"
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
