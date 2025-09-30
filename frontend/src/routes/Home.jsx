// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import Carrossel from "../components/Carrossel";
import JogosNaTv from "../components/Jogosnatv";
import { MdLocationOn, MdDateRange, MdAccessTime } from "react-icons/md";
import { FaTrophy } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>

      {/* BANNER / CARROSSEL PRINCIPAL */}
      <section className="relative w-full h-[60vh] overflow-hidden">
        <Slider
          autoplay
          autoplaySpeed={3000}
          infinite
          dots
          arrows
          pauseOnHover={false}
          pauseOnFocus={false}
          className="h-full"
        >
          {/* SLIDE 1 */}
          <div className="h-[60vh] flex justify-center items-center text-white bg-gradient-to-r from-[#0A192F] to-[#1E3A5F]">
            <div className="w-full h-full flex flex-col justify-center items-center text-center px-4">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-3 drop-shadow-lg">
                Conecte-se ao Futebol Feminino
              </h1>
              <p className="text-base md:text-lg mb-4 max-w-xl">
                Encontre peneiras, torneios e eventos perto de você e faça parte de uma rede que fortalece o esporte.
              </p>
              <button
                onClick={() => navigate("/mapa")}
                className="bg-[#F06292] text-white font-bold py-2 px-5 rounded-full hover:bg-[#E65A7F] transition transform hover:scale-105 shadow-lg"
              >
                Ver Peneiras
              </button>
            </div>
          </div>

          {/* SLIDE 2 */}
          <div className="h-[60vh] flex justify-center items-center text-white bg-gradient-to-r from-[#F06292] to-[#1E3A5F]">
            <div className="w-full h-full flex flex-col justify-center items-center text-center px-4">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-3 drop-shadow-lg">
                Transforme seu Sonho em Oportunidade
              </h1>
              <p className="text-base md:text-lg mb-4 max-w-xl">
                Participe de peneiras, mostre seu talento e seja vista por olheiros e treinadores.
              </p>
              <button
                onClick={() => navigate("/encontros")}
                className="bg-white text-[#1E3A5F] font-bold py-2 px-5 rounded-full hover:bg-[#FCE4EC] transition transform hover:scale-105 shadow-lg"
              >
                Participar
              </button>
            </div>
          </div>

          {/* SLIDE 3 */}
          <div className="h-[60vh] flex justify-center items-center text-white bg-gradient-to-r from-[#0A192F] to-[#F06292]">
            <div className="w-full h-full flex flex-col justify-center items-center text-center px-4">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-3 drop-shadow-lg">
                Pais e Responsáveis Juntos
              </h1>
              <p className="text-base md:text-lg mb-4 max-w-xl">
                Acompanhe o desenvolvimento das atletas e apoie cada passo da jornada.
              </p>
              <button
                onClick={() => navigate("/canal-de-pais-e-responsaveis")}
                className="bg-[#F06292] text-white font-bold py-2 px-5 rounded-full hover:bg-[#E65A7F] transition transform hover:scale-105 shadow-lg"
              >
                Acessar Canal dos Pais
              </button>
            </div>
          </div>
        </Slider>
      </section>

      {/* SEÇÃO DE ENCONTROS */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="md:w-1/2 flex flex-col items-start">
            <h3 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#F06292" }}>
              Encontro FutDelas
            </h3>
            <p className="text-xl md:text-1xl mb-6" style={{ color: "#0A192F" }}>
              São momentos especiais para mulheres de todas as idades e níveis se divertirem,
              praticarem futebol e conhecerem novas amigas que também amam o esporte. 
              Venha jogar, aprender e celebrar o futebol feminino com a gente!
            </p>
            <button
              onClick={() => navigate("/encontros")}
              className="py-3 px-6 rounded-full transition transform hover:scale-105"
              style={{ backgroundColor: "#F06292", color: "#FFFFFF" }}
            >
              Se inscreva!
            </button>
          </div>

          <div className="md:w-1/2 flex flex-col items-center">
            <div className="p-8 rounded-xl shadow-lg transition transform hover:scale-105 border-t-4 flex flex-col justify-center h-full w-full" 
                 style={{ backgroundColor: "#E0E4E8", color: "#0A192F", borderColor: "#F06292" }}>
              <h4 className="font-bold text-2xl mb-4">Próximo Encontro</h4>
              <p className="text-lg mb-2 flex items-center gap-2" style={{ color: "#1E3A5F" }}><MdLocationOn /> Av. dos Campeões, 45 – Centro</p>
              <p className="text-lg mb-2 flex items-center gap-2" style={{ color: "#1E3A5F" }}><MdDateRange /> 18/09</p>
              <p className="text-lg flex items-center gap-2" style={{ color: "#1E3A5F" }}><MdAccessTime /> 20:00 - 23:00</p>
            </div>
          </div>
        </div>
      </section>

            {/* SEÇÃO DE ESCOLINHAS */}
      <section className="py-16 text-center" style={{ backgroundColor: "#E0E4E8", color: "#0A192F" }}>
        <h3 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#F06292" }}>
          Escolinhas de Futebol
        </h3>
        <p className="max-w-3xl mx-auto mb-10 text-lg">
          Conheça nossas escolinhas parceiras e dê o primeiro passo para transformar seu sonho
          em realidade. Escolha a mais próxima de você e comece a treinar!
        </p>

        {/* GRID DE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-2xl transition transform hover:scale-105 border-l-4 border-[#F06292]">
            <h4 className="text-xl font-bold mb-2" style={{ color: "#F06292" }}>Escolinha Bola de Ouro</h4>
            <p className="mb-1">📍 Centro - São Paulo</p>
            <p className="mb-1">👧 Faixa etária: 8 a 15 anos</p>
            <p className="mb-1">⚽ Foco: Formação de base</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-2xl transition transform hover:scale-105 border-l-4 border-[#F06292]">
            <h4 className="text-xl font-bold mb-2" style={{ color: "#F06292" }}>Academia Estrelas</h4>
            <p className="mb-1">📍 Vila Olímpica - Rio de Janeiro</p>
            <p className="mb-1">👧 Faixa etária: 10 a 18 anos</p>
            <p className="mb-1">🏆 Foco: Desenvolvimento competitivo</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-2xl transition transform hover:scale-105 border-l-4 border-[#F06292]">
            <h4 className="text-xl font-bold mb-2" style={{ color: "#F06292" }}>Futuro Feminino</h4>
            <p className="mb-1">📍 Bairro Industrial - Belo Horizonte</p>
            <p className="mb-1">👧 Faixa etária: 6 a 14 anos</p>
            <p className="mb-1">💪 Foco: Iniciação esportiva</p>
          </div>
        </div>

        {/* BOTÃO VER MAIS */}
        <div className="mt-10">
          <button
            onClick={() => navigate("/escolinhas")}
            className="py-3 px-6 rounded-full transition transform hover:scale-105"
            style={{ backgroundColor: "#F06292", color: "#FFFFFF" }}
          >
            Ver Todas as Escolinhas
          </button>
        </div>
      </section>


      {/* SEÇÃO DE RECOMPENSAS */}
      <section className="py-16 text-center" style={{ backgroundColor: "#F06292", color: "#FFFFFF" }}>
        <div className="flex flex-col items-center">
          <FaTrophy className="text-white text-5xl mb-4" />
          <h3 className="text-4xl md:text-5xl font-bold mb-4">Recompensas</h3>
          <p className="max-w-2xl mx-auto text-lg mb-6">
            Participe dos encontros, desafios e torneios para acumular pontos e trocar por prêmios incríveis! 
            Incentivamos cada jogadora a continuar evoluindo dentro e fora de campo.
          </p>
          <button
            onClick={() => navigate("/recompensas")}
            className="py-3 px-6 rounded-full transition transform hover:scale-105"
            style={{ backgroundColor: "#FFFFFF", color: "#F06292" }}
          >
            Ver Recompensas
          </button>
        </div>
      </section>

      {/* SEÇÃO DE PENEIRAS */}
      <section className="py-16 text-center" style={{ backgroundColor: "#0A192F", color: "#FFFFFF" }}>
        <h3 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#F06292" }}>Peneiras Próximas</h3>
        <p className="max-w-3xl mx-auto mb-8 text-lg">
          Veja onde estão as peneiras e eventos perto de você. Clique no botão para acessar o mapa completo!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[{ title: "Allianz Parque", local: "Rua das Américas, 123", data: "20/09", hora: "14:00 - 16:00" },
            { title: "Centro de Treinamento", local: "Av. dos Campeões, 45", data: "29/09", hora: "09:00 - 12:00" },
            { title: "Neo Química Arena", local: "Rua do Esporte, 56", data: "02/10", hora: "10:00 - 13:00" }].map((p, i) => (
            <div key={i} className="bg-[#FFFFFF] text-[#0A192F] p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 border-l-4 border-[#F06292]">
              <h4 className="font-bold text-xl mb-2">{p.title}</h4>
              <p className="mb-1 flex items-center gap-2"><MdLocationOn /> {p.local}</p>
              <p className="mb-1 flex items-center gap-2"><MdDateRange /> {p.data}</p>
              <p className="flex items-center gap-2"><MdAccessTime /> {p.hora}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <button
            onClick={() => navigate("/mapa")}
            className="py-3 px-6 rounded-full transition transform hover:scale-105"
            style={{ backgroundColor: "#F06292", color: "#FFFFFF" }}
          >
            Ver Mapa Completo
          </button>
        </div>
      </section>

      {/* CARROSSEL DE DEPOIMENTOS */}
      <Carrossel fundo="#0A192F" />

      {/* JOGOS NA TV */}
      <JogosNaTv />

      {/* NÚMEROS / ESTATÍSTICAS */}
      <section className="py-12 text-center bg-[#F06292]">
        <h3 className="text-3xl font-bold mb-8" style={{ color: "#FFFFFF" }}>Nossos números</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {["500+", "30+", "15+"].map((num, i) => (
            <div key={i} className="p-6 bg-[#FFFFFF] rounded-2xl shadow-lg hover:shadow-2xl transition text-[#0A192F] border-t-2 border-[#112240]">
              <p className="text-4xl font-bold">{num}</p>
              <p>{["Jogadoras cadastradas", "Torneios apoiados", "Clubes conectados"][i]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CANAL DOS PAIS */}
      <section className="py-16 text-center" style={{ backgroundColor: "#112240", color: "#FFFFFF" }}>
        <h3 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: "#F06292" }}>Canal dos Pais</h3>
        <p className="max-w-3xl mx-auto text-lg md:text-xl mb-8">
          Um espaço dedicado aos pais e responsáveis acompanharem o desenvolvimento das jovens jogadoras,
          receber dicas de segurança, participar de decisões e acompanhar torneios e recompensas.
        </p>
        <button
          onClick={() => navigate("/canal-de-pais-e-responsaveis")}
          className="py-3 px-6 rounded-full transition transform hover:scale-105"
          style={{ backgroundColor: "#F06292", color: "#FFFFFF" }}
        >
          Acessar Canal dos Pais
        </button>
      </section>

    </div>
  );
};

export default Home;
