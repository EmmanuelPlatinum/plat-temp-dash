import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Info } from "lucide-react";

interface Point {
  id: number;
  x: number;
  y: number;
}

interface Edge {
  from: number;
  to: number;
  dist: number;
}

const generatePoints = (count: number): Point[] => {
  const pts: Point[] = [];
  for (let i = 0; i < count; i++) {
    pts.push({ id: i, x: 5 + Math.random() * 90, y: 5 + Math.random() * 90 });
  }
  return pts;
};

const distance = (a: Point, b: Point) =>
  Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

const CablingOptimizer = () => {
  const [points] = useState(() => generatePoints(18));
  const [longestEdge, setLongestEdge] = useState<Edge | null>(null);
  const [secondaryEdges, setSecondaryEdges] = useState<Edge[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  const compute = useCallback(() => {
    let maxDist = 0;
    let longest: Edge = { from: 0, to: 1, dist: 0 };

    // Find longest pair
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const d = distance(points[i], points[j]);
        if (d > maxDist) {
          maxDist = d;
          longest = { from: i, to: j, dist: d };
        }
      }
    }
    setLongestEdge(longest);

    // Secondary: connect each point to 2-3 nearest neighbors
    const secondary: Edge[] = [];
    const added = new Set<string>();
    for (let i = 0; i < points.length; i++) {
      const dists = points
        .map((p, j) => ({ j, d: distance(points[i], p) }))
        .filter((x) => x.j !== i)
        .sort((a, b) => a.d - b.d);

      const count = 2 + Math.floor(Math.random() * 2);
      for (let k = 0; k < Math.min(count, dists.length); k++) {
        const key = [Math.min(i, dists[k].j), Math.max(i, dists[k].j)].join("-");
        if (!added.has(key) && !(i === longest.from && dists[k].j === longest.to) && !(i === longest.to && dists[k].j === longest.from)) {
          added.add(key);
          secondary.push({ from: i, to: dists[k].j, dist: dists[k].d });
        }
      }
    }
    setSecondaryEdges(secondary);
  }, [points]);

  useEffect(() => { compute(); }, [compute]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Network className="text-primary" size={24} />
        <h2 className="text-xl font-bold">Cabling Path Optimizer</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Blueprint Canvas */}
        <Card className="lg:col-span-3 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative w-full" style={{ paddingBottom: "60%" }}>
              <svg
                ref={svgRef}
                viewBox="0 0 100 60"
                className="absolute inset-0 w-full h-full bg-[hsl(var(--background))]"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Blueprint grid */}
                <defs>
                  <pattern id="grid-sm" width="2" height="2" patternUnits="userSpaceOnUse">
                    <path d="M 2 0 L 0 0 0 2" fill="none" stroke="hsl(var(--primary) / 0.08)" strokeWidth="0.05" />
                  </pattern>
                  <pattern id="grid-lg" width="10" height="10" patternUnits="userSpaceOnUse">
                    <rect width="10" height="10" fill="url(#grid-sm)" />
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(var(--primary) / 0.15)" strokeWidth="0.1" />
                  </pattern>
                </defs>
                <rect width="100" height="60" fill="url(#grid-lg)" />

                {/* Axes */}
                <line x1="5" y1="55" x2="95" y2="55" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="0.15" />
                <line x1="5" y1="5" x2="5" y2="55" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="0.15" />
                <text x="50" y="59" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="1.8" fontFamily="monospace">Eixo X (metros)</text>
                <text x="2" y="30" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="1.8" fontFamily="monospace" transform="rotate(-90, 2, 30)">Eixo Y</text>

                {/* Secondary cables */}
                {secondaryEdges.map((e, i) => (
                  <line
                    key={`s-${i}`}
                    x1={points[e.from].x}
                    y1={points[e.from].y * 0.55 + 3}
                    x2={points[e.to].x}
                    y2={points[e.to].y * 0.55 + 3}
                    stroke="hsl(var(--primary) / 0.25)"
                    strokeWidth="0.15"
                    strokeDasharray="0.4 0.2"
                  />
                ))}

                {/* Longest route */}
                {longestEdge && (
                  <line
                    x1={points[longestEdge.from].x}
                    y1={points[longestEdge.from].y * 0.55 + 3}
                    x2={points[longestEdge.to].x}
                    y2={points[longestEdge.to].y * 0.55 + 3}
                    stroke="hsl(var(--destructive))"
                    strokeWidth="0.4"
                    strokeLinecap="round"
                  />
                )}

                {/* Points */}
                {points.map((p) => {
                  const isEndpoint = longestEdge && (p.id === longestEdge.from || p.id === longestEdge.to);
                  return (
                    <g key={p.id}>
                      <circle
                        cx={p.x}
                        cy={p.y * 0.55 + 3}
                        r={isEndpoint ? 1.2 : 0.7}
                        fill={isEndpoint ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                        opacity={isEndpoint ? 1 : 0.8}
                      />
                      <text
                        x={p.x}
                        y={p.y * 0.55 + 1}
                        textAnchor="middle"
                        fill="hsl(var(--muted-foreground))"
                        fontSize="1.2"
                        fontFamily="monospace"
                      >
                        N{p.id}
                      </text>
                    </g>
                  );
                })}
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
              <p className="text-muted-foreground leading-relaxed">
                Cálculo concluído. Maior rota identificada entre os nós mais distantes.
              </p>
              {longestEdge && (
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between p-2 rounded bg-destructive/10 text-destructive font-semibold">
                    <span>Maior rota</span>
                    <span>N{longestEdge.from} → N{longestEdge.to}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-muted">
                    <span className="text-muted-foreground">Distância</span>
                    <span>{longestEdge.dist.toFixed(1)}m</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-muted">
                    <span className="text-muted-foreground">Total de nós</span>
                    <span>{points.length}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-muted">
                    <span className="text-muted-foreground">Cabos secundários</span>
                    <span>{secondaryEdges.length}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-1 rounded bg-destructive" />
                <span className="text-xs text-muted-foreground">Rota mais longa</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-0.5 rounded bg-primary/40 border-dashed" />
                <span className="text-xs text-muted-foreground">Cabeamento secundário</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CablingOptimizer;
