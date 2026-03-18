import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TechStackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const languages = [
  { name: "TypeScript", percent: 45, color: "hsl(211, 60%, 48%)" },
  { name: "Tailwind CSS", percent: 25, color: "hsl(199, 89%, 48%)" },
  { name: "CSS (Design Tokens)", percent: 15, color: "hsl(280, 65%, 55%)" },
  { name: "Recharts / SVG", percent: 8, color: "hsl(142, 71%, 45%)" },
  { name: "HTML / JSX", percent: 5, color: "hsl(25, 95%, 53%)" },
  { name: "Config (Vite/TS)", percent: 2, color: "hsl(45, 80%, 55%)" },
];

const TechStackModal = ({ open, onOpenChange }: TechStackModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono text-base tracking-wider">
            {"</"}>} Tech Stack
          </DialogTitle>
          <DialogDescription className="text-xs">
            Distribuição aproximada das tecnologias utilizadas neste projeto.
          </DialogDescription>
        </DialogHeader>

        {/* Language bar */}
        <div className="flex h-4 w-full rounded-full overflow-hidden border border-border">
          {languages.map((lang) => (
            <div
              key={lang.name}
              className="h-full transition-all"
              style={{
                width: `${lang.percent}%`,
                backgroundColor: lang.color,
              }}
              title={`${lang.name}: ${lang.percent}%`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {languages.map((lang) => (
            <div key={lang.name} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: lang.color }}
              />
              <span className="text-xs text-foreground font-medium truncate">
                {lang.name}
              </span>
              <span className="text-xs text-muted-foreground font-mono ml-auto">
                {lang.percent}%
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-[10px] font-mono text-muted-foreground text-center uppercase tracking-widest">
            React 18 • Vite • Radix UI • Lucide • React Router • Recharts
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TechStackModal;
