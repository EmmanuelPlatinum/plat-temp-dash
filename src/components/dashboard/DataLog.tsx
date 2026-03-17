import { Download, Clock } from "lucide-react";

interface LogEntry {
  id: number;
  timestamp: string;
  temp: number;
  status: "normal" | "warning" | "critical";
}

interface DataLogProps {
  logs: LogEntry[];
}

const DataLog = ({ logs }: DataLogProps) => {
  const exportCSV = () => {
    const header = "ID,Timestamp,Temperature (°C),Status\n";
    const rows = logs
      .map((l) => `${l.id},${l.timestamp},${l.temp},${l.status}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `thermal_log_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `thermal_log_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: LogEntry["status"]) => {
    const styles = {
      normal: "bg-status-online/10 text-status-online",
      warning: "bg-status-warning/10 text-status-warning",
      critical: "bg-status-offline/10 text-status-offline",
    };
    const labels = { normal: "OK", warning: "ALERTA", critical: "CRÍTICO" };
    return (
      <span
        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="bg-card border border-border rounded p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Log de Dados
          </h3>
          <span className="text-[10px] font-mono text-muted-foreground">
            ({logs.length} registros)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            <Download size={12} />
            CSV
          </button>
          <button
            onClick={exportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-muted text-foreground text-xs font-medium hover:bg-muted/80 transition-colors"
          >
            <Download size={12} />
            JSON
          </button>
        </div>
      </div>

      <div className="overflow-auto max-h-64">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-2 font-mono text-muted-foreground font-medium text-[10px] uppercase tracking-wider">
                #
              </th>
              <th className="text-left py-2 px-2 font-mono text-muted-foreground font-medium text-[10px] uppercase tracking-wider">
                Timestamp
              </th>
              <th className="text-left py-2 px-2 font-mono text-muted-foreground font-medium text-[10px] uppercase tracking-wider">
                Temp (°C)
              </th>
              <th className="text-left py-2 px-2 font-mono text-muted-foreground font-medium text-[10px] uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <td className="py-2 px-2 font-mono text-muted-foreground">
                  {log.id}
                </td>
                <td className="py-2 px-2 font-mono">{log.timestamp}</td>
                <td className="py-2 px-2 font-mono font-semibold">
                  {log.temp.toFixed(1)}
                </td>
                <td className="py-2 px-2">{getStatusBadge(log.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataLog;
