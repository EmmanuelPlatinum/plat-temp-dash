import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import ConnectivityHeader from "@/components/dashboard/ConnectivityHeader";
import TemperatureHero from "@/components/dashboard/TemperatureHero";
import TemperatureChart from "@/components/dashboard/TemperatureChart";
import HardwareCard from "@/components/dashboard/HardwareCard";
import DataLog from "@/components/dashboard/DataLog";
import SerialConsole from "@/components/dashboard/SerialConsole";
import AppFooter from "@/components/shared/AppFooter";

type ConnectionType = "wifi" | "bluetooth" | "ethernet";

// Simulate 24h of temperature data
const generateChartData = () => {
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000);
    const base = 24 + Math.sin((i - 6) * 0.3) * 3;
    const noise = (Math.random() - 0.5) * 2;
    data.push({
      time: `${time.getHours().toString().padStart(2, "0")}:00`,
      temp: parseFloat((base + noise).toFixed(1)),
    });
  }
  return data;
};

const generateLogs = () => {
  const logs = [];
  const now = new Date();
  for (let i = 0; i < 30; i++) {
    const time = new Date(now.getTime() - i * 300000);
    const temp = 22 + Math.random() * 12;
    logs.push({
      id: 30 - i,
      timestamp: time.toLocaleString("pt-BR"),
      temp: parseFloat(temp.toFixed(1)),
      status: temp > 32 ? "critical" as const : temp > 28 ? "warning" as const : "normal" as const,
    });
  }
  return logs;
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeConnection, setActiveConnection] = useState<ConnectionType>("wifi");
  const [isConnected, setIsConnected] = useState(true);
  const [currentTemp, setCurrentTemp] = useState(25.3);
  const [chartData] = useState(generateChartData);
  const [logs] = useState(generateLogs);

  const temps = chartData.map((d) => d.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);

  // Simulate live temperature updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTemp((prev) => {
        const delta = (Math.random() - 0.5) * 0.4;
        return parseFloat((prev + delta).toFixed(1));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleConnectionChange = useCallback((type: ConnectionType) => {
    setIsConnected(false);
    setActiveConnection(type);
    setTimeout(() => setIsConnected(true), 1200);
  }, []);

  const trend = currentTemp > 26 ? "up" : currentTemp < 23 ? "down" : "stable";
  const lastUpdated = new Date().toLocaleTimeString("pt-BR");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="ml-60 flex-1 flex flex-col">
        <ConnectivityHeader
          activeConnection={activeConnection}
          onConnectionChange={handleConnectionChange}
          isConnected={isConnected}
        />

        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <TemperatureHero
                  currentTemp={currentTemp}
                  minTemp={minTemp}
                  maxTemp={maxTemp}
                  lastUpdated={lastUpdated}
                  trend={trend as "up" | "down" | "stable"}
                />
                <div className="lg:col-span-2">
                  <TemperatureChart data={chartData} />
                </div>
              </div>
              <DataLog logs={logs} />
            </div>
          )}

          {activeTab === "hardware" && (
            <div className="max-w-2xl">
              <HardwareCard />
            </div>
          )}

          {activeTab === "logs" && <DataLog logs={logs} />}
        </main>

        <AppFooter />
      </div>

      <SerialConsole
        currentTemp={currentTemp}
        isConnected={isConnected}
        activeConnection={activeConnection}
      />
    </div>
  );
};

export default Index;
