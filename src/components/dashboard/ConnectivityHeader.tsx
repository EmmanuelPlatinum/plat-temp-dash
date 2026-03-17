import { Wifi, Bluetooth, Cable, Signal } from "lucide-react";

type ConnectionType = "wifi" | "bluetooth" | "ethernet";

interface ConnectivityHeaderProps {
  activeConnection: ConnectionType;
  onConnectionChange: (type: ConnectionType) => void;
  isConnected: boolean;
}

const connections = [
  { id: "wifi" as const, label: "Wi-Fi", icon: Wifi },
  { id: "bluetooth" as const, label: "Bluetooth", icon: Bluetooth },
  { id: "ethernet" as const, label: "Ethernet", icon: Cable },
];

const ConnectivityHeader = ({
  activeConnection,
  onConnectionChange,
  isConnected,
}: ConnectivityHeaderProps) => {
  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-semibold text-foreground">Conectividade</h2>
        <div className="flex items-center gap-1">
          {connections.map((conn) => {
            const Icon = conn.icon;
            const isActive = activeConnection === conn.id;
            return (
              <button
                key={conn.id}
                onClick={() => onConnectionChange(conn.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={14} />
                {conn.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-muted">
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
            {isConnected ? "CONNECTED" : "OFFLINE"}
          </span>
        </div>
        {isConnected && (
          <Signal size={16} className="text-primary animate-data-pulse" />
        )}
      </div>
    </header>
  );
};

export default ConnectivityHeader;
