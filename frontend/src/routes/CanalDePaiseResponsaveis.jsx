// CanalDosPais.jsx
import { useForm } from "react-hook-form";

const CanalDosPais = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log("Formulário enviado:", data);
    alert("Mensagem enviada com sucesso!");
    reset();
  };

  return (
    <div className="min-h-screen bg-[#FAD1DF]">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#0A192F] pt-6">
        Canal dos Pais e Responsáveis
      </h1>
      <div className="m-10 mt">
        {/* Seção Saúde Física e Emocional */}
        <section className="bg-white border-2 border-[#F06292] rounded-2xl p-6 mb-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-[#0A192F] mb-3">
            Cuidados com a Saúde Física e Emocional
          </h2>
          <p className="text-[#0A192F]">
            Incentivar hábitos saudáveis, boa alimentação e acompanhamento médico
            regular são fundamentais. Além disso, oferecer apoio emocional,
            escutando e respeitando os sentimentos dos jovens atletas, contribui
            para seu desenvolvimento equilibrado.
          </p>
        </section>

        {/* Seção Fair Play */}
        <section className="bg-white border-2 border-[#F06292] rounded-2xl p-6 mb-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-[#0A192F] mb-3">
            Orientações sobre Fair Play
          </h2>
          <ul className="list-disc list-inside text-[#0A192F] space-y-2">
            <li>Respeitar árbitros, técnicos, colegas e adversários.</li>
            <li>Evitar atitudes negativas, como xingamentos ou discussões.</li>
            <li>Valorizar o esforço mais do que apenas o resultado.</li>
            <li>Ser exemplo de incentivo e positividade nas arquibancadas.</li>
          </ul>
        </section>

        {/* Seção FAQ */}
        <section className="bg-white border-2 border-[#F06292] rounded-2xl p-6 mb-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-[#0A192F] mb-3">
            FAQ - Dúvidas Frequentes
          </h2>
          <div className="space-y-4">
            <details className="border border-[#F06292] rounded-lg p-3 bg-[#FDF6F8]">
              <summary className="cursor-pointer font-semibold text-[#0A192F]">
                Como avisar sobre a ausência do meu filho(a)?
              </summary>
              <p className="text-[#0A192F] mt-2">
                Basta preencher o formulário abaixo ou entrar em contato com o
                técnico responsável.
              </p>
            </details>

            <details className="border border-[#F06292] rounded-lg p-3 bg-[#FDF6F8]">
              <summary className="cursor-pointer font-semibold text-[#0A192F]">
                O que fazer em caso de lesão?
              </summary>
              <p className="text-[#0A192F] mt-2">
                Procure atendimento médico imediatamente e informe a equipe para
                orientações adequadas.
              </p>
            </details>
          </div>
        </section>

        {/* Seção Formulário */}
        <section className="bg-white border-2 border-[#F06292] rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-[#0A192F] mb-3">
            Envie suas sugestões, críticas ou avisos
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="text"
              placeholder="Seu nome"
              {...register("nome", { required: true })}
              className="w-full border border-[#F06292] rounded-lg p-2"
            />
            <input
              type="email"
              placeholder="Seu e-mail"
              {...register("email", { required: true })}
              className="w-full border border-[#F06292] rounded-lg p-2"
            />
            <textarea
              placeholder="Escreva sua mensagem..."
              {...register("mensagem", { required: true })}
              className="w-full border border-[#F06292] rounded-lg p-2"
            ></textarea>
            <button
              type="submit"
              className="bg-[#F06292] hover:bg-[#d94d7f] text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              Enviar
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default CanalDosPais;
