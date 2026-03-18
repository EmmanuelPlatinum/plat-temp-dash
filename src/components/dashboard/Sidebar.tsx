import { LayoutDashboard, Cpu, ScrollText, Thermometer, ArrowLeft, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "hardware", label: "Hardware", icon: Cpu },
  { id: "logs", label: "Logs", icon: ScrollText },
];

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-sidebar text-sidebar-foreground flex flex-col z-50">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
        <Thermometer className="text-primary" size={24} />
        <span className="font-mono font-bold text-sm tracking-wider">
          ESP32 MONITOR
        </span>
      </div>

      <nav className="flex-1 py-4">
        <button
          onClick={() => navigate("/")}
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
              onClick={() => onTabChange(item.id)}
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
  );
};

export default Sidebar;
