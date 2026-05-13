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

  const [fund] = useState(initialFund);

  const [portfolio, setPortfolio] = useState(() =>
    loadSaved("apex_portfolio", initialPortfolio)
  );

  const [deals, setDeals] = useState(() =>
    loadSaved("apex_deals", initialDeals)
  );

  const [finnhubKey, setFinnhubKey] = useState(
    () => localStorage.getItem("apex_finnhub_key") || ""
  );

  useEffect(() => {
    localStorage.setItem(
      "apex_portfolio",
      JSON.stringify(portfolio)
    );
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem(
      "apex_deals",
      JSON.stringify(deals)
    );
  }, [deals]);

  useEffect(() => {
    localStorage.setItem(
      "apex_finnhub_key",
      finnhubKey
    );
  }, [finnhubKey]);

  const resetPortfolio = () => {
    if (
      confirm(
        "Portfolio auf Beispieldaten zurücksetzen?"
      )
    ) {
      setPortfolio(initialPortfolio);
    }
  };

  const sections = NAV.reduce((acc, nav) => {
    (acc[nav.section] ||= []).push(nav);
    return acc;
  }, {});

  const render = () =>
    ({
      dashboard: (
        <Dashboard
          fund={fund}
          portfolio={portfolio}
          quotes={{}}
        />
      ),

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

      pipeline: (
        <DealPipeline
          deals={deals}
          setDeals={setDeals}
        />
      ),

      lbo: <LBOCalculator />,

      ai: (
        <AIAdvisor
          portfolio={portfolio}
          deals={deals}
        />
      ),

      reporting: (
        <Reporting
          portfolio={portfolio}
          fund={fund}
        />
      ),

      settings: <Settings />,
    }[page]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-logo">
          APEX PE{" "}
          <span>Private Equity OS</span>
        </div>

        <span className="badge badge-green">
          Fund I Active
        </span>

        <span className="badge badge-blue">
          €120M AUM
        </span>

        <span className="date">
          {new Date().toLocaleDateString("de-DE")}
        </span>
      </header>

      <nav className="sidebar">
        {Object.entries(sections).map(
          ([section, items]) => (
            <div key={section}>
              <div className="nav-section">
                {section}
              </div>

              {items.map((nav) => (
                <div
                  key={nav.id}
                  className={`nav-item ${
                    page === nav.id
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setPage(nav.id)
                  }
                >
                  <span className="nav-icon">
                    {nav.icon}
                  </span>

                  {nav.label}
                </div>
              ))}
            </div>
          )
        )}
      </nav>

      <main className="main">
        {render()}
      </main>
    </div>
  );
}