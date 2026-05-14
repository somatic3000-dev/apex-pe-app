// src/App.jsx

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
import TaskManager from "./pages/TaskManager";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

const loadSaved = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [portfolio, setPortfolio] = useState(() =>
    loadSaved("apex_portfolio", initialPortfolio)
  );
  const [deals, setDeals] = useState(() =>
    loadSaved("apex_deals", initialDeals)
  );

  useEffect(() => {
    localStorage.setItem("apex_portfolio", JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem("apex_deals", JSON.stringify(deals));
  }, [deals]);

  const pages = {
    dashboard: <Dashboard fund={initialFund} portfolio={portfolio} />,
    markt: <MarketData />,
    portfolio: <Portfolio portfolio={portfolio} setPortfolio={setPortfolio} />,
    pipeline: <DealPipeline deals={deals} setDeals={setDeals} />,
    lbo: <LBOCalculator />,
    ai: <AIAdvisor portfolio={portfolio} deals={deals} />,
    reporting: <Reporting fund={initialFund} portfolio={portfolio} />,
    tasks: <TaskManager deals={deals} />,
    notifications: <Notifications portfolio={portfolio} deals={deals} />,
    icmemo: <ICMemo deals={deals} />,
    settings: <Settings />,
  };

  return (
    <div className="app">
      <div className="topbar">
        <div className="topbar-logo">
          APEX <span>CAPITAL OS</span>
        </div>

        <div className="badge badge-green">LIVE</div>

        <div className="date">
          {new Date().toLocaleDateString("de-DE")}
        </div>
      </div>

      <div className="sidebar">
        {NAV.map((item, index) => {
          const previous = NAV[index - 1];
          const showSection = !previous || previous.section !== item.section;

          return (
            <div key={item.id}>
              {showSection && (
                <div className="nav-section">{item.section}</div>
              )}

              <div
                className={`nav-item ${page === item.id ? "active" : ""}`}
                onClick={() => setPage(item.id)}
              >
                <div className="nav-icon">{item.icon}</div>
                <div>{item.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="main">{pages[page]}</div>
    </div>
  );
}