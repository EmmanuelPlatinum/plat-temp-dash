import { LayoutDashboard, Cpu, ScrollText, Thermometer } from "lucide-react";

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
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-sidebar text-sidebar-foreground flex flex-col z-50">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
        <Thermometer className="text-primary" size={24} />
        <span className="font-mono font-bold text-sm tracking-wider">
          ESP32 MONITOR
        </span>
      </div>

      <nav className="flex-1 py-4">
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

      <div className="px-5 py-4 border-t border-sidebar-border">
        <p className="text-[10px] font-mono text-sidebar-foreground/40 uppercase tracking-widest">
          Sala de Aula Monitor v1.0
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
