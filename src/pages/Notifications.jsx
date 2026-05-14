// src/pages/Notifications.jsx

export default function Notifications({
  portfolio = [],
  deals = [],
  tasks = [],
  marketContext = {},
}) {
  const alerts = buildAlerts(portfolio, deals, tasks, marketContext);

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;
  const successCount = alerts.filter((a) => a.severity === "success").length;
  const marketCount = alerts.filter((a) => a.category === "Market").length;
  const taskCount = alerts.filter((a) => a.category === "Task").length;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            ALERT <span>CENTER</span>
          </div>

          <div className="page-sub">
            Portfolio Monitoring · Market Intelligence · IC Readiness
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 20 }}>
        <Metric label="Total Alerts" value={alerts.length} />
        <Metric label="Critical" value={criticalCount} />
        <Metric label="Warnings" value={warningCount} />
        <Metric label="Positive" value={successCount} />
        <Metric label="Market" value={marketCount} />
        <Metric label="Open Tasks" value={taskCount} />
      </div>

      <div className="market-grid">
        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}

        {alerts.length === 0 && (
          <div className="card">
            <div className="card-title">Keine Alerts aktiv</div>
            <p className="muted">
              Aktuell sind keine kritischen Portfolio-, Markt-, Deal- oder
              Task-Hinweise vorhanden.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function buildAlerts(portfolio, deals, tasks, marketContext) {
  const alerts = [];

  buildMarketAlerts(alerts, marketContext);
  buildPortfolioAlerts(alerts, portfolio);
  buildDealAlerts(alerts, deals);
  buildTaskAlerts(alerts, tasks);

  return alerts.sort((a, b) => severityRank(b.severity) - severityRank(a.severity));
}

function buildMarketAlerts(alerts, marketContext = {}) {
  const summary = marketContext.summary || {};
  const quotes = marketContext.quotes || {};

  const loaded = Number(summary.loaded) || 0;
  const avgChange = Number(summary.avgChange) || 0;
  const gainers = Number(summary.gainers) || 0;
  const losers = Number(summary.losers) || 0;

  if (loaded === 0) {
    alerts.push({
      id: "market-no-data",
      category: "Market",
      severity: "info",
      title: "Keine Marktdaten geladen",
      message:
        "Es wurden noch keine Live-Marktdaten geladen. Öffne Marktdaten und klicke Refresh.",
      action: "Finnhub Key prüfen und Watchlist aktualisieren",
    });

    return;
  }

  if (avgChange <= -2) {
    alerts.push({
      id: "market-risk-off",
      category: "Market",
      severity: "critical",
      title: "Risk-off Marktumfeld",
      message: `Die Watchlist liegt im Schnitt bei ${avgChange.toFixed(
        2
      )}%. ${losers} Titel sind negativ.`,
      action: "Valuation Discipline erhöhen und Downside Cases prüfen",
    });
  } else if (avgChange <= -1) {
    alerts.push({
      id: "market-pressure",
      category: "Market",
      severity: "warning",
      title: "Marktdruck sichtbar",
      message: `Die Watchlist liegt im Schnitt bei ${avgChange.toFixed(
        2
      )}%.`,
      action: "Pipeline Annahmen und Exit Timing konservativer bewerten",
    });
  } else if (avgChange >= 1) {
    alerts.push({
      id: "market-tailwind",
      category: "Market",
      severity: "success",
      title: "Positive Marktstimmung",
      message: `Die Watchlist liegt im Schnitt bei +${avgChange.toFixed(
        2
      )}%. ${gainers} Titel sind positiv.`,
      action: "Exit Readiness und High-Conviction Deals priorisieren",
    });
  }

  const pePeers = ["BX", "KKR", "APO", "CG"];
  const peerQuotes = pePeers.map((symbol) => quotes[symbol]).filter(Boolean);

  if (peerQuotes.length > 0) {
    const peerAvg =
      peerQuotes.reduce((sum, quote) => sum + (Number(quote.change) || 0), 0) /
      peerQuotes.length;

    if (peerAvg <= -2) {
      alerts.push({
        id: "pe-peer-weak",
        category: "Market",
        severity: "warning",
        title: "PE Peers schwach",
        message: `BX, KKR, APO und CG liegen im Schnitt bei ${peerAvg.toFixed(
          2
        )}%.`,
        action: "Public PE Sentiment in IC Memos berücksichtigen",
      });
    }

    if (peerAvg >= 2) {
      alerts.push({
        id: "pe-peer-strong",
        category: "Market",
        severity: "success",
        title: "PE Peers stark",
        message: `BX, KKR, APO und CG liegen im Schnitt bei +${peerAvg.toFixed(
          2
        )}%.`,
        action: "Exit Window und Fundraising-Sentiment prüfen",
      });
    }
  }

  Object.values(quotes)
    .filter(Boolean)
    .forEach((quote) => {
      const change = Number(quote.change) || 0;

      if (change <= -5) {
        alerts.push({
          id: `ticker-drop-${quote.symbol}`,
          category: "Market",
          severity: "critical",
          title: `${quote.symbol} stark negativ`,
          message: `${quote.name || quote.symbol} fällt um ${change.toFixed(2)}%.`,
          action: "Sektor- und Peer-Read-Through prüfen",
        });
      }

      if (change >= 5) {
        alerts.push({
          id: `ticker-jump-${quote.symbol}`,
          category: "Market",
          severity: "success",
          title: `${quote.symbol} stark positiv`,
          message: `${quote.name || quote.symbol} steigt um +${change.toFixed(2)}%.`,
          action: "Positive Marktimpulse für Vergleichsunternehmen prüfen",
        });
      }
    });
}

function buildPortfolioAlerts(alerts, portfolio) {
  portfolio.forEach((company) => {
    const revenue = Number(company.revenue) || 0;
    const ebitda = Number(company.ebitda) || 0;
    const irr = Number(company.irr) || 0;
    const moic = Number(company.moic) || 0;
    const margin = revenue > 0 ? (ebitda / revenue) * 100 : 0;

    if (irr < 15) {
      alerts.push({
        id: `irr-${company.id}`,
        category: "Portfolio",
        severity: "warning",
        title: "IRR unter Zielrendite",
        message: `${company.name} liegt bei ${irr.toFixed(1)}% IRR.`,
        action: "Performance Review einplanen",
      });
    }

    if (margin > 0 && margin < 15) {
      alerts.push({
        id: `margin-${company.id}`,
        category: "Portfolio",
        severity: "critical",
        title: "EBITDA-Marge niedrig",
        message: `${company.name} liegt bei ${margin.toFixed(1)}% EBITDA-Marge.`,
        action: "Margin Improvement Plan prüfen",
      });
    }

    if (moic >= 2.5) {
      alerts.push({
        id: `moic-${company.id}`,
        category: "Portfolio",
        severity: "success",
        title: "Exit-Kandidat",
        message: `${company.name} erreicht ${moic.toFixed(2)}x MOIC.`,
        action: "Exit Readiness prüfen",
      });
    }
  });
}

function buildDealAlerts(alerts, deals) {
  deals.forEach((deal) => {
    const score = Number(deal.score) || 0;

    if (score >= 80 && ["LOI", "Due Diligence"].includes(deal.status)) {
      alerts.push({
        id: `ic-${deal.id}`,
        category: "Deal",
        severity: "success",
        title: "IC Ready",
        message: `${deal.name} ist bereit für das Investment Committee.`,
        action: "IC Memo finalisieren",
      });
    }

    if (deal.priority === "High" && score < 60) {
      alerts.push({
        id: `deal-risk-${deal.id}`,
        category: "Deal",
        severity: "warning",
        title: "High Priority mit niedrigem Score",
        message: `${deal.name} ist High Priority, aber nur bei Score ${score}.`,
        action: "Deal Scoring überprüfen",
      });
    }
  });
}

function buildTaskAlerts(alerts, tasks) {
  tasks.forEach((task) => {
    if (task.status !== "Done") {
      alerts.push({
        id: `task-${task.id}`,
        category: "Task",
        severity: task.priority === "High" ? "critical" : "info",
        title: "Offene Aufgabe",
        message: `${task.title} · ${task.owner || "No owner"}`,
        action: task.deadline
          ? `Deadline: ${task.deadline}`
          : "Owner / Deadline prüfen",
      });
    }
  });
}

function severityRank(severity) {
  return {
    critical: 4,
    warning: 3,
    success: 2,
    info: 1,
  }[severity] || 0;
}

function AlertCard({ alert }) {
  const styles = {
    critical: {
      color: "var(--red)",
      label: "CRITICAL",
    },
    warning: {
      color: "var(--orange)",
      label: "WARNING",
    },
    success: {
      color: "var(--accent)",
      label: "POSITIVE",
    },
    info: {
      color: "var(--blue)",
      label: "INFO",
    },
  };

  const style = styles[alert.severity] || styles.info;

  return (
    <div
      className="market-card"
      style={{
        borderLeft: `4px solid ${style.color}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            color: style.color,
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: "0.08em",
          }}
        >
          {style.label}
        </div>

        <div className="muted" style={{ fontSize: 12 }}>
          {alert.category}
        </div>
      </div>

      <div className="market-card-name" style={{ fontSize: 18 }}>
        {alert.title}
      </div>

      <p className="muted" style={{ lineHeight: 1.6 }}>
        {alert.message}
      </p>

      <div
        style={{
          marginTop: 12,
          color: style.color,
          fontWeight: 800,
          fontSize: 13,
        }}
      >
        {alert.action}
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
    </div>
  );
}