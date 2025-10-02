const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3001;

// Chave secreta para JWT
const SECRET_KEY = "12345678910";

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve fotos

// Caminho do banco de dados JSON
const localDados = path.join(__dirname, "perfis.json");

// ✅ Garante que o arquivo JSON exista
if (!fs.existsSync(localDados)) {
  fs.writeFileSync(localDados, "[]", "utf-8");
}

// Função para ler perfis
const lerPerfis = () => {
  try {
    const data = fs.readFileSync(localDados, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao ler o arquivo JSON:", error);
    return [];
  }
};

// Função para salvar perfis
const salvarPerfis = (data) => {
  try {
    fs.writeFileSync(localDados, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Erro ao salvar o arquivo JSON:", error);
  }
};

// Inicia perfis em memória
let perfis = lerPerfis();

// Configuração do multer para upload de fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/**
 * Rota: cadastrar perfil
 */
app.post("/perfil", async (req, res) => {
  console.log("Chegou requisição de cadastro:", req.body);
  try {
    const { nome, dataNascimento, email, senha, tipo } = req.body;

    if (!nome || !dataNascimento || !email || !senha || !tipo) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    const users = lerPerfis();
    if (users.find((user) => user.email === email)) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }

    const hashSenha = await bcrypt.hash(senha, 10);

    const novoPerfil = {
      id: uuid(),
      nome,
      dataNascimento,
      email,
      senha: hashSenha,
      tipo,
      foto: "",
      localAtuacao: "",
      experiencia: "",
      sobre: "",
    };

    perfis.push(novoPerfil);
    salvarPerfis(perfis);

    console.log("Perfil cadastrado com sucesso:", novoPerfil);

    return res.status(201).json(novoPerfil); // Retorna o perfil completo
  } catch (error) {
    console.error("Erro ao cadastrar perfil:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

/**
 * Rota: login
 */
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const users = lerPerfis();
    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(400).json({ message: "Email ou senha inválidos" });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(400).json({ message: "Email ou senha inválidos" });
    }

    // autenticação JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: "10m" }
    );

    return res.json({ message: "Login realizado com sucesso", token });
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

/**
 * Rota: consultar todos os perfis
 */
app.get("/perfis", (req, res) => {
  res.json(perfis);
});

/**
 * Rota: consulta personalizada por nome
 */
app.get("/perfil/search", (req, res) => {
  const { pesquisa } = req.query;
  if (!pesquisa) return res.status(400).json({ message: "Pesquisa não fornecida" });

  const termo = pesquisa.toLowerCase();
  const resultado = perfis.filter((perfil) =>
    perfil.nome.toLowerCase().includes(termo)
  );

  res.json(resultado);
});

/**
 * Rota: atualizar perfil
 */
app.put("/perfil/:id", (req, res) => {
  const { id } = req.params;
  const index = perfis.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ message: "Perfil não encontrado" });

  perfis[index] = { ...perfis[index], ...req.body };
  salvarPerfis(perfis);

  res.json(perfis[index]);
});

/**
 * Rota: upload de foto de perfil
 */
app.post("/perfil/upload", upload.single("foto"), (req, res) => {
  const { email } = req.body;
  if (!req.file) return res.status(400).json({ message: "Arquivo não enviado" });

  const foto = req.file.path.replace(/\\/g, "/");
  const perfilIndex = perfis.findIndex((p) => p.email === email);

  if (perfilIndex !== -1) {
    perfis[perfilIndex].foto = foto;
    salvarPerfis(perfis);
    return res.json({ foto });
  }

  res.status(404).json({ message: "Perfil não encontrado" });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
