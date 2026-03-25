import { Wifi, Bluetooth, Cable, Signal, Menu } from "lucide-react";

type ConnectionType = "wifi" | "bluetooth" | "ethernet";

interface ConnectivityHeaderProps {
  activeConnection: ConnectionType;
  onConnectionChange: (type: ConnectionType) => void;
  isConnected: boolean;
  onMenuToggle?: () => void;
}

const connections = [
  { id: "wifi" as const, label: "Wi-Fi", icon: Wifi },
  { id: "bluetooth" as const, label: "BT", icon: Bluetooth },
  { id: "ethernet" as const, label: "Eth", icon: Cable },
];

const ConnectivityHeader = ({
  activeConnection,
  onConnectionChange,
  isConnected,
  onMenuToggle,
}: ConnectivityHeaderProps) => {
  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-1.5 rounded hover:bg-muted text-muted-foreground"
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>
        )}
        <h2 className="text-sm font-semibold text-foreground hidden sm:block">Conectividade</h2>
        <div className="flex items-center gap-1">
          {connections.map((conn) => {
            const Icon = conn.icon;
            const isActive = activeConnection === conn.id;
            return (
              <button
                key={conn.id}
                onClick={() => onConnectionChange(conn.id)}
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{conn.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded bg-muted">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected
                ? "bg-status-online animate-pulse-dot"
                : "bg-status-offline"
            }`}
          />
          <span
            className={`text-xs font-mono font-semibold tracking-wider ${
              isConnected ? "text-status-online" : "text-status-offline"
            }`}
          >
            {isConnected ? "ON" : "OFF"}
          </span>
        </div>
        {isConnected && (
          <Signal size={16} className="text-primary animate-data-pulse hidden sm:block" />
        )}
      </div>
    </header>
  );
};

export default ConnectivityHeader;
