import { useEffect, useState } from "react";

type Phase = "idle" | "mounting" | "mounted" | "heating" | "critical";

const HeroHardwareAnimation = () => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [tempValue, setTempValue] = useState(22);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      setPhase("idle");
      setTempValue(22);

      timers.push(setTimeout(() => setPhase("mounting"), 800));
      timers.push(setTimeout(() => setPhase("mounted"), 2400));
      timers.push(setTimeout(() => setPhase("heating"), 3200));
      timers.push(setTimeout(() => {
        setPhase("critical");
      }, 4800));

      // Restart loop
      timers.push(setTimeout(() => {
        setPhase("idle");
        setTempValue(22);
        run();
      }, 8000));
    };

    run();
    return () => timers.forEach(clearTimeout);
  }, []);

  // Temperature bar animation
  useEffect(() => {
    if (phase === "heating") {
      const interval = setInterval(() => {
        setTempValue((v) => Math.min(v + 2, 55));
      }, 100);
      return () => clearInterval(interval);
    }
    if (phase === "critical") {
      const interval = setInterval(() => {
        setTempValue((v) => Math.min(v + 1, 78));
      }, 120);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const cpuY = phase === "idle" ? -40 : phase === "mounting" ? -10 : 0;
  const cpuOpacity = phase === "idle" ? 0.3 : 1;

  const armRotation =
    phase === "idle"
      ? -30
      : phase === "mounting"
      ? -10
      : 15;

  const cpuColor =
    phase === "critical"
      ? "hsl(0, 84%, 55%)"
      : phase === "heating"
      ? "hsl(25, 95%, 53%)"
      : phase === "mounted"
      ? "hsl(199, 89%, 48%)"
      : "hsl(var(--muted-foreground))";

  const glowIntensity =
    phase === "critical" ? 16 : phase === "heating" ? 10 : phase === "mounted" ? 4 : 0;

  const barHeight = Math.max(4, ((tempValue - 20) / 60) * 120);
  const barColor =
    tempValue > 60
      ? "hsl(0, 84%, 55%)"
      : tempValue > 40
      ? "hsl(25, 95%, 53%)"
      : "hsl(142, 71%, 45%)";

  return (
    <div className="flex items-center justify-center gap-6">
      <svg
        viewBox="0 0 320 200"
        className="w-full max-w-md h-auto"
        style={{ filter: "drop-shadow(0 4px 24px hsl(var(--primary) / 0.1))" }}
      >
        <defs>
          <filter id="cpuGlow">
            <feGaussianBlur stdDeviation={glowIntensity} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="boardGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(142, 40%, 30%)" />
            <stop offset="100%" stopColor="hsl(142, 35%, 22%)" />
          </linearGradient>
          <pattern id="traces" width="16" height="16" patternUnits="userSpaceOnUse">
            <path
              d="M0 8h16M8 0v16"
              stroke="hsl(142, 50%, 38%)"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>
        </defs>

        {/* Motherboard */}
        <rect
          x="60"
          y="100"
          width="200"
          height="80"
          rx="6"
          fill="url(#boardGrad)"
          stroke="hsl(142, 50%, 35%)"
          strokeWidth="1.5"
        />
        <rect x="60" y="100" width="200" height="80" rx="6" fill="url(#traces)" />

        {/* Board traces - decorative circuits */}
        <g stroke="hsl(142, 60%, 45%)" strokeWidth="1" opacity="0.5" fill="none">
          <path d="M80 130 h30 v20 h20" />
          <path d="M200 120 h30 v30" />
          <path d="M120 160 h40 v-10 h30" />
          <path d="M80 150 h15 v15" />
        </g>

        {/* Small components on board */}
        <rect x="75" y="115" width="12" height="6" rx="1" fill="hsl(215, 20%, 50%)" opacity="0.7" />
        <rect x="230" y="150" width="15" height="8" rx="1" fill="hsl(215, 20%, 50%)" opacity="0.7" />
        <circle cx="240" cy="120" r="4" fill="hsl(215, 25%, 40%)" opacity="0.6" />
        <rect x="95" y="155" width="8" height="8" rx="1" fill="hsl(0, 0%, 20%)" opacity="0.5" />

        {/* CPU Socket */}
        <rect
          x="130"
          y="115"
          width="60"
          height="50"
          rx="3"
          fill="hsl(215, 20%, 25%)"
          stroke="hsl(215, 20%, 40%)"
          strokeWidth="1"
          strokeDasharray="3 2"
        />

        {/* CPU Chip */}
        <g
          style={{
            transform: `translateY(${cpuY}px)`,
            opacity: cpuOpacity,
            transition: "transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease",
          }}
        >
          <rect
            x="135"
            y="120"
            width="50"
            height="40"
            rx="4"
            fill={cpuColor}
            filter="url(#cpuGlow)"
            style={{ transition: "fill 0.8s ease" }}
          />
          {/* CPU pins */}
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={`pin-t-${i}`}
              x={140 + i * 9}
              y="116"
              width="4"
              height="5"
              rx="0.5"
              fill="hsl(45, 80%, 55%)"
              style={{
                opacity: phase === "idle" ? 0.3 : 1,
                transition: "opacity 0.5s ease",
              }}
            />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={`pin-b-${i}`}
              x={140 + i * 9}
              y="159"
              width="4"
              height="5"
              rx="0.5"
              fill="hsl(45, 80%, 55%)"
              style={{
                opacity: phase === "idle" ? 0.3 : 1,
                transition: "opacity 0.5s ease",
              }}
            />
          ))}
          {/* CPU label */}
          <text
            x="160"
            y="143"
            textAnchor="middle"
            fontSize="7"
            fontFamily="monospace"
            fontWeight="bold"
            fill="white"
            opacity={phase === "mounted" || phase === "heating" || phase === "critical" ? 1 : 0.5}
            style={{ transition: "opacity 0.5s ease" }}
          >
            ESP32
          </text>
        </g>

        {/* Robotic Arm */}
        <g
          style={{
            transformOrigin: "160px 40px",
            transform: `rotate(${armRotation}deg)`,
            transition: "transform 1s cubic-bezier(0.34, 1.2, 0.64, 1)",
            opacity: phase === "mounted" || phase === "heating" || phase === "critical" ? 0.3 : 1,
          }}
        >
          {/* Arm base */}
          <rect x="155" y="20" width="10" height="8" rx="2" fill="hsl(215, 20%, 50%)" />
          {/* Arm segment 1 */}
          <rect x="157" y="28" width="6" height="50" rx="2" fill="hsl(215, 25%, 45%)" />
          {/* Joint */}
          <circle cx="160" cy="78" r="5" fill="hsl(215, 20%, 55%)" stroke="hsl(215, 20%, 40%)" strokeWidth="1" />
          {/* Arm segment 2 */}
          <rect x="157" y="78" width="6" height="30" rx="2" fill="hsl(215, 25%, 45%)" />
          {/* Gripper */}
          <path
            d="M152 108 l4 8 h8 l4 -8"
            fill="none"
            stroke="hsl(215, 20%, 55%)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* Thermometer */}
        <g>
          {/* Thermometer body */}
          <rect
            x="275"
            y="50"
            width="16"
            height="130"
            rx="8"
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth="1.5"
          />
          {/* Thermometer fill */}
          <rect
            x="279"
            y={176 - barHeight}
            width="8"
            height={barHeight}
            rx="4"
            fill={barColor}
            style={{ transition: "height 0.15s linear, y 0.15s linear, fill 0.4s ease" }}
          />
          {/* Thermometer bulb */}
          <circle
            cx="283"
            cy="176"
            r="5"
            fill={barColor}
            style={{ transition: "fill 0.4s ease" }}
          />
          {/* Temp label */}
          <text
            x="283"
            y="45"
            textAnchor="middle"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
            fill={barColor}
            style={{ transition: "fill 0.4s ease" }}
          >
            {tempValue}°C
          </text>
          {/* Scale marks */}
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={`mark-${i}`}>
              <line
                x1="270"
                y1={170 - i * 28}
                x2="275"
                y2={170 - i * 28}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="0.8"
                opacity="0.5"
              />
              <text
                x="267"
                y={173 - i * 28}
                textAnchor="end"
                fontSize="6"
                fontFamily="monospace"
                fill="hsl(var(--muted-foreground))"
                opacity="0.5"
              >
                {20 + i * 15}°
              </text>
            </g>
          ))}
        </g>

        {/* Status indicator */}
        <g>
          <circle
            cx="80"
            cy="60"
            r="6"
            fill={
              phase === "critical"
                ? "hsl(0, 84%, 55%)"
                : phase === "heating"
                ? "hsl(25, 95%, 53%)"
                : phase === "mounted"
                ? "hsl(142, 71%, 45%)"
                : "hsl(var(--muted-foreground))"
            }
            style={{ transition: "fill 0.6s ease" }}
          >
            {(phase === "heating" || phase === "critical") && (
              <animate
                attributeName="opacity"
                values="1;0.4;1"
                dur={phase === "critical" ? "0.5s" : "1s"}
                repeatCount="indefinite"
              />
            )}
          </circle>
          <text
            x="92"
            y="63"
            fontSize="8"
            fontFamily="monospace"
            fill="hsl(var(--foreground))"
            opacity="0.8"
          >
            {phase === "idle" && "AGUARDANDO"}
            {phase === "mounting" && "MONTANDO..."}
            {phase === "mounted" && "CPU FIXADA"}
            {phase === "heating" && "AQUECENDO ⚡"}
            {phase === "critical" && "⚠ CRÍTICO"}
          </text>
        </g>
      </svg>
    </div>
  );
};

export default HeroHardwareAnimation;
