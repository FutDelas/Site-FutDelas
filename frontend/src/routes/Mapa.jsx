import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom"; 
// MUDANÇA AQUI: Trocando 'hero.jpg' por 'encontro3.jpg'
import backgroundMapImage from "../assets/encontro2.jpg"; 

// --- Configuração do Ícone ---
const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41] 
});

// --- Dados dos Marcadores ---
const markers = [
  { 
    position: [-23.5275, -46.6781], 
    title: "Allianz Parque", 
    info: "Peneira dia 30/10 às 14h",
  },
  { 
    position: [-23.601, -46.657], 
    title: "Centro de Treinamento", 
    info: "Peneira dia 22/10 às 9h",
  },
  { 
    position: [-23.5455, -46.4746], 
    title: "Neo Química Arena", 
    info: "Evento de organizadores dia 10/10 às 9h",
  },
  { 
    position: [-23.56697854, -46.7432093], 
    title: "Peneira PassaBola x Futdelas", 
    info: "Peneira juvenil dia 03/11 às 10h",
  },
  { 
    position: [-23.6010029,-46.7226197], 
    title: "Estádio Morumbi", 
    info: "Evento de organizadores e olheiros dia 12/11 às 16h",
  },
];

const Mapa = () => {
  const navigate = useNavigate();

  const irPara = (path) => {
    navigate(path);
  };

  const handleMarkerClick = (marker) => {
    console.log(`Clicou em ${marker.title}`);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center text-[#0A192F] px-4 py-12 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(240, 98, 146, 0.95), rgba(10, 25, 47, 0.85)), url(${backgroundMapImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-6xl text-center z-10 bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl transition-all duration-500 transform hover:shadow-4xl">
        
        {/* Títulos com Estilo */}
        <h1 className="text-4xl md:text-6xl font-black drop-shadow-md mb-4 text-[#0A192F] tracking-tight">
          Onde o Jogo<br />Acontece
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-[#F06292] animate-pulse">
          Seu Guia de Oportunidades
        </h2>
        
        <p className="text-lg mb-4 max-w-4xl mx-auto text-gray-700">
          Encontre eventos e peneiras no mapa. Planeje sua jornada e dê o próximo passo na sua carreira!
        </p>

        {/* Mapa com Borda Destacada e Sombra */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[#F06292] hover:border-[#0A192F] transition-colors duration-300 mb-10 transform hover:scale-[1.01]">
          <MapContainer 
            center={[-23.5505, -46.6333]} 
            zoom={12} 
            scrollWheelZoom={true} 
            className="h-[550px] w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map((marker, index) => (
              <Marker 
                key={index} 
                position={marker.position} 
                icon={markerIcon} 
                eventHandlers={{ click: () => handleMarkerClick(marker) }}
              >
                <Popup>
                  <div className="p-2">
                    <strong className="text-[#0A192F] text-lg">{marker.title}</strong> 
                    <p className="text-sm my-1">{marker.info}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
          <button
            onClick={() => irPara("/encontros")}
            className="cursor-pointer bg-[#F06292] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-[#F06292] hover:bg-[#be4e74]"
          >
            Listar Eventos
          </button>

          <button
            onClick={() => window.history.back()}
            className="bg-gray-300 text-[#0A192F] font-bold py-3 px-8 rounded-full hover:bg-gray-400 transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mapa;