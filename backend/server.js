const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const path = require("path");

const app = express();
const Port = 3001;

app.use(cors());
app.use(bodyParser.json());

const caminho = path.join(__dirname, "perfis.json");

// Função para ler os dados
const lerPerfis = () => {
  try {
    const data = fs.readFileSync(caminho, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log("Erro ao ler o arquivo", error);
    return [];
  }
};

// Função para salvar os dados
const salvarPerfis = (data) => {
  try {
    fs.writeFileSync(caminho, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.log("Erro ao salvar o arquivo", error);
  }
};

let perfis = lerPerfis();

// Rota cadastrar perfis
app.post("/perfil", (req, res) => {
  const { nome, dataNascimento, email, senha, tipo } = req.body;

  if (!nome || !dataNascimento || !email || !senha || !tipo) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios" });
  }

  const novoPerfil = { id: uuid(), nome, dataNascimento, email, senha, tipo };

  perfis.push(novoPerfil);
  salvarPerfis(perfis);

  // Agora devolve o objeto criado
  res.status(201).json(novoPerfil);
});

// Rota para consultar todos os perfis cadastrados
app.get("/perfis", (req, res) => {
  res.json(perfis);
});

// Rota para consulta personalizada
app.get("/perfil/search", (req, res) => {
  const { pesquisa } = req.query;
  if (!pesquisa) {
    return res.status(400).json({ message: "Pesquisa não encontrada" });
  }

  const termoPesquisa = pesquisa.toLowerCase();
  const resultado = perfis.filter((perfil) =>
    perfil.nome.toLowerCase().includes(termoPesquisa)
  );

  res.json(resultado);
});

app.listen(Port, () => {
  console.log(`Servidor rodando na porta ${Port}`);
});
