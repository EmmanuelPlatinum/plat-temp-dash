import { useState } from "react";
import { Code } from "lucide-react";
import TechStackModal from "./TechStackModal";

const AppFooter = () => {
  const [showStack, setShowStack] = useState(false);

  return (
    <>
      <footer className="border-t border-border py-6 text-center relative">
        <p className="text-xs font-mono text-muted-foreground tracking-wider">
          Sala de Aula Monitor v1.0 — ESP32 WROOM-32
        </p>
        <button
          onClick={() => setShowStack(true)}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-lg text-muted-foreground/40 hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Tech Stack"
          title="Tech Stack"
        >
          <Code size={16} />
        </button>
      </footer>
      <TechStackModal open={showStack} onOpenChange={setShowStack} />
    </>
  );
};

export default AppFooter;
