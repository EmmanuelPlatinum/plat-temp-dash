# ESP32 Classroom Temperature Monitor

> Real-time IoT thermal monitoring system for classroom environments, powered by ESP32 WROOM-32 microcontroller.

## 🎯 Overview

This is a full-stack web dashboard that simulates real-time temperature telemetry from an ESP32 microcontroller. It was built as an academic project to demonstrate IoT monitoring concepts, data visualization, and modern web development practices.

## ✨ Features

| Feature | Description |
|---|---|
| **Real-Time Monitoring** | Live temperature readings updated every 3 seconds with trend indicators (↑↓→) |
| **24h Temperature Chart** | Interactive line chart showing thermal variation over the last 24 hours |
| **Multi-Connection Support** | Toggle between Wi-Fi, Bluetooth, and Ethernet connectivity modes |
| **Hardware Diagram** | Interactive SVG schematic of the ESP32 WROOM-32 with GPIO pin details |
| **Data Export** | Export measurement history as CSV or JSON for academic reports |
| **Smart Alerts** | Visual status indicators — Normal (green), Warning (orange), Critical (red) |
| **Dark Mode** | Global theme toggle (light/dark) with persistent preference via localStorage |
| **Hero Animation** | Animated SVG narrative: robotic arm mounts CPU → heats up → thermometer rises |
| **Tech Stack Easter Egg** | Hidden `</>` button in the footer reveals a GitHub-style language breakdown |
| **Serial Console** | Simulated terminal panel showing raw sensor data in real-time JSON format |

## 🛠 Tech Stack

| Technology | Purpose | Approx. Usage |
|---|---|---|
| **TypeScript** | Primary language, type-safe development | ~45% |
| **React 18** | UI framework, component-based architecture | (via TSX) |
| **Tailwind CSS** | Utility-first styling with custom design tokens | ~25% |
| **Recharts** | Data visualization (temperature line charts) | ~5% |
| **Vite** | Build tool and dev server (HMR) | config |
| **Radix UI** | Accessible, unstyled UI primitives (Dialog, Progress, etc.) | ~5% |
| **Lucide React** | Icon library (Thermometer, Wifi, Cpu, etc.) | ~2% |
| **React Router** | Client-side routing (Landing → Dashboard) | ~3% |
| **CSS (HSL Design Tokens)** | Theming system with light/dark mode variables | ~15% |

## 📁 Project Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── ConnectivityHeader.tsx   # Connection type toggle (Wi-Fi/BT/Ethernet)
│   │   ├── DataLog.tsx              # Temperature log table with CSV/JSON export
│   │   ├── HardwareCard.tsx         # ESP32 SVG schematic + specs
│   │   ├── Sidebar.tsx              # Navigation sidebar with theme toggle
│   │   ├── SerialConsole.tsx        # Simulated terminal with raw sensor data
│   │   ├── TemperatureChart.tsx     # 24h line chart (Recharts)
│   │   └── TemperatureHero.tsx      # Current temp display with min/max/trend
│   ├── landing/
│   │   └── HeroHardwareAnimation.tsx # Animated CPU mounting sequence (SVG)
│   ├── shared/
│   │   ├── TechStackModal.tsx       # Easter egg: language breakdown modal
│   │   └── AppFooter.tsx            # Shared footer with tech stack button
│   └── ui/                          # Reusable UI primitives (shadcn/ui)
├── hooks/
│   ├── use-theme.tsx                # Global theme context (light/dark)
│   └── use-mobile.tsx               # Mobile breakpoint detection
├── pages/
│   ├── Index.tsx                    # Dashboard page (main monitoring view)
│   ├── Landing.tsx                  # Landing page (features, tips, CTA)
│   └── NotFound.tsx                 # 404 page
├── index.css                        # Design tokens (HSL variables, animations)
├── App.tsx                          # Root component with routing
└── main.tsx                         # Entry point
```

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────┐
│                   SIMULATED ESP32                     │
│                                                       │
│  setInterval (3s) ──► generates random Δ temperature  │
│                       (±0.2°C per tick)               │
└──────────────────────┬────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│              React State (Index.tsx)                   │
│                                                       │
│  currentTemp ────► TemperatureHero (live display)     │
│  chartData[] ────► TemperatureChart (24h line chart)  │
│  logs[] ─────────► DataLog (table + export)           │
│  currentTemp ────► SerialConsole (raw JSON output)    │
│  activeConnection ► ConnectivityHeader (toggle)       │
└──────────────────────────────────────────────────────┘
```

**How it works:**

1. **Data Generation**: `generateChartData()` creates 24 data points (one per hour) using sine waves + random noise to simulate realistic temperature patterns.
2. **Live Updates**: A `setInterval` in `useEffect` updates `currentTemp` every 3 seconds with small random deltas (±0.2°C), simulating a real sensor stream.
3. **State Management**: All data lives in React `useState` hooks at the page level (`Index.tsx`), passed down as props to child components.
4. **Theme Persistence**: The `ThemeProvider` context stores the user's preference in `localStorage` and applies the `.dark` CSS class to `<html>`.
5. **Serial Console**: Subscribes to the same `currentTemp` state and formats each reading as a raw JSON line, simulating UART serial output from the ESP32.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📄 License

Academic project — ESP32 Classroom Temperature Monitor v1.0
