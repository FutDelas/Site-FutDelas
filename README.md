# ⚽ FutDelas

O **FutDelas** é uma plataforma voltada para o **futebol feminino**, criada para conectar **jogadoras**, **olheiros** e **escolas esportivas**, promovendo visibilidade, oportunidades e acompanhamento do desempenho esportivo.

---

## 🔗 Links do Projeto

- 🌍 **Site Online (Vercel):** https://site-fut-delas.vercel.app/
- 💻 **Repositório no GitHub:** https://github.com/FutDelas/Site-FutDelas

---

## 📊 Funcionalidades Principais

👩‍🦰 Cadastro de jogadoras e olheiros

📅 Eventos esportivos com listagem e edição

📈 Dashboard interativo com dados de desempenho

📸 Postagens e relatórios

🧭 Navegação entre rotas com React Router

💬 Canal de comunicação entre pais e responsáveis

---

## 🌐 Visão Geral

O projeto é dividido em duas partes:

- **Frontend:** Desenvolvido em **React + Vite**, com **TailwindCSS**, compondo as interfaces de jogadoras, olheiros e administradores.
- **Backend:** Construído em **Node.js + Express**, responsável por gerenciar os dados armazenados em arquivos `.json` (simulando um banco de dados).

---


## 📂 Estrutura do Projeto

```bash

Site-FutDelas/
├── backend/
│ ├── server.js # Servidor Node.js (Express)
│ ├── eventos.json # Dados dos eventos esportivos
│ ├── perfis.json # Dados de perfis de jogadoras e olheiros
│ ├── posts.json # Publicações da comunidade
│ ├── relatorios.json # Relatórios de desempenho
│ ├── package.json # Dependências e scripts do backend
│
├── frontend/
│ ├── index.html # Ponto de entrada do app React
│ ├── vite.config.js # Configuração do Vite
│ ├── package.json # Dependências e scripts do frontend
│ ├── src/
│ │ ├── App.jsx # Componente principal
│ │ ├── main.jsx # Entrada da aplicação React
│ │ ├── index.css # Estilos globais
│ │ ├── components/ # Componentes reutilizáveis
│ │ │ ├── Nav.jsx
│ │ │ ├── Footer.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ ├── Carrossel.jsx
│ │ │ └── Jogosnatv.jsx
│ │ ├── routes/ # Páginas principais do site
│ │ │ ├── Atletas.jsx
│ │ │ ├── Cadastro.jsx
│ │ │ ├── CadastroJogadora.jsx
│ │ │ ├── CadastroOlheiro.jsx
│ │ │ ├── CanalDePaiseResponsaveis.jsx
│ │ │ ├── EditarJogadora.jsx
│ │ │ ├── Encontros.jsx
│ │ │ └── Escolinhas.jsx
```


---

## 🚀 Como Rodar o Projeto

Para baixar o projeto na sua máquina, use o comando:

```bash
git clone https://github.com/SEU-USUARIO/FutDelas.git
```

### 🔹 Backend

1. Abra o terminal e vá até a pasta:
```bash
cd Site-FutDelas/backend
 ```
2. Instale as dependências:
```bash
npm install
```
3. Inicie o servidor:
```bash
npm run dev
```
4. O backend rodará em: http://localhost:3001

### 🔹 FrontEnd

1. Abra o terminal e vá até a pasta:
```bash
cd Site-FutDelas/frontend
 ```
2. Instale as dependências:
```bash
npm install
```
3. Inicie o servidor:
```bash
npm run dev
```
4. O site abrirá em: http://localhost:5173

---

## 🙋‍♀️ Autoras do Projeto

| Nome | RM | Localização |
| :--- | :--- | :--- |
| Ana Luiza De Franco e Rinaldi | `RM: 564061` | 📍 São Paulo, Brasil |
| Giovana Gaspar Larocca | `RM: 564965` | 📍 São Paulo, Brasil |
| Giovanna Lins Sayama | `RM: 565901` | 📍 São Paulo, Brasil |
| Rayssa Luzia Portela Aquino | `RM: 562024` | 📍 São Paulo, Brasil |
