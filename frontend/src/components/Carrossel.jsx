// src/components/Carrossel.jsx
import React, { useState, useEffect } from "react";

// Importando as imagens dos depoimentos
import jogadora1 from "../assets/ana.jpg";
import jogadora2 from "../assets/luisa.jpg";
import jogadora3 from "../assets/depoimento.jpg";
import mae1 from "../assets/mae.jpg";
import treinadora1 from "../assets/treinadora.jpg";

const depoimentos = [
  {
    nome: "Ana Vasconcelos",
    idade: "",
    texto: "O Passa a Bola me ajudou a encontrar meu clube ideal e melhorar meu desempenho. Agora sinto que tenho oportunidades reais!",
    foto: jogadora1,
  },
  {
    nome: "Luísa Pacheco",
    idade: "",
    texto: "Adoro participar dos torneios pelo Passa a Bola. É divertido e me motiva a treinar ainda mais.",
    foto: jogadora2,
  },
  {
    nome: "Camila Nogueira",
    idade: "",
    texto: "Os desafios e recompensas da plataforma me inspiram a dar o meu melhor a cada treino!",
    foto: jogadora3,
  },
  {
    nome: "Mariana Azevedo",
    idade: "",
    texto: "Agora acompanho melhor o desenvolvimento da minha filha. O Passa a Bola facilita a vida dos pais e ajuda a manter tudo organizado.",
    foto: mae1,
  },
  {
    nome: "Carla Almeida",
    idade: "",
    texto: "Com a plataforma consigo conhecer novas jogadoras e acompanhar talentos emergentes de forma rápida e prática.",
    foto: treinadora1,
  },
];

const Carrossel = () => {
  const [index, setIndex] = useState(0);

  // Muda o depoimento a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % depoimentos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-[#F06292] text-white text-center">
      <h2 className="text-4xl font-bold mb-12">O que elas dizem</h2>

      <div className="max-w-3xl mx-auto p-6 bg-white text-[#333333] rounded-2xl shadow-2xl transition transform hover:scale-105">
        <img
          src={depoimentos[index].foto}
          alt={depoimentos[index].nome}
          className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
        />
        <p className="italic text-lg mb-4">"{depoimentos[index].texto}"</p>
        <p className="font-bold text-[#0A192F]">
          {depoimentos[index].nome}
          {depoimentos[index].idade ? `, ${depoimentos[index].idade}` : ""}
        </p>
      </div>

      {/* Pontinhos do carrossel */}
      <div className="flex justify-center mt-6 gap-2">
        {depoimentos.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full transition ${
              i === index ? "bg-white" : "bg-[#E8E8E8]"
            }`}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default Carrossel;
