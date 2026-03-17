import { Thermometer, TrendingUp, TrendingDown } from "lucide-react";

interface TemperatureHeroProps {
  currentTemp: number;
  minTemp: number;
  maxTemp: number;
  lastUpdated: string;
  trend: "up" | "down" | "stable";
}

const TemperatureHero = ({
  currentTemp,
  minTemp,
  maxTemp,
  lastUpdated,
  trend,
}: TemperatureHeroProps) => {
  const getTrendColor = () => {
    if (currentTemp > 30) return "text-status-warning";
    if (currentTemp > 35) return "text-status-offline";
    return "text-primary";
  };

  return (
    <div className="bg-card border border-border rounded p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Thermometer size={18} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Temperatura Atual
          </h3>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          {lastUpdated}
        </span>
      </div>

      <div className="flex items-end gap-2 mb-6">
        <span className={`font-mono text-5xl font-bold ${getTrendColor()}`}>
          {currentTemp.toFixed(1)}
        </span>
        <span className="font-mono text-xl text-muted-foreground mb-1">°C</span>
        <div className="ml-2 mb-2">
          {trend === "up" ? (
            <TrendingUp size={20} className="text-status-warning" />
          ) : trend === "down" ? (
            <TrendingDown size={20} className="text-primary" />
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 rounded p-3">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
            Mínima (24h)
          </p>
          <p className="font-mono text-lg font-semibold text-primary">
            {minTemp.toFixed(1)}°C
          </p>
        </div>
        <div className="bg-muted/50 rounded p-3">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
            Máxima (24h)
          </p>
          <p className="font-mono text-lg font-semibold text-status-warning">
            {maxTemp.toFixed(1)}°C
          </p>
        </div>
      </div>
    </div>
  );
};

export default TemperatureHero;
