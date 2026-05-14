import { useState } from "react";

export default function Settings() {
  const [importText, setImportText] = useState("");

  function exportBackup() {
    const data = {
      version: "1.1",
      exportedAt: new Date().toISOString(),
      portfolio: JSON.parse(localStorage.getItem("apex_portfolio") || "[]"),
      deals: JSON.parse(localStorage.getItem("apex_deals") || "[]"),
      watchlist: JSON.parse(localStorage.getItem("apex_market_watchlist") || "[]"),
      tasks: JSON.parse(localStorage.getItem("apex_tasks") || "[]"),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "apex-pe-backup.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  function importBackup() {
    try {
      const data = JSON.parse(importText);

      if (data.portfolio) {
        localStorage.setItem("apex_portfolio", JSON.stringify(data.portfolio));
      }

      if (data.deals) {
        localStorage.setItem("apex_deals", JSON.stringify(data.deals));
      }

      if (data.watchlist) {
        localStorage.setItem("apex_market_watchlist", JSON.stringify(data.watchlist));
      }

      if (data.tasks) {
        localStorage.setItem("apex_tasks", JSON.stringify(data.tasks));
      }

      alert("Backup importiert. Bitte App neu laden.");
    } catch {
      alert("Import fehlgeschlagen. JSON prüfen.");
    }
  }

  function clearLocalData() {
    if (!confirm("Alle lokalen App-Daten löschen?")) return;

    localStorage.removeItem("apex_portfolio");
    localStorage.removeItem("apex_deals");
    localStorage.removeItem("apex_market_watchlist");
    localStorage.removeItem("apex_tasks");

    alert("Lokale Daten gelöscht. Bitte App neu laden.");
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            APP <span>SETTINGS</span>
          </div>
          <div className="page-sub">Backup · Restore · lokale Daten</div>
        </div>
      </div>

      <div className="market-grid" style={{ marginBottom: 20 }}>
        <div className="market-card">
          <div className="card-title">Backup exportieren</div>
          <p className="muted">
            Exportiert Portfolio, Deal Pipeline, Watchlist und Tasks als JSON-Datei.
          </p>
          <button className="btn btn-primary" onClick={exportBackup}>
            BACKUP EXPORTIEREN
          </button>
        </div>

        <div className="market-card">
          <div className="card-title">Lokale Daten löschen</div>
          <p className="muted">
            Löscht gespeicherte lokale Daten aus diesem Browser.
          </p>
          <button className="btn btn-danger" onClick={clearLocalData}>
            DATEN LÖSCHEN
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Backup importieren</div>

        <textarea
          className="input"
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder="Backup JSON hier einfügen..."
          style={{
            minHeight: 220,
            width: "100%",
            resize: "vertical",
            fontFamily: "monospace",
          }}
        />

        <button
          className="btn btn-primary"
          onClick={importBackup}
          style={{ marginTop: 12 }}
        >
          BACKUP IMPORTIEREN
        </button>
      </div>
    </div>
  );
}