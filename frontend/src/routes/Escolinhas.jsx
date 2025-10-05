import { useState } from "react";

const Escolinhas = () => {
  const [pagina, setPagina] = useState(0);
  const [filtroFaixa, setFiltroFaixa] = useState("");
  const [filtroLocal, setFiltroLocal] = useState("");
  const [filtroDias, setFiltroDias] = useState("");
  const [filtroPreco, setFiltroPreco] = useState("");
  const [filtroNivel, setFiltroNivel] = useState("");

  const escolinhas = [
  { nome: "Bola de Ouro", local: "São Paulo - SP", faixa: "6 a 14 anos", dias: "Seg, Qua, Sex", preco: 100, nivel: "Iniciante" },
  { nome: "Estrelas do Futuro", local: "Rio de Janeiro - RJ", faixa: "8 a 15 anos", dias: "Ter, Qui", preco: 150, nivel: "Intermediário" },
  { nome: "Garotas em Campo", local: "Belo Horizonte - MG", faixa: "8 a 14 anos", dias: "Seg, Qua", preco: 80, nivel: "Iniciante" },
  { nome: "Chuteiras de Ouro", local: "Curitiba - PR", faixa: "7 a 16 anos", dias: "Seg, Sex", preco: 200, nivel: "Avançado" },
  { nome: "Futuro Feminino", local: "Porto Alegre - RS", faixa: "6 a 14 anos", dias: "Seg, Qua, Sex", preco: 120, nivel: "Intermediário" },
  { nome: "Academia Estrelas", local: "Fortaleza - CE", faixa: "10 a 18 anos", dias: "Ter, Qui", preco: 180, nivel: "Avançado" },
  { nome: "Meninas de Ouro", local: "Recife - PE", faixa: "7 a 14 anos", dias: "Qua, Sex", preco: 90, nivel: "Iniciante" },
  { nome: "Futebol e Amizade", local: "Salvador - BA", faixa: "8 a 15 anos", dias: "Seg, Qui", preco: 140, nivel: "Intermediário" },
  { nome: "Mulheres em Campo", local: "São Paulo - SP", faixa: "A partir de 18", dias: "Seg, Qua, Sex", preco: 150, nivel: "Iniciante" },
  { nome: "FutFem Adulto", local: "Rio de Janeiro - RJ", faixa: "A partir de 18", dias: "Ter, Qui", preco: 180, nivel: "Intermediário" },
  { nome: "Liga Feminina", local: "Belo Horizonte - MG", faixa: "A partir de 18", dias: "Seg, Qui", preco: 200, nivel: "Avançado" }
];

  // Filtro com interseção de faixa etária
  const filtradas = escolinhas.filter(e => {
    // Faixa etária
    let faixaMatch = true;
    if (filtroFaixa) {
      const idadesEscolinha = e.faixa.match(/\d+/g).map(Number); // [min, max]
      const minEscolinha = idadesEscolinha[0];
      const maxEscolinha = idadesEscolinha[1] || idadesEscolinha[0];

      let minFiltro, maxFiltro;
      if (filtroFaixa === "6-12") { minFiltro = 6; maxFiltro = 12; }
      if (filtroFaixa === "13-18") { minFiltro = 13; maxFiltro = 18; }
      if (filtroFaixa === "+18") { minFiltro = 18; maxFiltro = Infinity; }

      faixaMatch = !(maxEscolinha < minFiltro || minEscolinha > maxFiltro);
    }

    // Preço
    let precoMatch = true;
    if (filtroPreco) {
      if (filtroPreco === "50-100") precoMatch = e.preco >= 50 && e.preco <= 100;
      if (filtroPreco === "100-150") precoMatch = e.preco > 100 && e.preco <= 150;
      if (filtroPreco === "150-200") precoMatch = e.preco > 150 && e.preco <= 200;
    }

    return faixaMatch &&
           (!filtroLocal || e.local.includes(filtroLocal)) &&
           (!filtroDias || e.dias.includes(filtroDias)) &&
           precoMatch &&
           (!filtroNivel || e.nivel === filtroNivel);
  });

  const cardsPorPagina = 4;
  const totalPaginas = Math.ceil(filtradas.length / cardsPorPagina);
  const mostrarEscolinhas = filtradas.slice(pagina * cardsPorPagina, (pagina + 1) * cardsPorPagina);

  return (
    <div className="min-h-screen py-12 px-6" style={{ backgroundColor: "#F0F4F8" }}>
      <h1 className="text-4xl font-bold mb-6 text-center text-[#F06292]">
        Escolinhas de Futebol
      </h1>

      <div className="flex gap-6 max-w-6xl mx-auto">
        {/* Filtros */}
        <div className="w-1/4 space-y-4 p-4 bg-white rounded-2xl shadow-md shadow-pink-100 sticky top-4 h-fit">
          <h2 className="font-bold text-xl mb-2 text-[#003B5C]">Filtros</h2>

          <select value={filtroFaixa} onChange={e => { setFiltroFaixa(e.target.value); setPagina(0); }} className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F06292]">
            <option value="">Faixa Etária</option>
            <option value="6-12">6 - 12 anos</option>
            <option value="13-18">13 - 18 anos</option>
            <option value="+18">+18 anos</option>
          </select>

          <select value={filtroLocal} onChange={e => { setFiltroLocal(e.target.value); setPagina(0); }} className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F06292]">
            <option value="">Localização</option>
            <option value="SP">São Paulo</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="MG">Minas Gerais</option>
            <option value="PR">Paraná</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="CE">Ceará</option>
            <option value="PE">Pernambuco</option>
            <option value="BA">Bahia</option>
          </select>

          <select value={filtroDias} onChange={e => { setFiltroDias(e.target.value); setPagina(0); }} className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F06292]">
            <option value="">Dias de treino</option>
            <option value="Seg">Segunda</option>
            <option value="Ter">Terça</option>
            <option value="Qua">Quarta</option>
            <option value="Qui">Quinta</option>
            <option value="Sex">Sexta</option>
          </select>

          <select value={filtroPreco} onChange={e => { setFiltroPreco(e.target.value); setPagina(0); }} className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F06292]">
            <option value="">Preço</option>
            <option value="50-100">R$50 - R$100</option>
            <option value="100-150">R$100 - R$150</option>
            <option value="150-200">R$150 - R$200</option>
          </select>

          <select value={filtroNivel} onChange={e => { setFiltroNivel(e.target.value); setPagina(0); }} className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F06292]">
            <option value="">Nível</option>
            <option value="Iniciante">Iniciante</option>
            <option value="Intermediário">Intermediário</option>
            <option value="Avançado">Avançado</option>
          </select>
        </div>

        {/* Cards */}
        <div className="w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {mostrarEscolinhas.map((e, i) => (
            <div key={i} className="p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:scale-105" style={{ backgroundColor: "#FFFFFF", borderLeft: "4px solid #F06292" }}>
              <h3 className="font-bold text-xl mb-2 text-[#003B5C]">{e.nome}</h3>
              <p><strong>Local:</strong> {e.local}</p>
              <p><strong>Faixa etária:</strong> {e.faixa}</p>
              <p><strong>Dias de treino:</strong> {e.dias}</p>
              <p><strong>Preço:</strong> R${e.preco}</p>
              <p><strong>Nível:</strong> {e.nivel}</p>
              <button 
                className="cursor-pointer mt-2 py-2 px-4 bg-gradient-to-r from-[#F06292] to-[#E65A7F] text-white rounded-full hover:from-[#E65A7F] hover:to-[#F06292] transition transform hover:scale-105 cursor-pointer">
                Quero saber mais
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Navegação */}
      <div className="flex justify-center mt-6 gap-4">
        <button disabled={pagina===0} onClick={() => setPagina(pagina-1)} className="cursor-pointer py-2 px-4 bg-[#F06292] text-white rounded-full disabled:opacity-50 hover:bg-[#E65A7F] transition">Anterior</button>
        <button disabled={pagina+1>=totalPaginas} onClick={() => setPagina(pagina+1)} className="cursor-pointer py-2 px-4 bg-[#F06292] text-white rounded-full disabled:opacity-50 hover:bg-[#E65A7F] transition">Próximo</button>
      </div>
    </div>
  );
};

export default Escolinhas;
