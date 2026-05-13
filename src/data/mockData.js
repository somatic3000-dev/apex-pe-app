export const initialFund = {
  name: "APEX CAPITAL FUND I",
  vintage: 2022,
  aum: 120,
};

export const initialPortfolio = [
  {
    id: 1,
    name: "TechOps GmbH",
    sector: "Managed IT",
    irr: 31.2,
    moic: 1.94,
    status: "Active",
  },
];

export const initialDeals = [
  {
    id: 1,
    name: "Phamex Pharma",
    sector: "Healthcare",
    status: "LOI",
    score: 86,
  },
];

export const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "◈", section: "ÜBERSICHT" },
  { id: "markt", label: "Marktdaten", icon: "◎", section: "ÜBERSICHT" },

  { id: "portfolio", label: "Portfolio", icon: "▣", section: "PORTFOLIO" },
  { id: "pipeline", label: "Pipeline", icon: "◉", section: "PORTFOLIO" },

  { id: "lbo", label: "LBO Rechner", icon: "∑", section: "ANALYSE" },
  { id: "ai", label: "KI Berater", icon: "◆", section: "ANALYSE" },

  { id: "reporting", label: "LP Reporting", icon: "▤", section: "REPORTING" }
];
export const WATCH_SYMBOLS = [
  { sym: "SPY", name: "S&P 500 ETF", relevance: "US Markt-Benchmark" },
  { sym: "BX", name: "Blackstone", relevance: "Private Equity Peer" },
  { sym: "KKR", name: "KKR & Co.", relevance: "Private Equity Peer" },
  { sym: "APO", name: "Apollo Global Management", relevance: "Private Equity Peer" },
  { sym: "CG", name: "Carlyle Group", relevance: "Private Equity Peer" },
  { sym: "HYG", name: "High Yield Bond ETF", relevance: "LBO Debt Market" },
  { sym: "LQD", name: "Investment Grade Bond ETF", relevance: "Credit Market" },
  { sym: "IWM", name: "Russell 2000 ETF", relevance: "Small Cap Benchmark" },
  { sym: "MSFT", name: "Microsoft", relevance: "Software / AI" },
  { sym: "NVDA", name: "Nvidia", relevance: "AI Infrastructure" },
  { sym: "GOOGL", name: "Alphabet", relevance: "Digital / Cloud" },
  { sym: "AMZN", name: "Amazon", relevance: "Cloud / E-Commerce" },
  { sym: "META", name: "Meta Platforms", relevance: "Digital Platforms" },
  { sym: "SAP", name: "SAP", relevance: "Enterprise Software" },
  { sym: "ASML", name: "ASML", relevance: "Semiconductor Equipment" }
];
// updated watch symbols