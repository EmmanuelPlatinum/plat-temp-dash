import { useNavigate } from "react-router-dom";
import {
  Thermometer,
  Wifi,
  Cpu,
  BarChart3,
  Download,
  Shield,
  ArrowRight,
  Zap,
  MonitorSmartphone,
  Lightbulb,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

const features = [
  {
    icon: Thermometer,
    title: "Monitoramento em Tempo Real",
    desc: "Acompanhe a temperatura da sala de aula com atualizações a cada 3 segundos, diretamente do sensor conectado ao ESP32.",
  },
  {
    icon: BarChart3,
    title: "Gráficos Interativos",
    desc: "Visualize a variação térmica das últimas 24 horas com gráficos de linha detalhados e responsivos.",
  },
  {
    icon: Wifi,
    title: "Múltiplas Conexões",
    desc: "Alterne entre Wi-Fi, Bluetooth e Ethernet para se conectar ao microcontrolador da forma mais conveniente.",
  },
  {
    icon: Cpu,
    title: "Visualização de Hardware",
    desc: "Explore o diagrama técnico do ESP32 WROOM-32 com detalhes dos pinos GPIO, ADC e especificações.",
  },
  {
    icon: Download,
    title: "Exportação de Dados",
    desc: "Exporte o histórico de medições em CSV ou JSON para análise externa ou relatórios acadêmicos.",
  },
  {
    icon: Shield,
    title: "Alertas Inteligentes",
    desc: "Indicadores visuais de status — normal, alerta e crítico — para agir rapidamente em situações de risco.",
  },
];

const tips = [
  {
    icon: Zap,
    text: "Posicione o sensor longe de janelas e aparelhos de ar-condicionado para leituras mais precisas.",
  },
  {
    icon: MonitorSmartphone,
    text: "Use o modo Wi-Fi para monitoramento remoto e Ethernet para conexões mais estáveis.",
  },
  {
    icon: Lightbulb,
    text: "Exporte os dados regularmente para manter um histórico completo das condições da sala.",
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="text-primary" size={20} />
            <span className="font-mono font-bold text-sm tracking-wider text-foreground">ESP32 MONITOR</span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Alternar tema"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-mono font-semibold tracking-wider mb-6">
            <Cpu size={14} />
            ESP32 WROOM-32
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
            Monitoramento Térmico
            <br />
            <span className="text-primary">Inteligente</span> para Salas de Aula
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Sistema completo de telemetria com ESP32 — visualize temperaturas em
            tempo real, gerencie conexões e exporte dados com facilidade.
          </p>

          <Button
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="gap-2 text-base px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            Iniciar Monitoramento
            <ArrowRight size={18} />
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          Recursos do Sistema
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Tudo o que você precisa para monitorar e analisar as condições
          térmicas do ambiente.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group p-6 rounded-xl border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tips */}
      <section className="bg-card border-y">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">
            💡 Dicas de Uso
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tips.map((tip, i) => {
              const Icon = tip.icon;
              return (
                <div
                  key={i}
                  className="flex gap-4 items-start p-4 rounded-lg bg-background"
                >
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">
                    <Icon size={16} />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tip.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Pronto para começar?
        </h2>
        <p className="text-muted-foreground mb-8">
          Acesse o painel de controle e comece a monitorar sua sala de aula
          agora.
        </p>
        <Button
          size="lg"
          onClick={() => navigate("/dashboard")}
          className="gap-2 px-8"
        >
          Acessar Dashboard
          <ArrowRight size={18} />
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center">
        <p className="text-xs font-mono text-muted-foreground tracking-wider">
          Sala de Aula Monitor v1.0 — ESP32 WROOM-32
        </p>
      </footer>
    </div>
  );
};

export default Landing;
