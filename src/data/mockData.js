// src/data/mockData.js

export const initialFund = {
  name: "APEX CAPITAL FUND I",
  vintage: 2022,
  aum: 120,
  dryPowder: 45,
  deployed: 75,
};

export const initialPortfolio = [
  {
    id: 1,
    name: "Alpha Software",
    sector: "Software",
    revenue: 42,
    ebitda: 11,
    entryMultiple: 8,
    currentMultiple: 11,
    irr: 28,
    moic: 2.4,
    status: "Active",
    notes: "Starkes Wachstum im SaaS-Bereich.",
  },
  {
    id: 2,
    name: "MedTech Labs",
    sector: "Healthcare",
    revenue: 31,
    ebitda: 7,
    entryMultiple: 9,
    currentMultiple: 10,
    irr: 19,
    moic: 1.8,
    status: "Active",
    notes: "Expansion nach Frankreich.",
  },
  {
    id: 3,
    name: "Green Energy GmbH",
    sector: "Energy",
    revenue: 55,
    ebitda: 13,
    entryMultiple: 7,
    currentMultiple: 8,
    irr: 14,
    moic: 1.4,
    status: "Watchlist",
    notes: "Capex-intensives Geschäft.",
  },
];

export const initialDeals = [
  {
    id: 1,
    name: "HealthCorp",
    sector: "Healthcare",
    revenue: 80,
    ebitda: 16,
    multiple: 9,
    status: "LOI",
    priority: "High",
    score: 82,
  },
  {
    id: 2,
    name: "CloudBase",
    sector: "Software",
    revenue: 45,
    ebitda: 12,
    multiple: 11,
    status: "NDA",
    priority: "Medium",
    score: 68,
  },
  {
    id: 3,
    name: "Industrial Systems",
    sector: "Industrials",
    revenue: 120,
    ebitda: 18,
    multiple: 7,
    status: "Screening",
    priority: "Low",
    score: 55,
  },
];

export const WATCH_SYMBOLS = [
  "AAPL",
  "MSFT",
  "NVDA",
  "AMZN",
  "GOOGL",
  "META",
  "TSLA",
  "SPY",
  "QQQ",
  "HYG",
  "LQD",
  "BX",
  "KKR",
  "APO",
  "CG",
];

export const IC_MEMO_TEMPLATE = {
  company: "",
  sector: "",
  investmentThesis: "",
  risks: "",
  valuation: "",
  recommendation: "",
};

export const DD_CHECKLIST = [
  "Financial DD",
  "Legal DD",
  "Commercial DD",
  "Tax DD",
  "ESG DD",
  "Management Calls",
  "Customer Calls",
  "Data Room Review",
];

export const NAV = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "◈",
    section: "ÜBERSICHT",
  },
  {
    id: "markt",
    label: "Marktdaten",
    icon: "◎",
    section: "ÜBERSICHT",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    icon: "▣",
    section: "PORTFOLIO",
  },
  {
    id: "pipeline",
    label: "Deal Pipeline",
    icon: "◉",
    section: "PORTFOLIO",
  },
  {
    id: "lbo",
    label: "LBO Rechner",
    icon: "∑",
    section: "ANALYSE",
  },
  {
    id: "ai",
    label: "KI Berater",
    icon: "◆",
    section: "ANALYSE",
  },
  {
    id: "ic",
    label: "IC Memo",
    icon: "▦",
    section: "ANALYSE",
  },
  {
    id: "dd",
    label: "Due Diligence",
    icon: "▤",
    section: "ANALYSE",
  },
  {
    id: "reporting",
    label: "LP Reporting",
    icon: "▥",
    section: "REPORTING",
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: "☑",
    section: "SYSTEM",
  },
  {
    id: "settings",
    label: "Settings",
    icon: "⚙",
    section: "SYSTEM",
  },
];