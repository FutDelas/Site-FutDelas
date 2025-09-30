import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import medalha from "../assets/medalha.png";

export default function Recompensas() {
  const navigate = useNavigate();
  const [pontos, setPontos] = useState(0);

  // Verifica se usuário está logado
  useEffect(() => {
    const user = localStorage.getItem("usuarioLogado");
    if (!user) {
      alert("Você precisa fazer login para acessar as recompensas!");
      navigate("/login");
    }
  }, [navigate]);

  // ---------------- QUIZ 1 ----------------
  const perguntasQuiz1 = [
    { pergunta: "Quem é considerada a maior jogadora da história do futebol feminino brasileiro?", resposta: "marta" },
    { pergunta: "Qual seleção venceu a Copa do Mundo Feminina de 2019?", resposta: "estados unidos" },
  ];
  const pontosQuiz1 = 50;

  const [respostasQuiz1, setRespostasQuiz1] = useState(Array(perguntasQuiz1.length).fill(""));
  const [quiz1Concluido, setQuiz1Concluido] = useState(false);

  const verificarQuiz1 = () => {
    let acertos = 0;
    respostasQuiz1.forEach((resp, i) => {
      if (resp.toLowerCase().trim() === perguntasQuiz1[i].resposta) acertos++;
    });

    const pontosGanhos = Math.round((pontosQuiz1 / perguntasQuiz1.length) * acertos);
    setPontos((prev) => prev + pontosGanhos);
    alert(`Você acertou ${acertos} de ${perguntasQuiz1.length} e ganhou ${pontosGanhos} pontos 🏆`);
    setQuiz1Concluido(true);
  };

  // ---------------- QUIZ 2 ----------------
  const perguntasQuiz2 = [
    { pergunta: "Em que ano aconteceu a primeira Copa do Mundo de Futebol Feminino?", resposta: "1991" },
    { pergunta: "Quem fez o gol mais rápido da história da Copa do Mundo Feminina (2023)?", resposta: "linda caicedo" },
    { pergunta: "Qual país sediou a primeira Copa do Mundo Feminina?", resposta: "china" },
  ];
  const pontosQuiz2 = 75;

  const [respostasQuiz2, setRespostasQuiz2] = useState(Array(perguntasQuiz2.length).fill(""));
  const [quiz2Concluido, setQuiz2Concluido] = useState(false);

  const verificarQuiz2 = () => {
    let acertos = 0;
    respostasQuiz2.forEach((resp, i) => {
      if (resp.toLowerCase().trim() === perguntasQuiz2[i].resposta) acertos++;
    });

    const pontosGanhos = Math.round((pontosQuiz2 / perguntasQuiz2.length) * acertos);
    setPontos((prev) => prev + pontosGanhos);
    alert(`Você acertou ${acertos} de ${perguntasQuiz2.length} e ganhou ${pontosGanhos} pontos ⚽`);
    setQuiz2Concluido(true);
  };

  return (
    <div className="min-h-screen bg-[#0A192F] flex justify-center items-center py-10">

      <div className="bg-[#FAD1DF] shadow-2xl rounded-2xl p-8 w-full max-w-2xl flex flex-col items-center">
        
        <h1 className="text-3xl font-bold mb-6 text-[#0A192F]">Recompensas</h1>
        
        <img src={medalha} alt="medalha" className="w-16 h-16 mb-6" />
        
        <p className="mb-6 text-lg text-[#0A192F]">Seus pontos: <strong>{pontos}</strong></p>

        {/* QUIZ 1 */}
        <div className="bg-white shadow-md p-6 rounded-xl w-full mb-6">
          <h2 className="text-xl font-semibold mb-4 text-[#0A192F]">Quiz 1 - (50 pontos)</h2>
          {perguntasQuiz1.map((q, i) => (
            <div key={i} className="mb-4">
              <p className="text-[#0A192F]">{q.pergunta}</p>
              <input
                type="text"
                value={respostasQuiz1[i]}
                onChange={(e) => {
                  const novasRespostas = [...respostasQuiz1];
                  novasRespostas[i] = e.target.value;
                  setRespostasQuiz1(novasRespostas);
                }}
                className="border p-2 w-full rounded focus:outline-[#F06292]"
                disabled={quiz1Concluido}
              />
            </div>
          ))}
          <button
            onClick={verificarQuiz1}
            disabled={quiz1Concluido}
            className={`px-4 py-2 rounded text-white ${
              quiz1Concluido ? "bg-gray-400" : "bg-[#F06292] hover:bg-[#E65A7F]"
            }`}
          >
            Finalizar Quiz
          </button>
        </div>

        {/* QUIZ 2 */}
        <div className="bg-white shadow-md p-6 rounded-xl w-full mb-6">
          <h2 className="text-xl font-semibold mb-4 text-[#0A192F]">Quiz 2 - (75 pontos)</h2>
          {perguntasQuiz2.map((q, i) => (
            <div key={i} className="mb-4">
              <p className="text-[#0A192F]">{q.pergunta}</p>
              <input
                type="text"
                value={respostasQuiz2[i]}
                onChange={(e) => {
                  const novasRespostas = [...respostasQuiz2];
                  novasRespostas[i] = e.target.value;
                  setRespostasQuiz2(novasRespostas);
                }}
                className="border p-2 w-full rounded focus:outline-[#F06292]"
                disabled={quiz2Concluido}
              />
            </div>
          ))}
          <button
            onClick={verificarQuiz2}
            disabled={quiz2Concluido}
            className={`px-4 py-2 rounded text-white ${
              quiz2Concluido ? "bg-gray-400" : "bg-[#F06292] hover:bg-[#E65A7F]"
            }`}
          >
            Finalizar Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
