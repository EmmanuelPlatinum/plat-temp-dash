import { Cpu, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const specs = [
  { label: "Microcontrolador", value: "ESP32-WROOM-32" },
  { label: "Sensor", value: "NTC Thermistor (10kΩ)" },
  { label: "ADC", value: "12-bit SAR ADC" },
  { label: "GPIO de Leitura", value: "GPIO 34 (ADC1_CH6)" },
  { label: "Tensão de Referência", value: "3.3V" },
  { label: "Resolução ADC", value: "0 – 4095" },
  { label: "Protocolo", value: "Wi-Fi 802.11 b/g/n" },
  { label: "Clock", value: "240 MHz Dual-Core" },
];

const HardwareCard = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-card border border-border rounded p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Cpu size={18} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Hardware — ESP32
          </h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Info size={12} />
          Detalhes
          {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* ESP32 Schematic Diagram */}
      <div className="bg-muted/30 border border-border rounded p-4 mb-4">
        <svg viewBox="0 0 320 180" className="w-full" xmlns="http://www.w3.org/2000/svg">
          {/* Board */}
          <rect x="60" y="20" width="200" height="140" rx="4" fill="hsl(222 47% 11%)" stroke="hsl(199 89% 48%)" strokeWidth="1.5" />
          
          {/* Chip */}
          <rect x="110" y="50" width="100" height="80" rx="2" fill="hsl(217 33% 17%)" stroke="hsl(215 16% 47%)" strokeWidth="1" />
          <text x="160" y="85" textAnchor="middle" fill="hsl(199 89% 48%)" fontSize="8" fontFamily="JetBrains Mono" fontWeight="600">ESP32</text>
          <text x="160" y="97" textAnchor="middle" fill="hsl(215 16% 47%)" fontSize="6" fontFamily="JetBrains Mono">WROOM-32</text>
          <text x="160" y="118" textAnchor="middle" fill="hsl(215 16% 47%)" fontSize="5" fontFamily="JetBrains Mono">Dual-Core 240MHz</text>
          
          {/* GPIO Pins - Left */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <g key={`l${i}`}>
              <rect x="50" y={30 + i * 16} width="14" height="6" rx="1" fill={i === 5 ? "hsl(199 89% 48%)" : "hsl(215 16% 47%)"} />
              <text x="46" y={35 + i * 16} textAnchor="end" fill="hsl(215 16% 47%)" fontSize="4" fontFamily="JetBrains Mono">
                {i === 5 ? "GPIO34" : `G${i * 2}`}
              </text>
            </g>
          ))}
          
          {/* GPIO Pins - Right */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <g key={`r${i}`}>
              <rect x="256" y={30 + i * 16} width="14" height="6" rx="1" fill="hsl(215 16% 47%)" />
            </g>
          ))}
          
          {/* Antenna */}
          <rect x="140" y="20" width="40" height="15" rx="2" fill="none" stroke="hsl(199 89% 48%)" strokeWidth="0.8" strokeDasharray="2 1" />
          <text x="160" y="30" textAnchor="middle" fill="hsl(199 89% 48%)" fontSize="4" fontFamily="JetBrains Mono">ANT</text>
          
          {/* USB */}
          <rect x="145" y="152" width="30" height="12" rx="1.5" fill="hsl(215 16% 47%)" />
          <text x="160" y="160" textAnchor="middle" fill="hsl(222 47% 11%)" fontSize="4" fontFamily="JetBrains Mono" fontWeight="600">USB</text>
          
          {/* Label for ADC pin */}
          <line x1="46" y1={113} x2="20" y2={113} stroke="hsl(199 89% 48%)" strokeWidth="0.5" strokeDasharray="2 1" />
          <text x="18" y={110} textAnchor="end" fill="hsl(199 89% 48%)" fontSize="4" fontFamily="JetBrains Mono">ADC1_CH6</text>
          <text x="18" y={116} textAnchor="end" fill="hsl(38 92% 50%)" fontSize="3.5" fontFamily="JetBrains Mono">SENSOR IN</text>
        </svg>
      </div>

      {/* Technical Details */}
      {showDetails && (
        <div className="space-y-1.5">
          {specs.map((spec) => (
            <div key={spec.label} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
              <span className="text-xs text-muted-foreground">{spec.label}</span>
              <span className="text-xs font-mono font-medium text-foreground">
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HardwareCard;
