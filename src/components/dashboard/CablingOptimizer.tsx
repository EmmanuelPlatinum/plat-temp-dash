import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Network, Info, Plus, Calculator, Trash2, Eraser } from "lucide-react";

interface Point {
  id: number;
  x: number;
  y: number;
}

interface RouteResult {
  path: number[];
  totalDist: number;
  longestFrom: number;
  longestTo: number;
  longestDist: number;
}

type AppState = "empty" | "creating" | "active" | "calculating" | "calculated";

const dist = (a: Point, b: Point) =>
  Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

const solveRoute = (points: Point[]): RouteResult => {
  if (points.length < 2) return { path: [], totalDist: 0, longestFrom: 0, longestTo: 0, longestDist: 0 };

  // Find the two most distant points
  let maxD = 0, startIdx = 0, endIdx = 1;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const d = dist(points[i], points[j]);
      if (d > maxD) { maxD = d; startIdx = i; endIdx = j; }
    }
  }

  // Nearest-neighbor TSP from startIdx to endIdx
  const visited = new Set<number>([startIdx]);
  const path = [startIdx];
  let current = startIdx;

  while (visited.size < points.length - 1) {
    let nearest = -1, nearDist = Infinity;
    for (let i = 0; i < points.length; i++) {
      if (!visited.has(i) && i !== endIdx) {
        const d = dist(points[current], points[i]);
        if (d < nearDist) { nearDist = d; nearest = i; }
      }
    }
    if (nearest === -1) break;
    visited.add(nearest);
    path.push(nearest);
    current = nearest;
  }
  path.push(endIdx);

  let totalDist = 0;
  for (let i = 0; i < path.length - 1; i++) {
    totalDist += dist(points[path[i]], points[path[i + 1]]);
  }

  return { path, totalDist, longestFrom: startIdx, longestTo: endIdx, longestDist: maxD };
};

