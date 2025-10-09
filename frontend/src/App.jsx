import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './routes/Home';
import Cadastro from './routes/Cadastro';
import CadastroOlheiro from './routes/CadastroOlheiro';
import Administrador from './routes/Administrador';
import Error from './routes/Error';
import Mapa from './routes/Mapa';
import Encontros from './routes/Encontros';
import Login from './routes/Login';
import CanalDePaiseResponsaveis from "./routes/CanalDePaiseResponsaveis";
import PerfilJogadora from './routes/PerfilJogadora';
import EditarJogadora from './routes/EditarJogadora';
import Feed from './routes/Feed';
import PerfilOlheiro from './routes/PerfilOlheiro';
import Atletas from './routes/Atletas';
import PerfilJogadoraOlheiro from './routes/PerfilJogadoraOlheiro';
import Eventos from './routes/Eventos';
import EventosOlheiro from './routes/EventosOlheiro';
import Recompensas from './routes/Recompensas';
import Escolinhas from "./routes/Escolinhas";

function App() {
  return (
    <BrowserRouter>
      <Nav/>
      <main>
        <Routes>
          <Route path="/" element={<Home/>}/>

          {/* Cadastros */}
          <Route path="/cadastro" element={<Cadastro/>}/>
          <Route path="/cadastro-olheiro" element={<CadastroOlheiro/>}/>

          <Route path="/login" element={<Login/>}/>

          {/* Rotas de perfil */}
          <Route path="/perfil-jogadora" element={<PerfilJogadora/>}/>
          <Route path="/editar-jogadora" element={<EditarJogadora/>}/>
          <Route path="/feed" element={<Feed/>}/>
          <Route path="/perfil-olheiro" element={<PerfilOlheiro/>}/>
          <Route path="/atletas" element={<Atletas/>}/>
          <Route path="/perfil-jogadora-olheiro/:id" element={<PerfilJogadoraOlheiro/>}/>
          <Route path="/eventos-olheiro" element={<EventosOlheiro/>} />
          <Route path="/administrador" element={<Administrador/>} />

          {/* Outras rotas */}
          <Route path="/mapa" element={<Mapa/>}/>
          <Route path="/encontros" element={<Encontros/>}/>
          <Route path="/eventos" element={<Eventos/>} />
          <Route path="/canal-de-pais-e-responsaveis" element={<CanalDePaiseResponsaveis/>}/>
          <Route path="/recompensas" element={<Recompensas/>}/>
          <Route path="/escolinhas" element={<Escolinhas />} />

          {/* Página de erro */}
          <Route path="*" element={<Error/>}/>
        </Routes>
      </main>
      <Footer/>
    </BrowserRouter>
  )
}

export default App;
