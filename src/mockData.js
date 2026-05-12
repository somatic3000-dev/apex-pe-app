export const initialFund={name:"APEX CAPITAL FUND I",vintage:2022,aum:120,dryPowder:34,deployed:86,irr:24.3,moic:1.87,dpi:0.42};
export const initialPortfolio=[
{id:1,name:"TechOps GmbH",sector:"Managed IT",status:"Active",entry:2022,ebitda:4.2,revenue:22,entryMultiple:7.8,currentMultiple:9.4,equity:12,irr:31.2,moic:1.94,score:82,stage:"Hold",notes:"Starke wiederkehrende Umsätze. EBITDA-Expansion läuft.",aiScore:88},
{id:2,name:"MedServ AG",sector:"Healthcare",status:"Active",entry:2022,ebitda:6.8,revenue:38,entryMultiple:9.2,currentMultiple:11.1,equity:18,irr:22.4,moic:1.72,score:74,stage:"Scale",notes:"Roll-up von 3 Kliniken. Synergien realisiert.",aiScore:61},
{id:3,name:"LogiStar GmbH",sector:"Logistik",status:"Active",entry:2023,ebitda:2.9,revenue:18,entryMultiple:6.5,currentMultiple:7.8,equity:8,irr:18.7,moic:1.43,score:61,stage:"Optimize",notes:"Margen unter Druck. Kostenreduktion eingeleitet.",aiScore:74},
{id:4,name:"Dental Gruppe",sector:"Dental",status:"Active",entry:2023,ebitda:3.4,revenue:14,entryMultiple:8.1,currentMultiple:10.2,equity:10,irr:28.9,moic:1.88,score:78,stage:"Roll-up",notes:"4 Praxen akquiriert. Ziel: 12 bis Exit.",aiScore:45},
{id:5,name:"CloudSec Ltd.",sector:"Cybersecurity",status:"Active",entry:2024,ebitda:1.8,revenue:9,entryMultiple:11.2,currentMultiple:13.5,equity:8,irr:41.2,moic:1.32,score:89,stage:"Scale",notes:"ARR-Wachstum 78% YoY.",aiScore:95},
{id:6,name:"HVAC Masters",sector:"Gebäude",status:"Exit",entry:2021,ebitda:5.1,revenue:26,entryMultiple:6.0,currentMultiple:8.8,equity:14,irr:33.6,moic:2.41,score:91,stage:"Sold",notes:"Verkauft an Strategen. 2.41x MOIC realisiert.",aiScore:52}];
export const initialDeals=[
{id:1,name:"Phamex Pharma Services",sector:"Healthcare",revenue:31,ebitda:5.8,margin:18.7,multiple:9.5,status:"LOI",score:86,priority:"High"},
{id:2,name:"DataCenter Nord",sector:"Infrastruktur",revenue:48,ebitda:14.2,margin:29.6,multiple:12.1,status:"Screening",score:79,priority:"High"},
{id:3,name:"Compliance360",sector:"Compliance SaaS",revenue:12,ebitda:3.1,margin:25.8,multiple:10.8,status:"NDA",score:72,priority:"Medium"},
{id:4,name:"AutoRepair Gruppe",sector:"Auto-Services",revenue:22,ebitda:3.8,margin:17.3,multiple:7.2,status:"Screening",score:58,priority:"Low"}];
export const WATCH_SYMBOLS=["SPY","BX","KKR","APO","CG","HYG","IWM","LQD"].map(sym=>({sym,name:sym,relevance:"Benchmark"}));
export const NAV=[
{id:"dashboard",label:"Dashboard",icon:"◈",section:"ÜBERSICHT"},{id:"markt",label:"Marktdaten",icon:"◎",section:"ÜBERSICHT"},
{id:"portfolio",label:"Portfolio",icon:"▣",section:"PORTFOLIO"},{id:"pipeline",label:"Deal Pipeline",icon:"◉",section:"PORTFOLIO"},
{id:"lbo",label:"LBO Rechner",icon:"∑",section:"ANALYSE"},{id:"ai",label:"KI Berater",icon:"◆",section:"ANALYSE"},{id:"reporting",label:"LP Reporting",icon:"▤",section:"REPORTING"}];
