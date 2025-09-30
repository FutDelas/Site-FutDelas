import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-800 flex items-center justify-center relative overflow-hidden">
      {/* Fundo com gradiente radial escuro */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#001449,_#061013)] opacity-90"></div>

      {/* Conteúdo central */}
       <div className="relative z-10 rounded-lg drop-shadow-lg text-center px-8" style={{ backgroundColor: "#14001dff" }}>
          <div className="rounded-lg p-8 shadow-lg">
            <h1 className="text-6xl font-extrabold text-white drop-shadow-lg">
            404
            </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mt-4">
          Página não encontrada
        </h2>
        <p className="text-gray-200 mt-2">
          Está página não existe.
        </p>

        <button
          onClick={() => navigate("/")}
          className="cursor-pointer mt-6 w-full md:w-auto bg-yellow-500 text-black font-bold py-3 px-6 rounded-full hover:bg-pink-800 transition transform hover:scale-105"
        >
          🏟️ Voltar para o início
        </button>
      </div>
    </div>

      </div>
  );
};

export default Error;
