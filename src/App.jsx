import { useState, useEffect, useRef, useCallback } from "react";

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:        #0a0b0e;
      --surface:   #111318;
      --surface2:  #181c24;
      --border:    #1f2535;
      --accent:    #c8f542;
      --accent2:   #42f5c8;
      --red:       #f54242;
      --orange:    #f5a742;
      --text:      #e8eaf0;
      --muted:     #5a6175;
      --font-head: 'Bebas Neue', sans-serif;
      --font-mono: 'DM Mono', monospace;
      --font-body: 'DM Sans', sans-serif;
    }
    body { background: var(--bg); color: var(--text); font-family: var(--font-body); font-size: 14px; line-height: 1.5; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
    .app { display: grid; grid-template-columns: 220px 1fr; grid-template-rows: 56px 1fr; min-height: 100vh; }
    .topbar { grid-column: 1 / -1; background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 24px; gap: 16px; position: sticky; top: 0; z-index: 100; }
    .topbar-logo { font-family: var(--font-head); font-size: 22px; letter-spacing: 2px; color: var(--accent); flex: 1; }
    .topbar-logo span { color: var(--muted); font-size: 13px; font-family: var(--font-mono); letter-spacing: 0; margin-left: 8px; }
    .badge { font-family: var(--font-mono); font-size: 11px; padding: 3px 10px; border-radius: 3px; border: 1px solid; }
    .badge-green { border-color: var(--accent); color: var(--accent); background: rgba(200,245,66,.08); }
    .badge-blue  { border-color: var(--accent2); color: var(--accent2); background: rgba(66,245,200,.08); }
    .badge-red   { border-color: var(--red); color: var(--red); background: rgba(245,66,66,.08); }
    .sidebar { background: var(--surface); border-right: 1px solid var(--border); padding: 20px 0; display: flex; flex-direction: column; gap: 4px; position: sticky; top: 56px; height: calc(100vh - 56px); overflow-y: auto; }
    .nav-section { padding: 16px 16px 4px; font-family: var(--font-mono); font-size: 10px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 16px; cursor: pointer; color: var(--muted); font-size: 13px; font-weight: 500; border-left: 2px solid transparent; transition: all .15s; user-select: none; }
    .nav-item:hover { color: var(--text); background: var(--surface2); }
    .nav-item.active { color: var(--accent); border-left-color: var(--accent); background: rgba(200,245,66,.05); }
    .nav-icon { font-size: 15px; width: 18px; text-align: center; }
    .main { padding: 28px; overflow-y: auto; }
    .page-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px; }
    .page-title { font-family: var(--font-head); font-size: 36px; letter-spacing: 2px; color: var(--text); line-height: 1; }
    .page-title span { color: var(--accent); }
    .page-sub { font-family: var(--font-mono); font-size: 11px; color: var(--muted); margin-top: 4px; }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 20px; }
    .card-title { font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
    .kpi-card { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 18px 20px; position: relative; overflow: hidden; }
    .kpi-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
    .kpi-card.green::before { background: var(--accent); }
    .kpi-card.blue::before  { background: var(--accent2); }
    .kpi-card.red::before   { background: var(--red); }
    .kpi-card.orange::before { background: var(--orange); }
    .kpi-label { font-family: var(--font-mono); font-size: 10px; color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px; }
    .kpi-value { font-family: var(--font-head); font-size: 34px; color: var(--text); line-height: 1; }
    .kpi-delta { font-family: var(--font-mono); font-size: 11px; margin-top: 6px; }
    .delta-pos { color: var(--accent); }
    .delta-neg { color: var(--red); }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    .grid-65-35 { display: grid; grid-template-columns: 1.8fr 1fr; gap: 16px; margin-bottom: 16px; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { font-family: var(--font-mono); font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--border); }
    .table td { padding: 11px 12px; border-bottom: 1px solid rgba(31,37,53,.5); font-size: 13px; }
    .table tr:last-child td { border-bottom: none; }
    .table tr:hover td { background: var(--surface2); }
    .table .mono { font-family: var(--font-mono); font-size: 12px; }
    .table .green { color: var(--accent); }
    .table .red   { color: var(--red); }
    .table .blue  { color: var(--accent2); }
    .table .orange { color: var(--orange); }
    .table .bold  { font-weight: 600; }
    .score-bar { display: flex; align-items: center; gap: 8px; }
    .score-track { flex: 1; height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; }
    .score-fill  { height: 100%; border-radius: 2px; transition: width .6s ease; }
    .pill { display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-mono); font-size: 11px; padding: 3px 9px; border-radius: 2px; font-weight: 500; }
    .pill-green  { background: rgba(200,245,66,.12); color: var(--accent); }
    .pill-red    { background: rgba(245,66,66,.12);  color: var(--red); }
    .pill-blue   { background: rgba(66,245,200,.12); color: var(--accent2); }
    .pill-orange { background: rgba(245,167,66,.12); color: var(--orange); }
    .pill-gray   { background: var(--surface2); color: var(--muted); }
    .dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
    .btn { font-family: var(--font-mono); font-size: 12px; letter-spacing: 1px; padding: 8px 18px; border: 1px solid; border-radius: 3px; cursor: pointer; transition: all .15s; background: transparent; }
    .btn-primary { border-color: var(--accent); color: var(--accent); }
    .btn-primary:hover { background: var(--accent); color: #000; }
    .btn-ghost { border-color: var(--border); color: var(--muted); }
    .btn-ghost:hover { border-color: var(--text); color: var(--text); }
    .btn-danger { border-color: var(--red); color: var(--red); }
    .btn-danger:hover { background: var(--red); color: #fff; }
    .btn-sm { padding: 5px 12px; font-size: 11px; }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .input { background: var(--surface2); border: 1px solid var(--border); color: var(--text); font-family: var(--font-body); font-size: 13px; padding: 8px 12px; border-radius: 3px; width: 100%; outline: none; transition: border-color .15s; }
    .input:focus { border-color: var(--accent); }
    .input::placeholder { color: var(--muted); }
    select.input { cursor: pointer; }
    .form-group { margin-bottom: 14px; }
    .form-label { font-family: var(--font-mono); font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; display: block; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .sparkline { display: flex; align-items: flex-end; gap: 3px; height: 40px; }
    .spark-bar { flex: 1; border-radius: 2px 2px 0 0; min-height: 4px; }
    .divider { border: none; border-top: 1px solid var(--border); margin: 20px 0; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.75); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
    .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; width: 560px; max-height: 90vh; overflow-y: auto; padding: 28px; }
    .modal-title { font-family: var(--font-head); font-size: 24px; letter-spacing: 2px; margin-bottom: 20px; color: var(--accent); }
    .modal-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
    .chat-wrap { display: flex; flex-direction: column; height: 500px; }
    .chat-messages { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding: 4px 0; }
    .msg { max-width: 88%; padding: 10px 14px; border-radius: 4px; font-size: 13px; line-height: 1.6; white-space: pre-wrap; }
    .msg-ai { background: var(--surface2); border: 1px solid var(--border); align-self: flex-start; }
    .msg-user { background: rgba(200,245,66,.1); border: 1px solid rgba(200,245,66,.25); align-self: flex-end; color: var(--accent); }
    .chat-input-row { display: flex; gap: 10px; margin-top: 14px; }
    .chat-input { flex: 1; }
    .typing { display: flex; gap: 4px; align-items: center; padding: 10px 14px; }
    .typing span { width: 6px; height: 6px; border-radius: 50%; background: var(--muted); animation: bounce .9s infinite; }
    .typing span:nth-child(2) { animation-delay: .15s; }
    .typing span:nth-child(3) { animation-delay: .3s; }
    @keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }
    .progress-row { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
    .progress-header { display: flex; justify-content: space-between; }
    .progress-label { font-size: 12px; color: var(--text); }
    .progress-val { font-family: var(--font-mono); font-size: 11px; color: var(--muted); }
    .progress-track { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 3px; transition: width .6s; }
    .tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
    .tab { font-family: var(--font-mono); font-size: 11px; letter-spacing: 1px; text-transform: uppercase; padding: 10px 18px; cursor: pointer; color: var(--muted); border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all .15s; }
    .tab:hover { color: var(--text); }
    .tab.active { color: var(--accent); border-bottom-color: var(--accent); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    .fade-in { animation: fadeIn .35s ease forwards; }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
    .live { animation: pulse 2s infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .spin { animation: spin 1s linear infinite; display: inline-block; }

    /* ── FINNHUB MARKET DATA STYLES ── */
    .market-ticker-bar { background: var(--surface2); border-bottom: 1px solid var(--border); padding: 6px 24px; display: flex; gap: 24px; overflow-x: auto; white-space: nowrap; }
    .ticker-item { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 11px; }
    .ticker-sym { color: var(--muted); }
    .ticker-price { color: var(--text); font-weight: 500; }
    .ticker-chg-pos { color: var(--accent); }
    .ticker-chg-neg { color: var(--red); }
    .api-key-banner { background: rgba(245,167,66,.08); border: 1px solid rgba(245,167,66,.3); border-radius: 4px; padding: 14px 18px; margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
    .api-key-banner-text { flex: 1; font-size: 12px; color: var(--orange); }
    .market-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
    .market-card { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 16px; position: relative; cursor: pointer; transition: border-color .15s; }
    .market-card:hover { border-color: var(--accent); }
    .market-card.selected { border-color: var(--accent); background: rgba(200,245,66,.04); }
    .market-card-sym { font-family: var(--font-mono); font-size: 10px; color: var(--muted); letter-spacing: 2px; margin-bottom: 6px; }
    .market-card-name { font-size: 12px; color: var(--text); margin-bottom: 10px; font-weight: 500; }
    .market-card-price { font-family: var(--font-head); font-size: 28px; line-height: 1; }
    .market-card-change { font-family: var(--font-mono); font-size: 11px; margin-top: 5px; }
    .market-card-sparkline { margin-top: 10px; }
    .candle-chart { display: flex; align-items: flex-end; gap: 2px; height: 80px; margin-top: 8px; }
    .candle-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; height: 100%; }
    .candle-body { width: 60%; border-radius: 1px; min-height: 2px; }
    .candle-wick { width: 1px; background: var(--muted); position: absolute; }
    .news-item { padding: 12px 0; border-bottom: 1px solid rgba(31,37,53,.5); }
    .news-item:last-child { border-bottom: none; }
    .news-headline { font-size: 12px; color: var(--text); line-height: 1.4; margin-bottom: 4px; cursor: pointer; }
    .news-headline:hover { color: var(--accent); }
    .news-meta { font-family: var(--font-mono); font-size: 10px; color: var(--muted); }
    .sentiment-bar { display: flex; height: 6px; border-radius: 3px; overflow: hidden; margin: 8px 0; }
    .sentiment-bull { background: var(--accent); }
    .sentiment-bear { background: var(--red); }
    .sentiment-neutral { background: var(--muted); }
    .refresh-row { display: flex; align-items: center; gap: 10px; }
    .last-update { font-family: var(--font-mono); font-size: 10px; color: var(--muted); }
  `}</style>
);

// ─── STATIC DATA ─────────────────────────────────────────────────────────────
const initialFund = {
  name: "APEX CAPITAL FUND I",
  vintage: 2022,
  aum: 120,
  dryPowder: 34,
  deployed: 86,
  irr: 24.3,
  moic: 1.87,
  dpi: 0.42,
};

const initialPortfolio = [
  { id: 1, name: "TechOps GmbH",   sector: "Managed IT",    status: "Active", entry: 2022, ebitda: 4.2, revenue: 22, entryMultiple: 7.8, currentMultiple: 9.4,  equity: 12, irr: 31.2, moic: 1.94, score: 82, stage: "Hold",     notes: "Starke Wiederkehrende Umsätze. EBITDA-Expansion läuft.", aiScore: 88 },
  { id: 2, name: "MedServ AG",      sector: "Healthcare",    status: "Active", entry: 2022, ebitda: 6.8, revenue: 38, entryMultiple: 9.2, currentMultiple: 11.1, equity: 18, irr: 22.4, moic: 1.72, score: 74, stage: "Scale",    notes: "Roll-up von 3 Kliniken in Q2 2024. Synergien realisiert.", aiScore: 61 },
  { id: 3, name: "LogiStar GmbH",   sector: "Logistik",      status: "Active", entry: 2023, ebitda: 2.9, revenue: 18, entryMultiple: 6.5, currentMultiple: 7.8,  equity: 8,  irr: 18.7, moic: 1.43, score: 61, stage: "Optimize", notes: "Margen unter Druck. Kostenreduktion eingeleitet.", aiScore: 74 },
  { id: 4, name: "Dental Gruppe",   sector: "Dental",        status: "Active", entry: 2023, ebitda: 3.4, revenue: 14, entryMultiple: 8.1, currentMultiple: 10.2, equity: 10, irr: 28.9, moic: 1.88, score: 78, stage: "Roll-up",  notes: "4 Praxen akquiriert. Ziel: 12 bis Exit.", aiScore: 45 },
  { id: 5, name: "CloudSec Ltd.",   sector: "Cybersecurity", status: "Active", entry: 2024, ebitda: 1.8, revenue: 9,  entryMultiple: 11.2, currentMultiple: 13.5, equity: 8, irr: 41.2, moic: 1.32, score: 89, stage: "Scale",    notes: "ARR-Wachstum 78% YoY. Marktführer in Nische.", aiScore: 95 },
  { id: 6, name: "HVAC Masters",    sector: "Gebäude",       status: "Exit",   entry: 2021, ebitda: 5.1, revenue: 26, entryMultiple: 6.0, currentMultiple: 8.8,  equity: 14, irr: 33.6, moic: 2.41, score: 91, stage: "Sold",     notes: "Verkauft an Stratege Q1 2024. 2.41x MOIC realisiert.", aiScore: 52 },
];

const initialDeals = [
  { id: 1, name: "Phamex Pharma Services", sector: "Healthcare",     revenue: 31, ebitda: 5.8,  margin: 18.7, multiple: 9.5,  status: "LOI",             score: 86, priority: "High" },
  { id: 2, name: "DataCenter Nord",        sector: "Infrastruktur",  revenue: 48, ebitda: 14.2, margin: 29.6, multiple: 12.1, status: "Screening",       score: 79, priority: "High" },
  { id: 3, name: "Compliance360",          sector: "Compliance SaaS",revenue: 12, ebitda: 3.1,  margin: 25.8, multiple: 10.8, status: "NDA",             score: 72, priority: "Medium" },
  { id: 4, name: "AutoRepair Gruppe",      sector: "Auto-Services",  revenue: 22, ebitda: 3.8,  margin: 17.3, multiple: 7.2,  status: "Screening",       score: 58, priority: "Low" },
  { id: 5, name: "EduTech Solutions",      sector: "Education SaaS", revenue: 8,  ebitda: 1.9,  margin: 23.8, multiple: 13.4, status: "Initial Contact", score: 68, priority: "Medium" },
];

// Relevante Benchmark-Ticker für PE-Manager (öffentliche Comps & Makro)
const WATCH_SYMBOLS = [
  { sym: "SPY",  name: "S&P 500 ETF",       relevance: "Macro Benchmark" },
  { sym: "BX",   name: "Blackstone",         relevance: "PE Peer" },
  { sym: "KKR",  name: "KKR & Co.",          relevance: "PE Peer" },
  { sym: "APO",  name: "Apollo Global",      relevance: "PE Peer" },
  { sym: "CG",   name: "Carlyle Group",      relevance: "PE Peer" },
  { sym: "HYG",  name: "High Yield Bond ETF",relevance: "Debt Market" },
  { sym: "IWM",  name: "Russell 2000 ETF",   relevance: "Small Cap" },
  { sym: "LQD",  name: "Corp Bond ETF",      relevance: "Credit Market" },
  { sym: "VIX",  name: "Volatility Index",   relevance: "Risk Gauge" },
];

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
function Sparkline({ data, color }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  return (
    <div className="sparkline">
      {data.map((v, i) => (
        <div key={i} className="spark-bar"
          style={{ height: `${((v - min) / range) * 85 + 15}%`, background: color }} />
      ))}
    </div>
  );
}

function ProgressBar({ label, value, max = 100, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="progress-row">
      <div className="progress-header">
        <span className="progress-label">{label}</span>
        <span className="progress-val">{value}{max === 100 ? "%" : "x"}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color || "var(--accent)" }} />
      </div>
    </div>
  );
}

function ScoreBar({ value }) {
  const color = value >= 80 ? "var(--accent)" : value >= 60 ? "var(--orange)" : "var(--red)";
  return (
    <div className="score-bar">
      <div className="score-track">
        <div className="score-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color, minWidth: "28px" }}>{value}</span>
    </div>
  );
}

function Pill({ type, children }) {
  return <span className={`pill pill-${type}`}><span className="dot" />{children}</span>;
}

function Spinner() {
  return <span className="spin" style={{ fontSize: 14 }}>⟳</span>;
}

// ─── FINNHUB API HOOK ────────────────────────────────────────────────────────
function useFinnhub(apiKey) {
  const [quotes, setQuotes]         = useState({});
  const [candles, setCandles]       = useState({});
  const [news, setNews]             = useState([]);
  const [loading, setLoading]       = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError]           = useState(null);

  const BASE = "https://finnhub.io/api/v1";

  const fetchQuote = useCallback(async (sym) => {
    const r = await fetch(`${BASE}/quote?symbol=${sym}&token=${apiKey}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const d = await r.json();
    return { c: d.c, pc: d.pc, dp: d.dp, h: d.h, l: d.l, o: d.o };
  }, [apiKey]);

  const fetchCandles = useCallback(async (sym) => {
    const to   = Math.floor(Date.now() / 1000);
    const from = to - 30 * 24 * 3600; // 30 days
    const r = await fetch(`${BASE}/stock/candle?symbol=${sym}&resolution=D&from=${from}&to=${to}&token=${apiKey}`);
    const d = await r.json();
    if (d.s === "ok") return d.c; // closing prices
    return [];
  }, [apiKey]);

  const fetchNews = useCallback(async () => {
    const today = new Date().toISOString().slice(0, 10);
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    const r = await fetch(`${BASE}/news?category=merger&from=${weekAgo}&to=${today}&token=${apiKey}`);
    const d = await r.json();
    return Array.isArray(d) ? d.slice(0, 12) : [];
  }, [apiKey]);

  const refresh = useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch all quotes in parallel
      const quoteResults = await Promise.allSettled(
        WATCH_SYMBOLS.map(({ sym }) => fetchQuote(sym).then(q => ({ sym, q })))
      );
      const newQuotes = {};
      quoteResults.forEach(r => {
        if (r.status === "fulfilled") newQuotes[r.value.sym] = r.value.q;
      });
      setQuotes(newQuotes);

      // Fetch candles for first 6 symbols (rate limit friendly)
      const candleResults = await Promise.allSettled(
        WATCH_SYMBOLS.slice(0, 6).map(({ sym }) => fetchCandles(sym).then(c => ({ sym, c })))
      );
      const newCandles = {};
      candleResults.forEach(r => {
        if (r.status === "fulfilled") newCandles[r.value.sym] = r.value.c;
      });
      setCandles(newCandles);

      // News
      const newsData = await fetchNews();
      setNews(newsData);

      setLastUpdate(new Date());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [apiKey, fetchQuote, fetchCandles, fetchNews]);

  // Auto-refresh every 60 seconds when API key is set
  useEffect(() => {
    if (!apiKey) return;
    refresh();
    const interval = setInterval(refresh, 60000);
    return () => clearInterval(interval);
  }, [apiKey, refresh]);

  return { quotes, candles, news, loading, lastUpdate, error, refresh };
}

