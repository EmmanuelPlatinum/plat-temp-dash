import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface DataPoint {
  time: string;
  temp: number;
}

interface TemperatureChartProps {
  data: DataPoint[];
}

const TemperatureChart = ({ data }: TemperatureChartProps) => {
  return (
    <div className="bg-card border border-border rounded p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          Variação Térmica — 24h
        </h3>
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
          Sala de Aula
        </span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fontFamily: "JetBrains Mono", fill: "hsl(215 16% 47%)" }}
              tickLine={false}
              axisLine={{ stroke: "hsl(214 32% 91%)" }}
            />
            <YAxis
              domain={[18, 40]}
              tick={{ fontSize: 10, fontFamily: "JetBrains Mono", fill: "hsl(215 16% 47%)" }}
              tickLine={false}
              axisLine={{ stroke: "hsl(214 32% 91%)" }}
              unit="°"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222 47% 11%)",
                border: "none",
                borderRadius: "4px",
                fontFamily: "JetBrains Mono",
                fontSize: "12px",
                color: "white",
              }}
              formatter={(value: number) => [`${value.toFixed(1)}°C`, "Temp"]}
              labelStyle={{ color: "hsl(199 89% 48%)" }}
            />
            <ReferenceLine
              y={30}
              stroke="hsl(38 92% 50%)"
              strokeDasharray="6 3"
              label={{
                value: "Alerta",
                position: "right",
                style: { fontSize: 10, fontFamily: "JetBrains Mono", fill: "hsl(38 92% 50%)" },
              }}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="hsl(199 89% 48%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "hsl(199 89% 48%)" }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemperatureChart;
