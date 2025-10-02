const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve as fotos

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

// Configuração do multer para upload de fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Rota cadastrar perfis
app.post("/perfil", (req, res) => {
  const { nome, dataNascimento, email, senha, tipo } = req.body;

  if (!nome || !dataNascimento || !email || !senha || !tipo) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios" });
  }

  const novoPerfil = { id: uuid(), nome, dataNascimento, email, senha, tipo, foto: "", localAtuacao: "", experiencia: "", sobre: "" };
  perfis.push(novoPerfil);
  salvarPerfis(perfis);

  res.status(201).json(novoPerfil);
});

// Rota para consultar todos os perfis cadastrados
app.get("/perfis", (req, res) => {
  res.json(perfis);
});

// Rota para consulta personalizada
app.get("/perfil/search", (req, res) => {
  const { pesquisa } = req.query;
  if (!pesquisa) return res.status(400).json({ message: "Pesquisa não encontrada" });

  const termoPesquisa = pesquisa.toLowerCase();
  const resultado = perfis.filter((perfil) =>
    perfil.nome.toLowerCase().includes(termoPesquisa)
  );

  res.json(resultado);
});

// Atualizar perfil
app.put("/perfil/:id", (req, res) => {
  const { id } = req.params;
  const index = perfis.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: "Perfil não encontrado" });

  perfis[index] = { ...perfis[index], ...req.body };
  salvarPerfis(perfis);

  res.json(perfis[index]);
});

// Upload de foto
app.post("/perfil/upload", upload.single("foto"), (req, res) => {
  const { email } = req.body;
  const foto = req.file.path.replace(/\\/g, "/"); // Corrige caminho no Windows

  const perfilIndex = perfis.findIndex(p => p.email === email);
  if (perfilIndex !== -1) {
    perfis[perfilIndex].foto = foto;
    salvarPerfis(perfis);
    return res.json({ foto });
  }
  res.status(404).json({ message: "Perfil não encontrado" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
