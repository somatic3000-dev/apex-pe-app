import { useEffect, useState } from "react";

import {
  initialFund,
  initialPortfolio,
  initialDeals,
  NAV,
} from "./data/mockData";

import Dashboard from "./pages/Dashboard";
import MarketData from "./pages/MarketData";
import Portfolio from "./pages/Portfolio";
import DealPipeline from "./pages/DealPipeline";
import LBOCalculator from "./pages/LBOCalculator";
import AIAdvisor from "./pages/AIAdvisor";
import Reporting from "./pages/Reporting";
import ICMemo from "./pages/ICMemo";
import DueDiligence from "./pages/DueDiligence";
import TaskManager from "./pages/TaskManager";
import Notifications from "./pages/Notifications";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import CommandBar from "./components/CommandBar";

const loadSaved = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const mobileNav = [
  { id: "dashboard", label: "Home", icon: "◈" },
  { id: "portfolio", label: "Portfolio", icon: "▣" },
  { id: "pipeline", label: "Deals", icon: "◉" },
  { id: "search", label: "Search", icon: "⌕" },
  { id: "notifications", label: "Alerts", icon: "●" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [fund] = useState(initialFund);

  const [portfolio, setPortfolio] = useState(() =>
    loadSaved("apex_portfolio", initialPortfolio)
  );

  const [deals, setDeals] = useState(() =>
    loadSaved("apex_deals", initialDeals)
  );

  const [tasks, setTasks] = useState(() => loadSaved("apex_tasks", []));

  const [finnhubKey, setFinnhubKey] = useState(
    () => localStorage.getItem("apex_finnhub_key") || ""
  );

  useEffect(() => {
    localStorage.setItem("apex_portfolio", JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem("apex_deals", JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem("apex_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("apex_finnhub_key", finnhubKey);
  }, [finnhubKey]);

  const resetPortfolio = () => {
    if (confirm("Portfolio auf Beispieldaten zurücksetzen?")) {
      setPortfolio(initialPortfolio);
    }
  };

  const sections = NAV.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  function renderPage() {
    return {
      dashboard: <Dashboard fund={fund} portfolio={portfolio} quotes={{}} />,
      markt: (
        <MarketData
          finnhubKey={finnhubKey}
          setFinnhubKey={setFinnhubKey}
        />
      ),
      portfolio: (
        <Portfolio
          portfolio={portfolio}
          setPortfolio={setPortfolio}
          resetPortfolio={resetPortfolio}
        />
      ),
      pipeline: <DealPipeline deals={deals} setDeals={setDeals} />,
      lbo: <LBOCalculator />,
      ai: <AIAdvisor portfolio={portfolio} deals={deals} />,
      ic: <ICMemo deals={deals} />,
      dd: <DueDiligence deals={deals} />,
      tasks: (
        <TaskManager deals={deals} tasks={tasks} setTasks={setTasks} />
      ),
      search: <Search portfolio={portfolio} deals={deals} tasks={tasks} />,
      notifications: (
        <Notifications portfolio={portfolio} deals={deals} tasks={tasks} />
      ),
      reporting: <Reporting portfolio={portfolio} fund={fund} />,
      settings: <Settings />,
    }[page];
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-logo">
          APEX PE <span>Private Equity OS</span>
        </div>

        <span className="badge badge-green">Fund I Active</span>

        <span className="badge badge-blue">
          €{fund.aum || fund.commitments || 0}M AUM
        </span>

        <span className="date">{new Date().toLocaleDateString("de-DE")}</span>
      </header>

      <nav className="sidebar">
        {Object.entries(sections).map(([section, items]) => (
          <div key={section}>
            <div className="nav-section">{section}</div>

            {items.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${page === item.id ? "active" : ""}`}
                onClick={() => setPage(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        ))}
      </nav>

      <main className="main">
        <CommandBar
          portfolio={portfolio}
          deals={deals}
          tasks={tasks}
          setPage={setPage}
        />

        {renderPage()}
      </main>

      <nav
        className="mobile-nav"
        style={{
          position: "fixed",
          left: 12,
          right: 12,
          bottom: 12,
          zIndex: 999,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 6,
          padding: 8,
          borderRadius: 18,
          background: "rgba(10,12,18,0.92)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        {mobileNav.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            style={{
              border: "none",
              borderRadius: 12,
              padding: "8px 4px",
              background:
                page === item.id ? "rgba(201,255,59,0.16)" : "transparent",
              color:
                page === item.id ? "var(--accent)" : "rgba(255,255,255,0.6)",
              fontSize: 11,
              display: "grid",
              gap: 3,
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}