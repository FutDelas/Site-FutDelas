import { useEffect, useState } from "react";

const Administrador = () => {
  const [eventos, setEventos] = useState([]);
  const [novoEvento, setNovoEvento] = useState({ titulo: "", data: "", local: "" });

  // Pegar eventos do backend
  const fetchEventos = () => {
    fetch("http://localhost:3001/eventos")
      .then((res) => res.json())
      .then((data) => setEventos(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  // Adicionar evento no backend
  const handleAdicionarEvento = async () => {
    if (!novoEvento.titulo || !novoEvento.data || !novoEvento.local) return alert("Preencha todos os campos");

    try {
      const res = await fetch("http://localhost:3001/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoEvento),
      });
      if (res.ok) {
        fetchEventos();
        setNovoEvento({ titulo: "", data: "", local: "" });
      } else {
        alert("Erro ao adicionar evento");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor");
    }
  };

  // Deletar evento
  const handleDeletarEvento = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/eventos/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEventos(eventos.filter((e) => e.id !== id));
      } else {
        alert("Não foi possível deletar o evento");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor");
    }
  };

  // Paleta mais discreta
  const cores = ["#FFB6C1", "#A0C4FF", "#CDA4FF"]; // rosa, azul e roxo suaves

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#003B5C", marginBottom: "20px" }}>Área do Administrador - FutDelas</h1>

      {/* Formulário de novo evento */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "30px",
          boxShadow: "0px 2px 6px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ color: "#003B5C", marginBottom: "10px" }}>Adicionar Novo Evento</h2>
        <input
          style={{ marginRight: "10px", padding: "8px", borderRadius: "6px", border: "1px solid #003B5C" }}
          type="text"
          placeholder="Título"
          value={novoEvento.titulo}
          onChange={(e) => setNovoEvento({ ...novoEvento, titulo: e.target.value })}
        />
        <input
          style={{ marginRight: "10px", padding: "8px", borderRadius: "6px", border: "1px solid #003B5C" }}
          type="date"
          value={novoEvento.data}
          onChange={(e) => setNovoEvento({ ...novoEvento, data: e.target.value })}
        />
        <input
          style={{ marginRight: "10px", padding: "8px", borderRadius: "6px", border: "1px solid #003B5C" }}
          type="text"
          placeholder="Local"
          value={novoEvento.local}
          onChange={(e) => setNovoEvento({ ...novoEvento, local: e.target.value })}
        />
        <button
          onClick={handleAdicionarEvento}
          style={{
            backgroundColor: "#FFB6C1",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: "bold",
            color: "#003B5C"
          }}
        >
          Adicionar
        </button>
      </div>

      {/* Lista de eventos */}
      <div style={{ display: "grid", gap: "20px" }}>
        {eventos.map((evento, index) => (
          <div
            key={evento.id}
            style={{
              backgroundColor: "#FFFFFF",
              borderLeft: `6px solid ${cores[index % cores.length]}`,
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
              position: "relative"
            }}
          >
            <h3 style={{ marginBottom: "8px", color: "#003B5C" }}>{evento.titulo}</h3>
            <p>
              <strong>Data:</strong> {evento.data || "Não definido"}
            </p>
            <p>
              <strong>Local:</strong> {evento.local || "Não definido"}
            </p>
            <p>
              <strong>Inscritos:</strong> {evento.inscritos ? evento.inscritos.length : 0}
            </p>

            <button
              onClick={() => handleDeletarEvento(evento.id)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                backgroundColor: "#CDA4FF",
                color: "#003B5C",
                border: "none",
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Deletar
            </button>

            {/* Placeholder para futuras funções */}
            <div style={{ marginTop: "10px" }}>
              <button
                style={{
                  marginRight: "10px",
                  backgroundColor: "#A0C4FF",
                  color: "#003B5C",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  cursor: "pointer"
                }}
              >
                Editar
              </button>
              <button
                style={{
                  backgroundColor: "#FFB6C1",
                  color: "#003B5C",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  cursor: "pointer"
                }}
              >
                Visualizar Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Administrador;
