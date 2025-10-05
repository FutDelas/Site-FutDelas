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
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve fotos e vídeos

const perfisCaminho = path.join(__dirname, "perfis.json");
const postsCaminho = path.join(__dirname, "posts.json");

// Função para ler perfis
const lerPerfis = () => {
  try {
    if (!fs.existsSync(perfisCaminho)) {
      fs.writeFileSync(perfisCaminho, "[]", "utf-8");
    }
    const data = fs.readFileSync(perfisCaminho, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao ler perfis:", error);
    return [];
  }
};

// Função para salvar perfis
const salvarPerfis = (data) => {
  try {
    fs.writeFileSync(perfisCaminho, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Erro ao salvar perfis:", error);
  }
};

// Função para ler posts
const lerPosts = () => {
  try {
    if (!fs.existsSync(postsCaminho)) {
      fs.writeFileSync(postsCaminho, "[]", "utf-8");
    }
    const data = fs.readFileSync(postsCaminho, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Erro ao ler posts.json:", err);
    return [];
  }
};

// Função para salvar posts
const salvarPosts = (data) => {
  try {
    fs.writeFileSync(postsCaminho, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Erro ao salvar posts.json:", err);
  }
};


// Inicializar arrays
let perfis = lerPerfis();
let posts = lerPosts();

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ===== ROTAS PERFIS =====

// Criar perfil
app.post("/perfil", (req, res) => {
  const { nome, dataNascimento, email, senha, tipo } = req.body;
  if (!nome || !dataNascimento || !email || !senha || !tipo) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios" });
  }

  const novoPerfil = {
    id: uuid(),
    nome,
    dataNascimento,
    email,
    senha,
    tipo,
    foto: "",
    posicao: "",
    altura: "",
    peso: "",
    localizacao: "",
    sobre: "",
    habilidades: [],
    midias: [],
  };

  perfis.push(novoPerfil);
  salvarPerfis(perfis);

  res.status(201).json(novoPerfil);
});

// Listar todos perfis
app.get("/perfis", (req, res) => {
  res.json(perfis);
});

// Atualizar perfil
app.put("/perfil/:id", (req, res) => {
  const { id } = req.params;
  const index = perfis.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ message: "Perfil não encontrado" });

  perfis[index] = { ...perfis[index], ...req.body };
  salvarPerfis(perfis);

  res.json(perfis[index]);
});

// Upload de foto de perfil
app.post("/perfil/upload", upload.single("foto"), (req, res) => {
  const { email } = req.body;
  const foto = req.file.path.replace(/\\/g, "/");

  const perfilIndex = perfis.findIndex((p) => p.email === email);
  if (perfilIndex !== -1) {
    perfis[perfilIndex].foto = foto;
    salvarPerfis(perfis);
    return res.json({ foto });
  }
  res.status(404).json({ message: "Perfil não encontrado" });
});

// Upload de mídias do portfólio
app.post("/perfil/upload-midias", upload.array("midias"), (req, res) => {
  const { email } = req.body;
  const perfilIndex = perfis.findIndex((p) => p.email === email);
  if (perfilIndex === -1) return res.status(404).json({ message: "Perfil não encontrado" });

  const arquivos = req.files.map((f) => f.path.replace(/\\/g, "/"));
  perfis[perfilIndex].midias = [...(perfis[perfilIndex].midias || []), ...arquivos];

  salvarPerfis(perfis);

  res.json({ message: "Mídias enviadas", midias: perfis[perfilIndex].midias });
});

// Deletar mídia do portfólio
app.delete("/perfil/delete-midia", (req, res) => {
  const { email, arquivo } = req.query;
  if (!email || !arquivo) return res.status(400).json({ message: "Parâmetros inválidos" });

  const perfilIndex = perfis.findIndex((p) => p.email === email);
  if (perfilIndex === -1) return res.status(404).json({ message: "Perfil não encontrado" });

  const midiaIndex = perfis[perfilIndex].midias.findIndex((m) => m.endsWith(arquivo));
  if (midiaIndex === -1) return res.status(404).json({ message: "Mídia não encontrada" });

  const caminhoArquivo = perfis[perfilIndex].midias[midiaIndex];

  // Remove do array
  perfis[perfilIndex].midias.splice(midiaIndex, 1);
  salvarPerfis(perfis);

  // Remove do servidor
  fs.unlink(caminhoArquivo, (err) => { if (err) console.error(err); });

  res.json({ message: "Mídia deletada com sucesso!" });
});

// ===== ROTAS POSTS =====

// Criar post
app.post("/post", (req, res) => {
  const { autorEmail, autorNome, texto, foto } = req.body;
  if (!autorEmail || !autorNome || !texto) {
    return res.status(400).json({ message: "Campos obrigatórios ausentes" });
  }

  const novoPost = {
    id: uuid(),
    autorEmail,
    autor: autorNome,
    foto,
    texto,
    data: new Date().toLocaleString("pt-BR"),
    curtidas: 0,
    curtidoPor: [],
    comentarios: [],
  };

  posts.push(novoPost);
  salvarPosts(posts);

  res.status(201).json(novoPost);
});

// Pegar posts de um usuário
app.get("/posts/:email", (req, res) => {
  const { email } = req.params;
  const postsUsuario = posts.filter((p) => p.autorEmail === email);
  res.json(postsUsuario);
});

// **Nova rota para pegar todos os posts**
app.get("/posts", (req, res) => {
  res.json(posts);
});

// Deletar post
app.delete("/post/:id", (req, res) => {
  const { id } = req.params;
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ message: "Post não encontrado" });

  posts.splice(index, 1);
  salvarPosts(posts);

  res.json({ message: "Post deletado com sucesso" });
});

// ===== INICIALIZAÇÃO DO SERVIDOR =====
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`);
});
