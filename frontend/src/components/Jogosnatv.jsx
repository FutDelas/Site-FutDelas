// src/components/JogosNaTv.jsx
import { Tv, Calendar, Clock } from "lucide-react";

const JogosNaTv = () => {
  // Lista de jogos (futuramente pode vir de API ou banco de dados)
  const jogos = [
    {
      id: 1,
      data: "20/09/2025",
      horario: "16:00",
      times: "Brasil x Argentina",
      canal: "SportTV",
    },
    {
      id: 2,
      data: "21/09/2025",
      horario: "18:30",
      times: "Corinthians x Ferroviária",
      canal: "Band",
    },
    {
      id: 3,
      data: "22/09/2025",
      horario: "14:00",
      times: "São Paulo x Palmeiras",
      canal: "ESPN",
    },
  ];

  return (
    <section className="py-12 bg-[#F4F0F8] text-center">
      <h2 className="text-3xl font-bold text-[#14001D] mb-8 flex items-center justify-center gap-2">
        <Tv className="w-8 h-8 text-[#FF6F91]" />
        Próximos Jogos na TV
      </h2>

      <div className="max-w-3xl mx-auto grid gap-6">
        {jogos.map((jogo) => (
          <div
            key={jogo.id}
            className="bg-white shadow-lg rounded-2xl p-6 text-left flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-2xl transition"
          >
            <div>
              <p className="text-lg font-semibold text-[#F06292]">{jogo.times}</p>
              <div className="flex items-center gap-4 text-[#333333] mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {jogo.data}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {jogo.horario}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="bg-[#0A192F] text-white px-4 py-2 rounded-full text-sm font-bold">
                {jogo.canal}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default JogosNaTv;
