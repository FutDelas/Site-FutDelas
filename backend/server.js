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

// ===== Caminhos dos arquivos JSON =====
const perfisCaminho = path.join(__dirname, "perfis.json");
const postsCaminho = path.join(__dirname, "posts.json");
const relatoriosCaminho = path.join(__dirname, "relatorios.json");
const eventosPath = path.join(__dirname, "data", "eventos.json");

// ===== Funções utilitárias =====

// Perfis
const lerPerfis = () => {
  try {
    if (!fs.existsSync(perfisCaminho)) fs.writeFileSync(perfisCaminho, "[]", "utf-8");
    return JSON.parse(fs.readFileSync(perfisCaminho, "utf-8"));
  } catch (error) {
    console.error("Erro ao ler perfis:", error);
    return [];
  }
};

const salvarPerfis = (data) => {
  try {
    fs.writeFileSync(perfisCaminho, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Erro ao salvar perfis:", error);
  }
};

// Posts
const lerPosts = () => {
  try {
    if (!fs.existsSync(postsCaminho)) fs.writeFileSync(postsCaminho, "[]", "utf-8");
    return JSON.parse(fs.readFileSync(postsCaminho, "utf-8"));
  } catch (err) {
    console.error("Erro ao ler posts.json:", err);
    return [];
  }
};

const salvarPosts = (data) => {
  try {
    fs.writeFileSync(postsCaminho, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Erro ao salvar posts.json:", err);
  }
};

// Relatórios
const lerRelatorios = () => {
  try {
    if (!fs.existsSync(relatoriosCaminho)) fs.writeFileSync(relatoriosCaminho, "[]", "utf-8");
    return JSON.parse(fs.readFileSync(relatoriosCaminho, "utf-8"));
  } catch (err) {
    console.error("Erro ao ler relatorios.json:", err);
    return [];
  }
};

const salvarRelatorios = (data) => {
  try {
    fs.writeFileSync(relatoriosCaminho, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Erro ao salvar relatorios.json:", err);
  }
};

// Inicializar arrays
let perfis = lerPerfis();
let posts = lerPosts();
let relatorios = lerRelatorios();

// ===== Configuração do multer =====
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
  if (!nome || !dataNascimento || !email || !senha || !tipo)
    return res.status(400).json({ message: "Todos os campos são obrigatórios" });

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

  perfis[perfilIndex].midias.splice(midiaIndex, 1);
  salvarPerfis(perfis);

  fs.unlink(caminhoArquivo, (err) => { if (err) console.error(err); });

  res.json({ message: "Mídia deletada com sucesso!" });
});

// ===== ROTAS POSTS =====

// Criar post
app.post("/post", (req, res) => {
  const { autorEmail, autorNome, texto, foto } = req.body;
  if (!autorEmail || !autorNome || !texto)
    return res.status(400).json({ message: "Campos obrigatórios ausentes" });

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

// Todos os posts
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

// ===== ROTAS EVENTOS =====
app.get("/eventos", (req, res) => {
  const filePath = path.join(__dirname, "eventos.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return res.status(500).json({ erro: "Não foi possível carregar os eventos" });
    res.json(JSON.parse(data));
  });
});

app.post("/eventos/:id/inscrever", (req, res) => {
  const filePath = path.join(__dirname, "eventos.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return res.status(500).json({ erro: "Erro ao ler eventos" });

    const eventos = JSON.parse(data);
    const evento = eventos.find(e => e.id === parseInt(req.params.id));
    if (!evento) return res.status(404).json({ erro: "Evento não encontrado" });

    const { nome, email } = req.body;
    if (!evento.inscritos) evento.inscritos = [];

    if (evento.inscritos.find(i => i.email === email))
      return res.status(400).json({ erro: "Jogadora já inscrita" });

    evento.inscritos.push({ nome, email });

    fs.writeFile(filePath, JSON.stringify(eventos, null, 2), (err) => {
      if (err) return res.status(500).json({ erro: "Não foi possível salvar inscrição" });
      res.json({ sucesso: true, mensagem: "Inscrição realizada com sucesso" });
    });
  });
});

// ===== ROTAS RELATÓRIOS =====

// Criar relatório
app.post("/relatorios", (req, res) => {
  const { jogadoraId, eventoId, pontosFortes, pontosAMelhorar, nota, olheiro } = req.body;

  if (!jogadoraId || !pontosFortes || !nota || !olheiro)
    return res.status(400).json({ message: "Campos obrigatórios faltando" });

  const novoRelatorio = {
    id: uuid(),
    jogadoraId,
    eventoId: eventoId || null,
    pontosFortes,
    pontosAMelhorar: pontosAMelhorar || "",
    nota,
    olheiro,
    data: new Date().toISOString()
  };

  relatorios.push(novoRelatorio);
  salvarRelatorios(relatorios);

  res.status(201).json(novoRelatorio);
});

// Pegar todos relatórios
app.get("/relatorios", (req, res) => {
  res.json(relatorios);
});

// Pegar relatórios de uma jogadora com dados do olheiro
app.get("/relatorios/:jogadoraId", (req, res) => {
  const { jogadoraId } = req.params;
  const relatoriosJogadora = relatorios
    .filter(r => r.jogadoraId === jogadoraId)
    .map(r => {
      const olheiro = perfis.find(p => p.id === r.olheiro) || {};
      return {
        ...r,
        olheiro: {
          id: olheiro.id,
          nome: olheiro.nome,
          foto: olheiro.foto || null,
          email: olheiro.email || null
        }
      };
    });
  res.json(relatoriosJogadora);
});

// ===== INICIALIZAÇÃO DO SERVIDOR =====
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`);
});
