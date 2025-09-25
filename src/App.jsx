import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './routes/Home';
import CadastroJogadora from './routes/CadastroJogadora';
import CadastroOlheiro from './routes/CadastroOlheiro';
import Error from './routes/Error';
import Mapa from './routes/Mapa';
import Encontros from './routes/Encontros';
import Login from './routes/Login';
import CanalDosPaiseResponsaveis from "./routes/CanalDePaiseResponsaveis";
import PerfilJogadora from './routes/PerfilJogadora';
import PerfilOlheiro from './routes/PerfilOlheiro';
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
          <Route path="/cadastro-jogadora" element={<CadastroJogadora/>}/>
          <Route path="/cadastro-olheiro" element={<CadastroOlheiro/>}/>

          <Route path="/login" element={<Login/>}/>

          {/* Rotas de perfil */}
          <Route path="/perfil-jogadora" element={<PerfilJogadora/>}/>
          <Route path="/perfil-olheiro" element={<PerfilOlheiro/>}/>

          {/* Outras rotas */}
          <Route path="/mapa" element={<Mapa/>}/>
          <Route path="/encontros" element={<Encontros/>}/>
          <Route path="/canal-de-pais-e-responsaveis" element={<CanalDosPaiseResponsaveis/>}/>
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
