import { useState, useEffect, useRef } from "react";
import { Terminal, X, Minimize2, Maximize2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SerialConsoleProps {
  currentTemp: number;
  isConnected: boolean;
  activeConnection: string;
}

interface ConsoleLine {
  id: number;
  text: string;
  type: "sys" | "data" | "warn" | "err";
}

const SerialConsole = ({ currentTemp, isConnected, activeConnection }: SerialConsoleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lines, setLines] = useState<ConsoleLine[]>([]);
  const lineId = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Boot sequence on open
  useEffect(() => {
    if (!isOpen) return;
    const bootLines: Omit<ConsoleLine, "id">[] = [
      { text: "[SYS] ESP32 Serial Monitor v1.0", type: "sys" },
      { text: "[SYS] Inicializando UART... OK", type: "sys" },
      { text: `[SYS] CONECTADO VIA ${activeConnection.toUpperCase()}...`, type: "sys" },
      { text: "[SYS] Sensor NTC GPIO34 (ADC1_CH6) ativo", type: "sys" },
      { text: "[SYS] Transmissão de dados iniciada", type: "sys" },
      { text: "─".repeat(48), type: "sys" },
    ];
    setLines([]);
    bootLines.forEach((line, i) => {
      setTimeout(() => {
        setLines((prev) => [...prev, { ...line, id: ++lineId.current }]);
      }, i * 200);
    });
  }, [isOpen, activeConnection]);

  // Stream data lines synced with currentTemp
  useEffect(() => {
    if (!isOpen) return;
    const timeout = setTimeout(() => {
      const now = new Date();
      const timestamp = now.toLocaleTimeString("pt-BR");
      const pin = "GPIO34";
      const adc = Math.round(((currentTemp - 10) / 50) * 4095);
      const status = currentTemp > 35 ? "CRITICAL" : currentTemp > 30 ? "WARNING" : "OK";

      const json = JSON.stringify({ timestamp, temp: currentTemp, pin, adc, status });

      const type: ConsoleLine["type"] =
        currentTemp > 35 ? "err" : currentTemp > 30 ? "warn" : "data";

      setLines((prev) => {
        const next = [...prev, { id: ++lineId.current, text: `[DATA] ${json}`, type }];
        // Keep last 200 lines
        return next.length > 200 ? next.slice(-200) : next;
      });
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isOpen, currentTemp]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const getLineColor = (type: ConsoleLine["type"]) => {
    switch (type) {
      case "sys": return "text-[hsl(199,89%,48%)]";
      case "data": return "text-[hsl(142,71%,45%)]";
      case "warn": return "text-[hsl(38,92%,50%)]";
      case "err": return "text-[hsl(0,84%,60%)]";
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg bg-[hsl(222,47%,11%)] text-[hsl(142,71%,45%)] border border-[hsl(217,33%,22%)] text-xs font-mono font-semibold hover:border-[hsl(199,89%,48%)] transition-colors shadow-lg"
        title="Serial Console"
      >
        <Terminal size={14} />
        {">_"}
      </button>
    );
  }

  return (
    <div
      className={`fixed z-50 bg-[hsl(222,55%,8%)] border border-[hsl(217,33%,22%)] rounded-t-lg shadow-2xl transition-all ${
        isExpanded
          ? "inset-x-0 bottom-0 mx-60 h-[60vh]"
          : "right-4 bottom-0 w-[500px] h-72"
      }`}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[hsl(217,33%,22%)] bg-[hsl(222,47%,11%)] rounded-t-lg">
        <div className="flex items-center gap-2">
          <Terminal size={13} className="text-[hsl(142,71%,45%)]" />
          <span className="text-xs font-mono font-semibold text-[hsl(210,40%,96%)]">
            Serial Console
          </span>
          <span className="text-[10px] font-mono text-[hsl(215,20%,60%)]">
            — {activeConnection.toUpperCase()} {isConnected ? "●" : "○"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-[hsl(217,33%,22%)] text-[hsl(215,20%,60%)] hover:text-[hsl(210,40%,96%)] transition-colors"
          >
            {isExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
          <button
            onClick={() => { setIsOpen(false); setLines([]); }}
            className="p-1 rounded hover:bg-[hsl(0,84%,60%)/20] text-[hsl(215,20%,60%)] hover:text-[hsl(0,84%,60%)] transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Console output */}
      <ScrollArea className="h-[calc(100%-36px)]">
        <div className="p-3 space-y-0.5">
          {lines.map((line) => (
            <div
              key={line.id}
              className={`text-[11px] font-mono leading-relaxed ${getLineColor(line.type)}`}
            >
              {line.text}
            </div>
          ))}
          <div ref={bottomRef} />
          {lines.length > 0 && (
            <span className="text-[11px] font-mono text-[hsl(142,71%,45%)] animate-pulse">▋</span>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SerialConsole;
