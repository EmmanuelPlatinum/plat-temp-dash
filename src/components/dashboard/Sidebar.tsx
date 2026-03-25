import { LayoutDashboard, Cpu, ScrollText, Network, ArrowLeft, Sun, Moon, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  open?: boolean;
  onClose?: () => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "hardware", label: "Hardware", icon: Cpu },
  { id: "logs", label: "Logs", icon: ScrollText },
  { id: "cabling", label: "Otimizador de Rotas", icon: Network },
];

const Sidebar = ({ activeTab, onTabChange, open, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleNav = (id: string) => {
    onTabChange(id);
    onClose?.();
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-60 bg-sidebar text-sidebar-foreground flex flex-col z-50 transition-transform duration-200 ${
          open === false ? "-translate-x-full" : "translate-x-0"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <Network className="text-primary" size={24} />
            <span className="font-mono font-bold text-sm tracking-wider">
              ESP32 MONITOR
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <button
            onClick={() => { navigate("/"); onClose?.(); }}
            className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground border-l-2 border-transparent transition-colors"
          >
            <ArrowLeft size={18} />
            Página Inicial
          </button>

          <div className="h-px bg-sidebar-border mx-5 my-2" />

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-primary border-l-2 border-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground border-l-2 border-transparent"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-sidebar-border space-y-3">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-2 py-2 rounded text-xs font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            {theme === "light" ? "Modo Escuro" : "Modo Claro"}
          </button>
          <p className="text-[10px] font-mono text-sidebar-foreground/40 uppercase tracking-widest">
            Sala de Aula Monitor v1.0
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