const CablingOptimizer = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [state, setState] = useState<AppState>("empty");
  const [result, setResult] = useState<RouteResult | null>(null);
  const [animatedSegments, setAnimatedSegments] = useState<number>(0);
  const [statusText, setStatusText] = useState("Aguardando criação de pontos...");
  const [nextId, setNextId] = useState(1);

  // Zoom & pan
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 100, h: 60 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, vx: 0, vy: 0 });

  // Drag point
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const animRef = useRef<number | null>(null);

  const svgCoords = useCallback((e: React.MouseEvent | MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const x = viewBox.x + ((e.clientX - rect.left) / rect.width) * viewBox.w;
    const y = viewBox.y + ((e.clientY - rect.top) / rect.height) * viewBox.h;
    return { x, y };
  }, [viewBox]);

  // Place point
  const handleCanvasClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (state !== "creating" && state !== "active") return;
    if (dragIdx !== null) return;
    const { x, y } = svgCoords(e);
    if (x < 1 || x > 99 || y < 1 || y > 59) return;

    setPoints(prev => [...prev, { id: nextId, x, y }]);
    setNextId(prev => prev + 1);
    if (state === "creating") setState("active");
    setStatusText("Pontos colocados. Pronto para calcular.");
  }, [state, dragIdx, svgCoords, nextId]);

  // Drag
  const handlePointDown = useCallback((e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    e.preventDefault();
    setDragIdx(idx);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (dragIdx !== null) {
      const { x, y } = svgCoords(e);
      setPoints(prev => prev.map((p, i) => i === dragIdx ? { ...p, x: Math.max(1, Math.min(99, x)), y: Math.max(1, Math.min(59, y)) } : p));
      // Recalculate if in calculated state
      if (state === "calculated" && points.length >= 2) {
        const updated = points.map((p, i) => i === dragIdx ? { ...p, x: Math.max(1, Math.min(99, x)), y: Math.max(1, Math.min(59, y)) } : p);
        const r = solveRoute(updated);
        setResult(r);
      }
    } else if (isPanning) {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const dx = ((e.clientX - panStart.x) / rect.width) * viewBox.w;
      const dy = ((e.clientY - panStart.y) / rect.height) * viewBox.h;
      setViewBox(prev => ({ ...prev, x: panStart.vx - dx, y: panStart.vy - dy }));
    }
  }, [dragIdx, isPanning, svgCoords, panStart, viewBox, state, points]);

  const handleMouseUp = useCallback(() => {
    if (dragIdx !== null) {
      // Final recalc
      if (state === "calculated" && points.length >= 2) {
        setResult(solveRoute(points));
      }
      setDragIdx(null);
    }
    setIsPanning(false);
  }, [dragIdx, state, points]);

  // Pan via middle-click or background drag when not in create mode
  const handleBgDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (dragIdx !== null) return;
    // Right-click or middle-click for pan, or if not in create mode
    if (e.button === 1 || (state !== "creating" && state !== "active" && e.button === 0)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY, vx: viewBox.x, vy: viewBox.y });
    }
  }, [viewBox, state, dragIdx]);

  // Zoom
  const handleWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    const factor = e.deltaY > 0 ? 1.1 : 0.9;

    setViewBox(prev => {
      const nw = Math.max(20, Math.min(200, prev.w * factor));
      const nh = Math.max(12, Math.min(120, prev.h * factor));
      const nx = prev.x + mx * (prev.w - nw);
      const ny = prev.y + my * (prev.h - nh);
      return { x: nx, y: ny, w: nw, h: nh };
    });
  }, []);

  // Buttons
  const handleCreate = () => {
    setState("creating");
    setStatusText("Clique na grade para colocar pontos.");
  };

  const handleDelete = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setPoints([]);
    setResult(null);
    setAnimatedSegments(0);
    setState("empty");
    setNextId(1);
    setStatusText("Aguardando criação de pontos...");
    setViewBox({ x: 0, y: 0, w: 100, h: 60 });
  };

  const handleClear = () => {
    setResult(null);
    setAnimatedSegments(0);
    setState("active");
    setStatusText("Rota limpa. Pronto para recalcular.");
  };

  const handleCalculate = () => {
    if (points.length < 2) return;
    setState("calculating");
    setStatusText("Animando rota...");
    const r = solveRoute(points);
    setResult(r);
    setAnimatedSegments(0);

    // Animate segments one by one
    let seg = 0;
    const totalSegs = r.path.length - 1;
    const step = () => {
      seg++;
      setAnimatedSegments(seg);
      if (seg < totalSegs) {
        animRef.current = requestAnimationFrame(() => setTimeout(step, 120));
      } else {
        setState("calculated");
        setStatusText("Cálculo concluído.");
      }
    };
    animRef.current = requestAnimationFrame(() => setTimeout(step, 200));
  };

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const totalConnections = points.length > 1 ? (points.length * (points.length - 1)) / 2 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Network className="text-primary" size={24} />
          <h2 className="text-xl font-bold">Cabling Path Optimizer</h2>
        </div>
        <div className="flex items-center gap-2">
          {state === "empty" && (
            <Button onClick={handleCreate} size="sm" className="gap-2">
              <Plus size={16} /> Criar
            </Button>
          )}
          {(state === "creating" || state === "active") && (
            <>
              <Button onClick={handleCalculate} size="sm" className="gap-2" disabled={points.length < 2}>
                <Calculator size={16} /> Calcular
              </Button>
              <Button onClick={handleDelete} size="sm" variant="destructive" className="gap-2">
                <Trash2 size={16} /> Apagar
              </Button>
            </>
          )}
          {(state === "calculating" || state === "calculated") && (
            <>
              {state === "calculated" && (
                <Button onClick={handleClear} size="sm" variant="outline" className="gap-2">
                  <Eraser size={16} /> Limpar
                </Button>
              )}
              <Button onClick={handleDelete} size="sm" variant="destructive" className="gap-2">
                <Trash2 size={16} /> Apagar
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative w-full" style={{ paddingBottom: "60%" }}>
              <svg
                ref={svgRef}
                viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
                className={`absolute inset-0 w-full h-full bg-[hsl(var(--background))] ${
                  state === "creating" || state === "active" ? "cursor-crosshair" : "cursor-default"
                }`}
                preserveAspectRatio="xMidYMid meet"
                onClick={handleCanvasClick}
                onMouseDown={handleBgDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
              >
                <defs>
                  <pattern id="grid-sm" width="2" height="2" patternUnits="userSpaceOnUse">
                    <path d="M 2 0 L 0 0 0 2" fill="none" stroke="hsl(var(--primary) / 0.08)" strokeWidth="0.05" />
                  </pattern>
                  <pattern id="grid-lg" width="10" height="10" patternUnits="userSpaceOnUse">
                    <rect width="10" height="10" fill="url(#grid-sm)" />
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(var(--primary) / 0.15)" strokeWidth="0.1" />
                  </pattern>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="0.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="glow-red">
                    <feGaussianBlur stdDeviation="0.6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <rect x="-500" y="-500" width="1000" height="1000" fill="url(#grid-lg)" />

                {/* Axes */}
                <line x1="5" y1="55" x2="95" y2="55" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="0.15" />
                <line x1="5" y1="5" x2="5" y2="55" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="0.15" />
                <text x="50" y="59" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="1.8" fontFamily="monospace">Eixo X (metros)</text>
                <text x="2" y="30" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="1.8" fontFamily="monospace" transform="rotate(-90, 2, 30)">Eixo Y</text>

                {/* Animated blue route segments */}
                {result && result.path.length > 1 && Array.from({ length: Math.min(animatedSegments, result.path.length - 1) }).map((_, i) => {
                  const from = points[result.path[i]];
                  const to = points[result.path[i + 1]];
                  if (!from || !to) return null;
                  return (
                    <line
                      key={`seg-${i}`}
                      x1={from.x} y1={from.y}
                      x2={to.x} y2={to.y}
                      stroke="hsl(var(--primary) / 0.35)"
                      strokeWidth="0.2"
                      strokeDasharray="0.4 0.2"
                    />
                  );
                })}

                {/* Bold red route after calculation complete */}
                {state === "calculated" && result && result.path.length > 1 && (
                  <polyline
                    points={result.path.map(i => `${points[i]?.x},${points[i]?.y}`).join(" ")}
                    fill="none"
                    stroke="hsl(var(--destructive))"
                    strokeWidth="0.45"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow-red)"
                  />
                )}

                {/* Points */}
                {points.map((p, idx) => {
                  const isEndpoint = result && (idx === result.longestFrom || idx === result.longestTo);
                  return (
                    <g
                      key={p.id}
                      onMouseDown={(e) => handlePointDown(e, idx)}
                      style={{ cursor: "grab" }}
                    >
                      {/* Glow circle */}
                      <circle cx={p.x} cy={p.y} r={isEndpoint ? 1.8 : 1.2} fill={isEndpoint ? "hsl(var(--destructive) / 0.3)" : "hsl(var(--primary) / 0.25)"} filter="url(#glow)" />
                      {/* Main circle */}
                      <circle cx={p.x} cy={p.y} r={isEndpoint ? 1.0 : 0.7} fill={isEndpoint ? "hsl(var(--destructive))" : "hsl(var(--primary))"} />
                      {/* Label */}
                      <text x={p.x} y={p.y - 1.8} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="1.2" fontFamily="monospace">
                        P{p.id}
                      </text>
                    </g>
                  );
                })}

                {/* Empty state hint */}
                {points.length === 0 && state === "creating" && (
                  <text x="50" y="30" textAnchor="middle" fill="hsl(var(--muted-foreground) / 0.5)" fontSize="2.5" fontFamily="monospace">
                    Clique para adicionar pontos
                  </text>
                )}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Info panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Info size={16} className="text-primary" />
                Resultado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground leading-relaxed text-xs">{statusText}</p>
              <div className="space-y-2 font-mono text-xs">
                {result && state === "calculated" && (
                  <div className="flex justify-between p-2 rounded bg-destructive/10 text-destructive font-semibold">
                    <span>Maior rota</span>
                    <span>P{points[result.longestFrom]?.id} → P{points[result.longestTo]?.id}</span>
                  </div>
                )}
                <div className="flex justify-between p-2 rounded bg-muted">
                  <span className="text-muted-foreground">Distância total</span>
                  <span>{result && (state === "calculated") ? `${result.totalDist.toFixed(1)}m` : "0m"}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted">
                  <span className="text-muted-foreground">Maior distância</span>
                  <span>{result && state === "calculated" ? `${result.longestDist.toFixed(1)}m` : "0m"}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted">
                  <span className="text-muted-foreground">Total de nós</span>
                  <span>{points.length}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted">
                  <span className="text-muted-foreground">Conexões possíveis</span>
                  <span>{totalConnections}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-4 h-1 rounded bg-destructive" />
                <span className="text-xs text-muted-foreground">Rota otimizada (TSP)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-0.5 rounded bg-primary/40" style={{ borderTop: "1px dashed" }} />
                <span className="text-xs text-muted-foreground">Segmentos de rota</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Nó intermediário</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive" />
                <span className="text-xs text-muted-foreground">Nó extremo (mais distante)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CablingOptimizer;
