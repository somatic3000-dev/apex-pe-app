// src/App.jsx

import { useEffect, useState } from "react";

import "./App.css";

import Dashboard from "./pages/Dashboard";
import MarketData from "./pages/MarketData";
import Portfolio from "./pages/Portfolio";
import Pipeline from "./pages/Pipeline";
import LBOModel from "./pages/LBOModel";
import AIAssistant from "./pages/AIAssistant";
import Reporting from "./pages/Reporting";
import Settings from "./pages/Settings";
import TaskManager from "./pages/TaskManager";
import Notifications from "./pages/Notifications";
import ICMemo from "./pages/ICMemo";

import {
  initialFund,
  initialPortfolio,
  initialDeals,
  NAV,
} from "./data/mockData";

export default function App() {
  const [activePage, setActivePage] =
    useState("dashboard");

  const [portfolio, setPortfolio] =
    useState(() => {
      const saved =
        localStorage.getItem(
          "apex_portfolio"
        );

      return saved
        ? JSON.parse(saved)
        : initialPortfolio;
    });

  const [deals, setDeals] =
    useState(() => {
      const saved =
        localStorage.getItem(
          "apex_deals"
        );

      return saved
        ? JSON.parse(saved)
        : initialDeals;
    });

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

  const pages = {
    dashboard: (
      <Dashboard
        fund={initialFund}
        portfolio={portfolio}
      />
    ),

    markt: <MarketData />,

    portfolio: (
      <Portfolio
        portfolio={portfolio}
        setPortfolio={
          setPortfolio
        }
      />
    ),

    pipeline: (
      <Pipeline
        deals={deals}
        setDeals={setDeals}
      />
    ),

    lbo: <LBOModel />,

    ai: <AIAssistant />,

    reporting: (
      <Reporting
        fund={initialFund}
        portfolio={portfolio}
      />
    ),

    tasks: (
      <TaskManager
        deals={deals}
      />
    ),

    notifications: (
      <Notifications
        portfolio={portfolio}
        deals={deals}
      />
    ),

    icmemo: (
      <ICMemo
        deals={deals}
      />
    ),

    settings: <Settings />,
  };

  function renderNavigation() {
    let lastSection = "";

    return NAV.map((item) => {
      const showSection =
        item.section !==
        lastSection;

      lastSection =
        item.section;

      return (
        <div key={item.id}>
          {showSection && (
            <div className="nav-section">
              {item.section}
            </div>
          )}

          <div
            className={`nav-item ${
              activePage ===
              item.id
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage(
                item.id
              )
            }
          >
            <div className="nav-icon">
              {item.icon}
            </div>

            <div>
              {item.label}
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="app">
      <div className="topbar">
        <div className="topbar-logo">
          APEX{" "}
          <span>
            CAPITAL OS
          </span>
        </div>

        <div className="badge badge-green">
          LIVE
        </div>

        <div className="date">
          {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="sidebar">
        {renderNavigation()}
      </div>

      <div className="main">
        {
          pages[
            activePage
          ]
        }
      </div>

      <div className="mobile-nav">
        {NAV.slice(0, 5).map(
          (item) => (
            <button
              key={item.id}
              className={`btn ${
                activePage ===
                item.id
                  ? "btn-primary"
                  : "btn-ghost"
              }`}
              onClick={() =>
                setActivePage(
                  item.id
                )
              }
            >
              {item.icon}
            </button>
          )
        )}
      </div>
    </div>
  );
}