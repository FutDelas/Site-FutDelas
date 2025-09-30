import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const Mapa = () => {
  return (
    <div className="min-h-screen bg-[#FAD1DF] flex flex-col items-center justify-center text-[#0A192F] relative overflow-hidden">

      {/* Conteúdo */}
      <div className="relative z-10 text-center px-6 w-full max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg mb-8 text-[#0A192F]">
          Mapa de Peneiras
        </h1>
        <p className="text-lg text-[#0A192F] mb-6 max-w-3xl mx-auto"> 
          Nosso mapa foi feito para facilitar a visualização de todos os locais onde 
          há peneiras de futebol feminino, para que 
          você possa se planejar e não perder nenhuma oportunidade.
        </p>
        <p className="text-xs text-[#F06292] mb-8 max-w-3xl mx-auto">
          Clique nos marcadores para mais informações! 
        </p>

        {/* Mapa com Leaflet */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[#F06292]">
          <MapContainer
            center={[-23.5505, -46.6333]}
            zoom={12}
            scrollWheelZoom={true}
            className="h-[500px] w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contribuidores'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[-23.5275, -46.6781]} icon={icon}>
              <Popup>
                <strong>Allianz Parque</strong> <br /> Peneira dia 20/09 às 14h.
              </Popup>
            </Marker>

            <Marker position={[-23.601, -46.657]} icon={icon}>
              <Popup>
                <strong>Centro de Treinamento</strong> <br /> Peneira dia 29/09 às 9h.
              </Popup>
            </Marker>

            <Marker position={[-23.5455, -46.4746]} icon={icon}>
              <Popup>
                <strong>Neo Química Arena</strong> <br /> Evento de organizadores dia 02/10 às 10h
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Botão de voltar */}
        <button
          onClick={() => window.history.back()}
          className="mt-8 cursor-pointer bg-[#0A192F] text-white font-bold py-3 px-6 rounded-full hover:bg-[#0A192F] transition transform hover:scale-105"
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default Mapa;
