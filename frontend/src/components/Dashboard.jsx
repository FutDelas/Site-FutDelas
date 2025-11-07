import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function DashboardTemperaturaCorporal() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula os dados de temperatura corporal durante 90 min de jogo
    const simulatedData = Array.from({ length: 19 }, (_, i) => {
      const tempo = i * 5;
      let temperaturaBase = 36.5 + Math.sin(i / 2) * 1.5 + i * 0.05;
      if (temperaturaBase > 39) temperaturaBase = 39;
      if (i > 15) temperaturaBase -= 0.3;

      return {
        id: i + 1,
        minuto: `${tempo}'`,
        temperatura: parseFloat(temperaturaBase.toFixed(1)),
      };
    });

    // Simula carregamento
    setTimeout(() => {
      setData(simulatedData);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 w-full mx-auto mt-6">
      {loading ? (
        <p className="text-center text-gray-500">Carregando dados da partida...</p>
      ) : (
        <>
       

          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="minuto" />
                <YAxis domain={[36, 40]} tickFormatter={(v) => `${v}°`} />
                <Tooltip formatter={(value) => [`${value} °C`, "Temperatura"]} />
                <Line
                  type="monotone"
                  dataKey="temperatura"
                  stroke="#F06292"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          
        </>
      )}
    </div>
  );
}