// ─── MARKET DATA PAGE ────────────────────────────────────────────────────────
function MarktDaten({ finnhubKey, setFinnhubKey }) {
  const [tempKey, setTempKey]       = useState(finnhubKey || "");
  const [selectedSym, setSelectedSym] = useState("BX");
  const [tab, setTab]               = useState("overview");
  const { quotes, candles, news, loading, lastUpdate, error, refresh } = useFinnhub(finnhubKey);

  const handleSaveKey = () => setFinnhubKey(tempKey.trim());

  const formatChg = (dp) => {
    if (dp == null) return "—";
    const sign = dp >= 0 ? "+" : "";
    return `${sign}${dp.toFixed(2)}%`;
  };

  const selectedQuote = quotes[selectedSym];
  const selectedCandle = candles[selectedSym] || [];
  const selectedInfo = WATCH_SYMBOLS.find(s => s.sym === selectedSym);

  // Simple PE multiple relevance computation
  const peMultipleTrend = selectedSym === "BX" || selectedSym === "KKR" || selectedSym === "APO" || selectedSym === "CG";

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">MARKT <span>DATEN</span></div>
          <div className="page-sub">Live via Finnhub · PE Benchmarks & Makro · Auto-Refresh 60s</div>
        </div>
        <div className="refresh-row">
          {lastUpdate && (
            <span className="last-update">
              Zuletzt: {lastUpdate.toLocaleTimeString("de-DE")}
            </span>
          )}
          <button className="btn btn-ghost btn-sm" onClick={refresh} disabled={loading || !finnhubKey}>
            {loading ? <Spinner /> : "⟳ REFRESH"}
          </button>
        </div>
      </div>

      {/* API KEY SETUP */}
      {!finnhubKey ? (
        <div className="api-key-banner">
          <span style={{ fontSize: 18 }}>🔑</span>
          <div className="api-key-banner-text">
            <strong>Finnhub API-Key erforderlich</strong> — Kostenlosen Key unter <strong>finnhub.io</strong> holen, dann hier eingeben.
          </div>
          <input
            className="input"
            style={{ width: 260 }}
            placeholder="sk_xxxxxxxxxxxxxxxx"
            value={tempKey}
            onChange={e => setTempKey(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSaveKey()}
          />
          <button className="btn btn-primary btn-sm" onClick={handleSaveKey}>SPEICHERN</button>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span className="badge badge-green">● API VERBUNDEN</span>
          {error && <span className="badge badge-red">⚠ {error}</span>}
          <button className="btn btn-ghost btn-sm" onClick={() => { setFinnhubKey(""); setTempKey(""); }}>
            KEY ÄNDERN
          </button>
        </div>
      )}

      {/* LIVE TICKER MARQUEE */}
      {finnhubKey && Object.keys(quotes).length > 0 && (
        <div className="market-ticker-bar" style={{ marginBottom: 20 }}>
          {WATCH_SYMBOLS.map(({ sym }) => {
            const q = quotes[sym];
            if (!q) return null;
            const pos = q.dp >= 0;
            return (
              <span key={sym} className="ticker-item">
                <span className="ticker-sym">{sym}</span>
                <span className="ticker-price">${q.c?.toFixed(2)}</span>
                <span className={pos ? "ticker-chg-pos" : "ticker-chg-neg"}>{formatChg(q.dp)}</span>
                <span style={{ color: "var(--border)", margin: "0 4px" }}>|</span>
              </span>
            );
          })}
          {loading && <span style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: 11 }}><Spinner /> Aktualisiere...</span>}
        </div>
      )}

      {/* MARKET CARDS GRID */}
      <div className="market-grid">
        {WATCH_SYMBOLS.map(({ sym, name, relevance }) => {
          const q = quotes[sym];
          const c = candles[sym] || [];
          const pos = q ? q.dp >= 0 : true;
          const color = pos ? "var(--accent)" : "var(--red)";
          return (
            <div
              key={sym}
              className={`market-card ${selectedSym === sym ? "selected" : ""}`}
              onClick={() => setSelectedSym(sym)}
            >
              <div className="market-card-sym">{sym} · {relevance}</div>
              <div className="market-card-name">{name}</div>
              {q ? (
                <>
                  <div className="market-card-price" style={{ color }}>
                    ${q.c?.toFixed(2) ?? "—"}
                  </div>
                  <div className="market-card-change" style={{ color }}>
                    {formatChg(q.dp)} &nbsp;
                    <span style={{ color: "var(--muted)" }}>
                      H: ${q.h?.toFixed(2)} · L: ${q.l?.toFixed(2)}
                    </span>
                  </div>
                  {c.length > 0 && (
                    <div className="market-card-sparkline">
                      <Sparkline data={c.slice(-20)} color={color} />
                    </div>
                  )}
                </>
              ) : (
                <div style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: 12, marginTop: 8 }}>
                  {finnhubKey ? (loading ? "Lade..." : "Keine Daten") : "API-Key fehlt"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* DETAIL PANEL */}
      <div className="grid-65-35">
        <div className="card">
          <div className="tabs">
            {["overview", "chart", "news"].map(t => (
              <div key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                {t === "overview" ? "ÜBERSICHT" : t === "chart" ? "KURSVERLAUF" : "NACHRICHTEN"}
              </div>
            ))}
          </div>

          {tab === "overview" && selectedQuote && (
            <div>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 28, color: "var(--accent)", marginBottom: 16 }}>
                {selectedInfo?.name} <span style={{ color: "var(--muted)", fontSize: 16 }}>{selectedSym}</span>
              </div>
              <div className="grid-2" style={{ marginBottom: 0 }}>
                {[
                  ["Aktuell",       `$${selectedQuote.c?.toFixed(2)}`],
                  ["Vortag",        `$${selectedQuote.pc?.toFixed(2)}`],
                  ["Veränderung",   formatChg(selectedQuote.dp)],
                  ["Tageshoch",     `$${selectedQuote.h?.toFixed(2)}`],
                  ["Tagestief",     `$${selectedQuote.l?.toFixed(2)}`],
                  ["Eröffnung",     `$${selectedQuote.o?.toFixed(2)}`],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "9px 12px", background: "var(--surface2)", borderRadius: 3 }}>
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>{l}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: l === "Veränderung" ? (selectedQuote.dp >= 0 ? "var(--accent)" : "var(--red)") : "var(--text)" }}>{v}</span>
                  </div>
                ))}
              </div>
              {peMultipleTrend && (
                <div style={{ marginTop: 16, padding: "12px 14px", background: "rgba(200,245,66,.05)", border: "1px solid rgba(200,245,66,.15)", borderRadius: 3 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", marginBottom: 4 }}>PE RELEVANZ</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
                    {selectedSym}-Kurs beeinflusst PE-Fundraising-Multiples und LP-Stimmung. 
                    Trend: <span style={{ color: selectedQuote.dp >= 0 ? "var(--accent)" : "var(--red)" }}>
                      {selectedQuote.dp >= 0 ? "Positives Marktumfeld für PE-Exits" : "Vorsicht bei Exit-Timing empfohlen"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "chart" && (
            <div>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 18, color: "var(--text)", marginBottom: 12 }}>
                {selectedSym} — 30-Tage Kursverlauf
              </div>
              {selectedCandle.length > 0 ? (
                <div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 160, padding: "8px 0" }}>
                    {selectedCandle.slice(-30).map((c, i, arr) => {
                      const min = Math.min(...arr);
                      const max = Math.max(...arr);
                      const range = max - min || 1;
                      const h = ((c - min) / range) * 140 + 10;
                      const isUp = i === 0 || c >= arr[i - 1];
                      return (
                        <div key={i} style={{
                          flex: 1,
                          height: `${h}px`,
                          background: isUp ? "var(--accent)" : "var(--red)",
                          opacity: 0.75,
                          borderRadius: "2px 2px 0 0",
                          minHeight: 4,
                        }} title={`$${c.toFixed(2)}`} />
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", marginTop: 4 }}>
                    <span>-30T</span>
                    <span>-20T</span>
                    <span>-10T</span>
                    <span>Heute</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                    {(() => {
                      const arr = selectedCandle.slice(-30);
                      const min = Math.min(...arr).toFixed(2);
                      const max = Math.max(...arr).toFixed(2);
                      const start = arr[0];
                      const end = arr[arr.length - 1];
                      const perf = ((end - start) / start * 100).toFixed(2);
                      const pos = perf >= 0;
                      return [
                        ["30T Min", `$${min}`, "var(--red)"],
                        ["30T Max", `$${max}`, "var(--accent)"],
                        ["30T Perf.", `${pos ? "+" : ""}${perf}%`, pos ? "var(--accent)" : "var(--red)"],
                      ].map(([l, v, c]) => (
                        <div key={l} style={{ flex: 1, padding: "10px", background: "var(--surface2)", borderRadius: 3, textAlign: "center" }}>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", marginBottom: 4 }}>{l}</div>
                          <div style={{ fontFamily: "var(--font-head)", fontSize: 22, color: c }}>{v}</div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              ) : (
                <div style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: 12, padding: "30px 0", textAlign: "center" }}>
                  {finnhubKey ? (loading ? "Lade Kursdaten..." : "Keine Chartdaten verfügbar") : "API-Key erforderlich"}
                </div>
              )}
            </div>
          )}

          {tab === "news" && (
            <div>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 18, color: "var(--text)", marginBottom: 12 }}>
                M&A & PE Nachrichten — letzte 7 Tage
              </div>
              {news.length > 0 ? news.map((n, i) => (
                <div key={i} className="news-item">
                  <div className="news-headline" onClick={() => window.open(n.url, "_blank")}>{n.headline}</div>
                  <div className="news-meta">
                    {n.source} · {new Date(n.datetime * 1000).toLocaleDateString("de-DE")}
                    {n.summary && (
                      <span style={{ color: "var(--muted)", marginLeft: 8, fontSize: 10 }}>
                        {n.summary.slice(0, 80)}...
                      </span>
                    )}
                  </div>
                </div>
              )) : (
                <div style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: 12, padding: "30px 0", textAlign: "center" }}>
                  {finnhubKey ? (loading ? "Lade Nachrichten..." : "Keine aktuellen Nachrichten") : "API-Key erforderlich"}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT PANEL — PE Market Intelligence */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card">
            <div className="card-title">PE Markt-Sentiment</div>
            {[
              { label: "Buyout Activity",   bull: 62, bear: 38 },
              { label: "Exit-Klima",        bull: 55, bear: 45 },
              { label: "Debt Availability", bull: 70, bear: 30 },
              { label: "LP Commitment",     bull: 68, bear: 32 },
            ].map(({ label, bull, bear }) => (
              <div key={label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12 }}>{label}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: bull >= 60 ? "var(--accent)" : "var(--orange)" }}>{bull}% bullish</span>
                </div>
                <div className="sentiment-bar">
                  <div className="sentiment-bull" style={{ width: `${bull}%` }} />
                  <div className="sentiment-bear" style={{ width: `${bear}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title">PE Peer Performance</div>
            {["BX", "KKR", "APO", "CG"].map(sym => {
              const q = quotes[sym];
              const info = WATCH_SYMBOLS.find(s => s.sym === sym);
              return (
                <div key={sym} onClick={() => setSelectedSym(sym)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)" }}>{sym}</div>
                    <div style={{ fontSize: 12 }}>{info?.name}</div>
                  </div>
                  {q ? (
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>${q.c?.toFixed(2)}</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: q.dp >= 0 ? "var(--accent)" : "var(--red)" }}>
                        {formatChg(q.dp)}
                      </div>
                    </div>
                  ) : (
                    <span style={{ color: "var(--muted)", fontSize: 11 }}>—</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="card">
            <div className="card-title">Kredit-Indikatoren</div>
            {["HYG", "LQD"].map(sym => {
              const q = quotes[sym];
              const info = WATCH_SYMBOLS.find(s => s.sym === sym);
              return (
                <div key={sym} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12 }}>{info?.name}</span>
                    {q && <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: q.dp >= 0 ? "var(--accent)" : "var(--red)" }}>{formatChg(q.dp)}</span>}
                  </div>
                  <ProgressBar label={sym} value={q ? Math.min(Math.max(50 + (q.dp || 0) * 5, 0), 100) : 50} color={q && q.dp >= 0 ? "var(--accent)" : "var(--red)"} />
                </div>
              );
            })}
            <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
              Hohe HYG / LQD → Günstiges LBO-Umfeld
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ fund, portfolio, quotes }) {
  const active = portfolio.filter(p => p.status === "Active");
  const avgIrr  = (active.reduce((s, p) => s + p.irr,  0) / active.length).toFixed(1);
  const avgMoic = (active.reduce((s, p) => s + p.moic, 0) / active.length).toFixed(2);
  const totalEquity = active.reduce((s, p) => s + p.equity, 0);

  const bxQuote = quotes["BX"];
  const spyQuote = quotes["SPY"];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title"><span>{fund.name}</span></div>
          <div className="page-sub">Vintage {fund.vintage} · Fund Manager Dashboard</div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {bxQuote && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: bxQuote.dp >= 0 ? "var(--accent)" : "var(--red)" }}>
              BX ${bxQuote.c?.toFixed(2)} ({bxQuote.dp >= 0 ? "+" : ""}{bxQuote.dp?.toFixed(2)}%)
            </span>
          )}
          <span className="live" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent)" }}>LIVE</span>
        </div>
      </div>

      <div className="kpi-grid">
        {[
          { label: "AUM",            value: `€${fund.aum}M`,  delta: "+12% YTD",            color: "green",  bars: [80,88,95,100,108,115,120] },
          { label: "Gross IRR",      value: `${fund.irr}%`,   delta: "+2.1pp vs. Benchmark", color: "green",  bars: [14,17,19,21,22,24,24.3] },
          { label: "MOIC Portfolio", value: `${avgMoic}x`,    delta: "Ziel: 2.5x",           color: "blue",   bars: [1.1,1.3,1.5,1.65,1.75,1.83,1.87] },
          { label: "Dry Powder",     value: `€${fund.dryPowder}M`, delta: "2 Deals in Pipeline", color: "orange", bars: [120,110,95,80,65,42,34] },
        ].map(k => (
          <div key={k.label} className={`kpi-card ${k.color}`}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-delta" style={{ color: k.color === "orange" ? "var(--orange)" : k.color === "blue" ? "var(--accent2)" : "var(--accent)" }}>{k.delta}</div>
            <div style={{ marginTop: 10 }}>
              <Sparkline data={k.bars} color={k.color === "orange" ? "var(--orange)" : k.color === "blue" ? "var(--accent2)" : "var(--accent)"} />
            </div>
          </div>
        ))}
      </div>

      {/* S&P context bar wenn Marktdaten vorhanden */}
      {spyQuote && (
        <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 4, padding: "10px 16px", marginBottom: 16, display: "flex", gap: 24, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", letterSpacing: 1 }}>MARKT-KONTEXT</span>
          {["SPY", "BX", "KKR", "HYG"].map(sym => {
            const q = quotes[sym];
            if (!q) return null;
            return (
              <span key={sym} style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
                <span style={{ color: "var(--muted)" }}>{sym} </span>
                <span>${q.c?.toFixed(2)} </span>
                <span style={{ color: q.dp >= 0 ? "var(--accent)" : "var(--red)" }}>
                  {q.dp >= 0 ? "+" : ""}{q.dp?.toFixed(2)}%
                </span>
              </span>
            );
          })}
        </div>
      )}

      <div className="grid-65-35">
        <div className="card">
          <div className="card-title">Portfolio Companies — Übersicht</div>
          <table className="table">
            <thead>
              <tr>
                <th>Unternehmen</th><th>Sektor</th><th>IRR</th><th>MOIC</th><th>Score</th><th>Stage</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map(p => (
                <tr key={p.id}>
                  <td className="bold">{p.name}</td>
                  <td style={{ color: "var(--muted)" }}>{p.sector}</td>
                  <td className="mono green">{p.irr}%</td>
                  <td className="mono blue">{p.moic}x</td>
                  <td style={{ minWidth: 100 }}><ScoreBar value={p.score} /></td>
                  <td>
                    <Pill type={p.stage === "Sold" ? "gray" : p.stage === "Roll-up" ? "blue" : p.stage === "Scale" ? "green" : "orange"}>
                      {p.stage}
                    </Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-title">Kapitalallokation</div>
            <ProgressBar label="Deployed"   value={fund.deployed}        max={fund.aum} color="var(--accent)" />
            <ProgressBar label="Dry Powder" value={fund.dryPowder}       max={fund.aum} color="var(--accent2)" />
            <ProgressBar label="Avg. IRR"   value={parseFloat(avgIrr)}   max={40}       color="var(--orange)" />
          </div>
          <div className="card">
            <div className="card-title">Sektor-Mix (Equity €M)</div>
            {Object.entries(
              active.reduce((acc, p) => { acc[p.sector] = (acc[p.sector] || 0) + p.equity; return acc; }, {})
            ).map(([s, v]) => (
              <ProgressBar key={s} label={s} value={Math.round((v / totalEquity) * 100)} color="var(--accent2)" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PORTFOLIO ────────────────────────────────────────────────────────────────
function Portfolio({ portfolio, setPortfolio }) {
  const [selected, setSelected] = useState(null);
  const [tab, setTab]           = useState("overview");
  const [showAdd, setShowAdd]   = useState(false);
  const [newCo, setNewCo]       = useState({ name: "", sector: "", revenue: "", ebitda: "", equity: "", entryMultiple: "", irr: "", moic: "" });

  const addCompany = () => {
    if (!newCo.name) return;
    setPortfolio(prev => [...prev, {
      id: Date.now(), ...newCo,
      revenue:       parseFloat(newCo.revenue)       || 0,
      ebitda:        parseFloat(newCo.ebitda)        || 0,
      equity:        parseFloat(newCo.equity)        || 0,
      entryMultiple: parseFloat(newCo.entryMultiple) || 0,
      currentMultiple: parseFloat(newCo.entryMultiple) || 0,
      irr:  parseFloat(newCo.irr)  || 0,
      moic: parseFloat(newCo.moic) || 1,
      status: "Active", stage: "Optimize", entry: new Date().getFullYear(),
      score: 65, aiScore: 60, notes: "",
    }]);
    setShowAdd(false);
    setNewCo({ name: "", sector: "", revenue: "", ebitda: "", equity: "", entryMultiple: "", irr: "", moic: "" });
  };

  const sel = selected ? portfolio.find(p => p.id === selected) : null;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">PORTFOLIO <span>MANAGEMENT</span></div>
          <div className="page-sub">{portfolio.filter(p => p.status === "Active").length} aktive Beteiligungen · {portfolio.filter(p => p.status === "Exit").length} Exits</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ BETEILIGUNG HINZUFÜGEN</button>
      </div>

      <div className="grid-65-35">
        <div className="card">
          <div className="card-title">Portfolio Companies</div>
          <table className="table">
            <thead>
              <tr><th>Unternehmen</th><th>Sektor</th><th>Revenue</th><th>EBITDA</th><th>IRR</th><th>MOIC</th><th>Score</th><th>Status</th></tr>
            </thead>
            <tbody>
              {portfolio.map(p => (
                <tr key={p.id} onClick={() => setSelected(p.id === selected ? null : p.id)} style={{ cursor: "pointer", background: p.id === selected ? "var(--surface2)" : undefined }}>
                  <td className="bold">{p.name}</td>
                  <td style={{ color: "var(--muted)", fontSize: 12 }}>{p.sector}</td>
                  <td className="mono">€{p.revenue}M</td>
                  <td className="mono green">€{p.ebitda}M</td>
                  <td className="mono" style={{ color: p.irr >= 25 ? "var(--accent)" : p.irr >= 15 ? "var(--orange)" : "var(--red)" }}>{p.irr}%</td>
                  <td className="mono blue">{p.moic}x</td>
                  <td style={{ minWidth: 90 }}><ScoreBar value={p.score} /></td>
                  <td><Pill type={p.status === "Exit" ? "gray" : "green"}>{p.status}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          {sel ? (
            <div>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 20, letterSpacing: 1, color: "var(--accent)", marginBottom: 14 }}>{sel.name}</div>
              <div className="tabs" style={{ marginBottom: 14 }}>
                {["overview", "financials", "ai"].map(t => (
                  <div key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t.toUpperCase()}</div>
                ))}
              </div>
              {tab === "overview" && (
                <div>
                  <div className="form-group"><div className="form-label">Investment Stage</div><Pill type={sel.stage === "Roll-up" ? "blue" : "green"}>{sel.stage}</Pill></div>
                  <div className="form-group"><div className="form-label">Notizen</div><div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>{sel.notes}</div></div>
                  <div className="form-group"><div className="form-label">Entry Jahr</div><div className="mono" style={{ fontSize: 13 }}>{sel.entry}</div></div>
                </div>
              )}
              {tab === "financials" && (
                <div>
                  {[
                    ["Revenue",        `€${sel.revenue}M`,                                        "var(--text)"],
                    ["EBITDA",         `€${sel.ebitda}M`,                                         "var(--accent)"],
                    ["EBITDA-Marge",   `${((sel.ebitda / sel.revenue) * 100).toFixed(1)}%`,       "var(--accent)"],
                    ["Equity inv.",    `€${sel.equity}M`,                                         "var(--accent2)"],
                    ["Entry Multiple", `${sel.entryMultiple}x`,                                   "var(--muted)"],
                    ["Current Multiple",`${sel.currentMultiple}x`,                                "var(--accent)"],
                    ["IRR",            `${sel.irr}%`,   sel.irr >= 20 ? "var(--accent)" : "var(--orange)"],
                    ["MOIC",           `${sel.moic}x`,                                            "var(--accent2)"],
                  ].map(([l, v, c]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
                      <span style={{ color: "var(--muted)", fontSize: 12 }}>{l}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: c }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
              {tab === "ai" && (
                <div>
                  <div className="card-title">KI-Automatisierungspotenzial</div>
                  <div style={{ marginBottom: 16 }}>
                    <ScoreBar value={sel.aiScore} />
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", marginTop: 4 }}>
                      {sel.aiScore >= 80 ? "HOCH — Sofortiger Handlungsbedarf" : sel.aiScore >= 60 ? "MITTEL — Potenzial vorhanden" : "GERING — Manuelle Prozesse dominieren"}
                    </div>
                  </div>
                  <ProgressBar label="Prozessautomatisierung" value={sel.aiScore}                    color="var(--accent)" />
                  <ProgressBar label="Headcount-Optimierung"  value={Math.max(30, sel.aiScore - 15)} color="var(--accent2)" />
                  <ProgressBar label="EBITDA-Impact"          value={Math.max(20, sel.aiScore - 25)} color="var(--orange)" />
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: 12, textAlign: "center", padding: "40px 0" }}>
              ← Unternehmen auswählen für Details
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="modal">
            <div className="modal-title">+ NEUE BETEILIGUNG</div>
            <div className="form-grid">
              {[
                ["Unternehmensname *", "name",          "text",   "Muster GmbH"],
                ["Sektor",            "sector",         "text",   "z.B. Managed IT"],
                ["Umsatz (€M)",       "revenue",        "number", "25"],
                ["EBITDA (€M)",       "ebitda",         "number", "4.5"],
                ["Equity inv. (€M)",  "equity",         "number", "12"],
                ["Entry Multiple",    "entryMultiple",  "number", "8.5"],
                ["IRR (%)",           "irr",            "number", "22"],
                ["MOIC",              "moic",           "number", "1.5"],
              ].map(([label, key, type, ph]) => (
                <div key={key} className="form-group">
                  <label className="form-label">{label}</label>
                  <input className="input" type={type} placeholder={ph} value={newCo[key]}
                    onChange={e => setNewCo({ ...newCo, [key]: e.target.value })} />
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>ABBRECHEN</button>
              <button className="btn btn-primary" onClick={addCompany}>SPEICHERN</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DEAL PIPELINE ───────────────────────────────────────────────────────────
function DealPipeline({ deals, setDeals }) {
  const stages = ["Initial Contact", "Screening", "NDA", "LOI", "Due Diligence", "Closed"];
  const [showAdd, setShowAdd] = useState(false);
  const [newDeal, setNewDeal] = useState({ name: "", sector: "", revenue: "", ebitda: "", multiple: "", status: "Screening", priority: "Medium" });

  const addDeal = () => {
    if (!newDeal.name) return;
    const rev = parseFloat(newDeal.revenue) || 0;
    const ebi = parseFloat(newDeal.ebitda)  || 0;
    setDeals(prev => [...prev, {
      id: Date.now(), ...newDeal,
      revenue:  rev,
      ebitda:   ebi,
      multiple: parseFloat(newDeal.multiple) || 0,
      margin:   rev > 0 ? ((ebi / rev) * 100).toFixed(1) : 0,
      score:    Math.floor(Math.random() * 30) + 55,
    }]);
    setShowAdd(false);
    setNewDeal({ name: "", sector: "", revenue: "", ebitda: "", multiple: "", status: "Screening", priority: "Medium" });
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">DEAL <span>PIPELINE</span></div>
          <div className="page-sub">{deals.length} aktive Targets · Priorisiert nach Score</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ DEAL HINZUFÜGEN</button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {stages.map(s => {
          const count = deals.filter(d => d.status === s).length;
          return (
            <div key={s} style={{ minWidth: 130, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4, padding: "10px 14px", flex: 1 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", letterSpacing: 1, marginBottom: 6 }}>{s.toUpperCase()}</div>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 28, color: count > 0 ? "var(--accent)" : "var(--muted)" }}>{count}</div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-title">Alle Targets — Ranking nach Score</div>
        <table className="table">
          <thead>
            <tr><th>Unternehmen</th><th>Sektor</th><th>Revenue</th><th>EBITDA</th><th>Marge</th><th>Multiple</th><th>Score</th><th>Priorität</th><th>Status</th></tr>
          </thead>
          <tbody>
            {[...deals].sort((a, b) => b.score - a.score).map(d => (
              <tr key={d.id}>
                <td className="bold">{d.name}</td>
                <td style={{ color: "var(--muted)", fontSize: 12 }}>{d.sector}</td>
                <td className="mono">€{d.revenue}M</td>
                <td className="mono green">€{d.ebitda}M</td>
                <td className="mono" style={{ color: d.margin >= 25 ? "var(--accent)" : d.margin >= 15 ? "var(--orange)" : "var(--red)" }}>{d.margin}%</td>
                <td className="mono">{d.multiple}x</td>
                <td style={{ minWidth: 90 }}><ScoreBar value={d.score} /></td>
                <td><Pill type={d.priority === "High" ? "green" : d.priority === "Medium" ? "orange" : "gray"}>{d.priority}</Pill></td>
                <td><Pill type={d.status === "LOI" ? "blue" : d.status === "Closed" ? "gray" : "orange"}>{d.status}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="modal">
            <div className="modal-title">+ NEUES TARGET</div>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">Unternehmensname *</label><input className="input" placeholder="Target GmbH" value={newDeal.name} onChange={e => setNewDeal({ ...newDeal, name: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Sektor</label><input className="input" placeholder="z.B. SaaS" value={newDeal.sector} onChange={e => setNewDeal({ ...newDeal, sector: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Umsatz (€M)</label><input className="input" type="number" value={newDeal.revenue} onChange={e => setNewDeal({ ...newDeal, revenue: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">EBITDA (€M)</label><input className="input" type="number" value={newDeal.ebitda} onChange={e => setNewDeal({ ...newDeal, ebitda: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">EV/EBITDA Multiple</label><input className="input" type="number" value={newDeal.multiple} onChange={e => setNewDeal({ ...newDeal, multiple: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Status</label><select className="input" value={newDeal.status} onChange={e => setNewDeal({ ...newDeal, status: e.target.value })}>{stages.map(s => <option key={s}>{s}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Priorität</label><select className="input" value={newDeal.priority} onChange={e => setNewDeal({ ...newDeal, priority: e.target.value })}>{["High", "Medium", "Low"].map(p => <option key={p}>{p}</option>)}</select></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>ABBRECHEN</button>
              <button className="btn btn-primary" onClick={addDeal}>HINZUFÜGEN</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LBO CALCULATOR ──────────────────────────────────────────────────────────
function LBOCalculator() {
  const [params, setParams] = useState({
    revenue: 30, ebitdaMargin: 20, entryMultiple: 8, debtPct: 60,
    revenueGrowth: 8, marginExpansion: 2, exitMultiple: 10, holdYears: 5,
  });

  const ebitda     = (params.revenue * params.ebitdaMargin) / 100;
  const ev         = ebitda * params.entryMultiple;
  const debt       = ev * (params.debtPct / 100);
  const equity     = ev - debt;
  const exitEbitda = ebitda * Math.pow(1 + (params.revenueGrowth + params.marginExpansion) / 100, params.holdYears);
  const exitEv     = exitEbitda * params.exitMultiple;
  const exitEquity = Math.max(0, exitEv - debt * 0.5);
  const moic       = equity > 0 ? exitEquity / equity : 0;
  const irr        = moic > 0 ? (Math.pow(moic, 1 / params.holdYears) - 1) * 100 : 0;
  const irrColor   = irr >= 25 ? "var(--accent)" : irr >= 15 ? "var(--orange)" : "var(--red)";

  const up = (k, v) => setParams(p => ({ ...p, [k]: parseFloat(v) || 0 }));

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">LBO <span>RECHNER</span></div>
          <div className="page-sub">Leveraged Buyout Modell · IRR & MOIC Simulation</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Deal Parameter</div>
          <div className="form-grid">
            {[
              ["Revenue (€M)",             "revenue",         params.revenue],
              ["EBITDA-Marge (%)",          "ebitdaMargin",    params.ebitdaMargin],
              ["Entry Multiple (EV/EBITDA)","entryMultiple",   params.entryMultiple],
              ["Fremdkapital (%)",          "debtPct",         params.debtPct],
              ["Revenue Wachstum p.a. (%)", "revenueGrowth",   params.revenueGrowth],
              ["Margenverbesserung p.a. (%)","marginExpansion",params.marginExpansion],
              ["Exit Multiple",             "exitMultiple",    params.exitMultiple],
              ["Haltedauer (Jahre)",        "holdYears",       params.holdYears],
            ].map(([label, key, val]) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                <input className="input" type="number" value={val} onChange={e => up(key, e.target.value)} step="0.5" />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-title">Sources & Uses</div>
            {[
              ["Enterprise Value", `€${ev.toFixed(1)}M`,                              "var(--text)"],
              ["Fremdkapital",     `€${debt.toFixed(1)}M (${params.debtPct}%)`,       "var(--orange)"],
              ["Eigenkapital",     `€${equity.toFixed(1)}M (${100 - params.debtPct}%)`, "var(--accent2)"],
              ["EBITDA (Entry)",   `€${ebitda.toFixed(1)}M`,                          "var(--accent)"],
            ].map(([l, v, c]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ color: "var(--muted)", fontSize: 13 }}>{l}</span>
                <span style={{ fontFamily: "var(--font-mono)", color: c, fontSize: 13 }}>{v}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title">Exit Model</div>
            {[
              ["EBITDA (Exit)", `€${exitEbitda.toFixed(1)}M`, "var(--accent)"],
              ["EV (Exit)",     `€${exitEv.toFixed(1)}M`,     "var(--text)"],
              ["Equity (Exit)", `€${exitEquity.toFixed(1)}M`, "var(--accent2)"],
            ].map(([l, v, c]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ color: "var(--muted)", fontSize: 13 }}>{l}</span>
                <span style={{ fontFamily: "var(--font-mono)", color: c, fontSize: 13 }}>{v}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ textAlign: "center" }}>
            <div className="card-title">Returns</div>
            <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 0" }}>
              <div>
                <div style={{ fontFamily: "var(--font-head)", fontSize: 48, color: irrColor }}>{irr.toFixed(1)}<span style={{ fontSize: 24 }}>%</span></div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", marginTop: 4 }}>GROSS IRR</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-head)", fontSize: 48, color: "var(--accent2)" }}>{moic.toFixed(2)}<span style={{ fontSize: 24 }}>x</span></div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", marginTop: 4 }}>MOIC</div>
              </div>
            </div>
            <Pill type={irr >= 25 ? "green" : irr >= 15 ? "orange" : "red"}>
              {irr >= 25 ? "ATTRAKTIV" : irr >= 15 ? "AKZEPTABEL" : "UNTER HÜRDE"}
            </Pill>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Sensitivitätsanalyse — IRR bei Exit Multiple vs. EBITDA-Wachstum</div>
        <table className="table">
          <thead>
            <tr>
              <th>EBITDA Wachstum ↓ / Exit Multiple →</th>
              {[7, 8, 9, 10, 11, 12].map(m => <th key={m}>{m}x</th>)}
            </tr>
          </thead>
          <tbody>
            {[5, 8, 10, 12, 15].map(growth => (
              <tr key={growth}>
                <td className="mono" style={{ color: "var(--muted)" }}>+{growth}% p.a.</td>
                {[7, 8, 9, 10, 11, 12].map(exitMult => {
                  const simEbitda  = ebitda * Math.pow(1 + (growth + params.marginExpansion) / 100, params.holdYears);
                  const simEv      = simEbitda * exitMult;
                  const simEq      = Math.max(0, simEv - debt * 0.5);
                  const simMoic    = equity > 0 ? simEq / equity : 0;
                  const simIrr     = simMoic > 0 ? (Math.pow(simMoic, 1 / params.holdYears) - 1) * 100 : 0;
                  const c          = simIrr >= 25 ? "var(--accent)" : simIrr >= 15 ? "var(--orange)" : "var(--red)";
                  return <td key={exitMult} className="mono" style={{ color: c }}>{simIrr.toFixed(1)}%</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── AI ADVISOR ──────────────────────────────────────────────────────────────
function AIAdvisor({ portfolio, deals }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Willkommen im KI-Beratungsmodus. Ich analysiere dein Portfolio und liefere institutionelle PE-Empfehlungen. Stelle mir eine Frage oder wähle ein Thema." }
  ]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const quickPrompts = [
    "Welches Portfolio-Unternehmen hat das größte Verbesserungspotenzial?",
    "Erstelle einen Value Creation Plan für mein Portfolio",
    "Analysiere die Top-Deals in meiner Pipeline",
    "Welche Exit-Strategie empfiehlst du für die stärksten Assets?",
    "Wo sind die größten KI-Automatisierungspotenziale?",
  ];

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setLoading(true);

    const portfolioContext = portfolio.map(p =>
      `${p.name} (${p.sector}): Revenue €${p.revenue}M, EBITDA €${p.ebitda}M, Marge ${((p.ebitda / p.revenue) * 100).toFixed(1)}%, IRR ${p.irr}%, MOIC ${p.moic}x, Score ${p.score}/100, Stage: ${p.stage}`
    ).join("\n");

    const dealContext = deals.map(d =>
      `${d.name} (${d.sector}): Revenue €${d.revenue}M, EBITDA €${d.ebitda}M, Marge ${d.margin}%, Multiple ${d.multiple}x, Score ${d.score}/100, Status: ${d.status}`
    ).join("\n");

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Du bist ein Elite Private Equity Manager mit der Expertise eines Mega-Fund-Investors (Blackstone/KKR-Niveau).
Analysiere das aktuelle Portfolio und Deal-Pipeline und liefere institutionelle, datenbasierte Empfehlungen.

PORTFOLIO:
${portfolioContext}

DEAL PIPELINE:
${dealContext}

Antworte präzise, zahlenbasiert und auf Deutsch. Nutze konkrete Metriken. Keine Marketing-Sprache. Maximal 250 Wörter.`,
          messages: [{ role: "user", content: msg }],
        }),
      });
      const data  = await res.json();
      const reply = data.content?.map(c => c.text || "").join("") || "Fehler beim Abrufen der Antwort.";
      setMessages(prev => [...prev, { role: "ai", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "API-Verbindungsfehler. Bitte erneut versuchen." }]);
    }
    setLoading(false);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">KI <span>BERATER</span></div>
          <div className="page-sub">Powered by Claude · Institutionelle PE-Analyse in Echtzeit</div>
        </div>
        <span className="badge badge-green">LIVE AI</span>
      </div>

      <div className="grid-65-35">
        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="chat-wrap">
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role === "ai" ? "msg-ai" : "msg-user"}`}>
                  {m.role === "ai" && <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", marginBottom: 5 }}>PE ADVISOR</div>}
                  {m.text}
                </div>
              ))}
              {loading && (
                <div className="msg msg-ai">
                  <div className="typing"><span /><span /><span /></div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="chat-input-row">
              <input className="input chat-input" placeholder="Frage stellen..." value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !loading && sendMessage()}
                disabled={loading} />
              <button className="btn btn-primary" onClick={() => sendMessage()} disabled={loading}>SENDEN</button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="card">
            <div className="card-title">Quick Analysis</div>
            {quickPrompts.map((q, i) => (
              <div key={i} onClick={() => !loading && sendMessage(q)} style={{
                padding: "9px 12px", border: "1px solid var(--border)", borderRadius: 3, marginBottom: 8,
                cursor: loading ? "not-allowed" : "pointer", fontSize: 12, color: "var(--muted)", transition: "all .15s",
              }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
              >→ {q}</div>
            ))}
          </div>
          <div className="card">
            <div className="card-title">Portfolio Snapshot</div>
            {portfolio.slice(0, 4).map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 12 }}>{p.name}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: p.irr >= 25 ? "var(--accent)" : "var(--orange)" }}>{p.irr}% IRR</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LP REPORTING ─────────────────────────────────────────────────────────────
function Reporting({ portfolio, fund }) {
  const active   = portfolio.filter(p => p.status === "Active");
  const exits    = portfolio.filter(p => p.status === "Exit");
  const totalInv = active.reduce((s, p) => s + p.equity, 0);
  const avgIrr   = active.length > 0 ? active.reduce((s, p) => s + p.irr,  0) / active.length : 0;
  const avgMoic  = active.length > 0 ? active.reduce((s, p) => s + p.moic, 0) / active.length : 0;
  const top      = [...active].sort((a, b) => b.irr - a.irr)[0];
  const weak     = [...active].sort((a, b) => a.irr - b.irr)[0];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">LP <span>REPORTING</span></div>
          <div className="page-sub">Quarterly Report · Q1 2025 · Vertraulich</div>
        </div>
        <button className="btn btn-primary btn-sm">↓ EXPORT PDF</button>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card green"><div className="kpi-label">Gross IRR</div><div className="kpi-value">{avgIrr.toFixed(1)}%</div><div className="kpi-delta delta-pos">Top-Quartil PE</div></div>
        <div className="kpi-card blue"><div className="kpi-label">Avg. MOIC</div><div className="kpi-value">{avgMoic.toFixed(2)}x</div><div className="kpi-delta delta-pos">Ziel: 2.5x</div></div>
        <div className="kpi-card orange"><div className="kpi-label">Investiert</div><div className="kpi-value">€{totalInv}M</div><div className="kpi-delta" style={{ color: "var(--orange)" }}>{active.length} Companies</div></div>
        <div className="kpi-card red"><div className="kpi-label">Exits (realized)</div><div className="kpi-value">{exits.length}</div><div className="kpi-delta delta-pos">DPI: {fund.dpi}x</div></div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Performance Attribution</div>
          <table className="table">
            <thead><tr><th>Unternehmen</th><th>IRR</th><th>MOIC</th><th>Beitrag</th></tr></thead>
            <tbody>
              {[...active].sort((a, b) => b.irr - a.irr).map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td className="mono" style={{ color: p.irr >= 25 ? "var(--accent)" : "var(--orange)" }}>{p.irr}%</td>
                  <td className="mono blue">{p.moic}x</td>
                  <td className="mono green">+{totalInv > 0 ? ((p.equity / totalInv) * p.irr).toFixed(1) : 0}pp</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {top && (
            <div className="card">
              <div className="card-title">Top Performer</div>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 22, color: "var(--accent)", marginBottom: 6 }}>{top.name}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>IRR: <span style={{ color: "var(--accent)" }}>{top.irr}%</span> · MOIC: <span style={{ color: "var(--accent2)" }}>{top.moic}x</span></div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>{top.notes}</div>
            </div>
          )}
          {weak && (
            <div className="card">
              <div className="card-title">Underperformer — Handlungsbedarf</div>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 22, color: "var(--orange)", marginBottom: 6 }}>{weak.name}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>IRR: <span style={{ color: "var(--orange)" }}>{weak.irr}%</span> · MOIC: <span style={{ color: "var(--orange)" }}>{weak.moic}x</span></div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>{weak.notes}</div>
            </div>
          )}
          <div className="card">
            <div className="card-title">Realisierte Exits</div>
            {exits.map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 13 }}>{p.name}</span>
                <div>
                  <span className="mono" style={{ color: "var(--accent)", marginRight: 10 }}>{p.moic}x</span>
                  <Pill type="gray">Sold</Pill>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard",   icon: "◈", section: "ÜBERSICHT" },
  { id: "markt",     label: "Marktdaten",  icon: "◎", section: "ÜBERSICHT" },
  { id: "portfolio", label: "Portfolio",   icon: "▣", section: "PORTFOLIO" },
  { id: "pipeline",  label: "Deal Pipeline",icon: "◉", section: "PORTFOLIO" },
  { id: "lbo",       label: "LBO Rechner", icon: "∑", section: "ANALYSE" },
  { id: "ai",        label: "KI Berater",  icon: "◆", section: "ANALYSE" },
  { id: "reporting", label: "LP Reporting",icon: "▤", section: "REPORTING" },
];

export default function App() {
  const [page, setPage]           = useState("dashboard");
  const [fund]                    = useState(initialFund);
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [deals, setDeals]         = useState(initialDeals);
  const [finnhubKey, setFinnhubKey] = useState("");

  // Finnhub quotes surfaced to Dashboard for market context bar
  const { quotes } = useFinnhub(finnhubKey);

  const sections = NAV.reduce((acc, n) => {
    if (!acc[n.section]) acc[n.section] = [];
    acc[n.section].push(n);
    return acc;
  }, {});

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard fund={fund} portfolio={portfolio} quotes={quotes} />;
      case "markt":     return <MarktDaten finnhubKey={finnhubKey} setFinnhubKey={setFinnhubKey} />;
      case "portfolio": return <Portfolio portfolio={portfolio} setPortfolio={setPortfolio} />;
      case "pipeline":  return <DealPipeline deals={deals} setDeals={setDeals} />;
      case "lbo":       return <LBOCalculator />;
      case "ai":        return <AIAdvisor portfolio={portfolio} deals={deals} />;
      case "reporting": return <Reporting portfolio={portfolio} fund={fund} />;
      default:          return null;
    }
  };

  const bxQ = quotes["BX"];

  return (
    <>
      <GlobalStyle />
      <div className="app">
        <header className="topbar">
          <div className="topbar-logo">APEX PE <span>Private Equity OS</span></div>
          <span className="badge badge-green">Fund I Active</span>
          <span className="badge badge-blue">€120M AUM</span>
          {bxQ && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: bxQ.dp >= 0 ? "var(--accent)" : "var(--red)" }}>
              BX ${bxQ.c?.toFixed(2)} ({bxQ.dp >= 0 ? "+" : ""}{bxQ.dp?.toFixed(2)}%)
            </span>
          )}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", marginLeft: 8 }}>
            {new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
        </header>

        <nav className="sidebar">
          {Object.entries(sections).map(([sec, items]) => (
            <div key={sec}>
              <div className="nav-section">{sec}</div>
              {items.map(n => (
                <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
                  <span className="nav-icon">{n.icon}</span>
                  {n.label}
                </div>
              ))}
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", letterSpacing: 1 }}>FUND MANAGER</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Apex Capital</div>
            {finnhubKey && (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", marginTop: 4 }}>
                ● Finnhub aktiv
              </div>
            )}
          </div>
        </nav>

        <main className="main">
          {renderPage()}
        </main>
      </div>
    </>
  );
}
