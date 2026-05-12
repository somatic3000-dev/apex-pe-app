import {useMemo,useState} from "react";
import {ScoreBar,Pill,ProgressBar} from "../components/UI";

const emptyCompany={name:"",sector:"",status:"Active",entry:new Date().getFullYear(),revenue:"",ebitda:"",equity:"",entryMultiple:"",currentMultiple:"",irr:"",moic:"",score:"65",stage:"Optimize",notes:"",aiScore:"60"};
const numberFields=["entry","revenue","ebitda","equity","entryMultiple","currentMultiple","irr","moic","score","aiScore"];

function normalizeCompany(form,id){
  const out={id,...form};
  numberFields.forEach(k=>{out[k]=parseFloat(out[k])||0});
  out.margin=out.revenue>0?Number(((out.ebitda/out.revenue)*100).toFixed(1)):0;
  return out;
}

function CompanyForm({form,setForm,onSave,onCancel,isEdit}){
  const set=(k,v)=>setForm({...form,[k]:v});
  const fields=[
    ["Unternehmensname *","name","text"],["Sektor","sector","text"],["Umsatz (€M)","revenue","number"],["EBITDA (€M)","ebitda","number"],
    ["Equity investiert (€M)","equity","number"],["Entry Multiple","entryMultiple","number"],["Current Multiple","currentMultiple","number"],["IRR (%)","irr","number"],
    ["MOIC","moic","number"],["Score","score","number"],["KI-Score","aiScore","number"],["Entry Jahr","entry","number"]
  ];
  return <div className="card editor-card">
    <div className="card-title">{isEdit?"Beteiligung bearbeiten":"Neue Beteiligung"}</div>
    <div className="form-grid">
      {fields.map(([label,key,type])=><div className="form-group" key={key}>
        <label>{label}</label><input className="input" type={type} value={form[key]??""} onChange={e=>set(key,e.target.value)}/>
      </div>)}
      <div className="form-group"><label>Status</label><select className="input" value={form.status} onChange={e=>set("status",e.target.value)}><option>Active</option><option>Exit</option></select></div>
      <div className="form-group"><label>Stage</label><select className="input" value={form.stage} onChange={e=>set("stage",e.target.value)}>{["Hold","Scale","Optimize","Roll-up","Sold"].map(x=><option key={x}>{x}</option>)}</select></div>
      <div className="form-group span-2"><label>Notizen</label><textarea className="input textarea" value={form.notes??""} onChange={e=>set("notes",e.target.value)} placeholder="Kurzbeschreibung, Value Creation, Risiken…"/></div>
    </div>
    <div className="button-row">
      <button className="btn btn-primary" onClick={onSave}>{isEdit?"ÄNDERUNGEN SPEICHERN":"BETEILIGUNG HINZUFÜGEN"}</button>
      <button className="btn btn-ghost" onClick={onCancel}>ABBRECHEN</button>
    </div>
  </div>;
}

export default function Portfolio({portfolio,setPortfolio,resetPortfolio}){
  const [selected,setSelected]=useState(portfolio[0]?.id??null);
  const [mode,setMode]=useState("view");
  const [form,setForm]=useState(emptyCompany);
  const active=portfolio.filter(p=>p.status==="Active");
  const sel=portfolio.find(p=>p.id===selected);
  const totals=useMemo(()=>({
    count:active.length,
    revenue:active.reduce((s,p)=>s+(p.revenue||0),0),
    ebitda:active.reduce((s,p)=>s+(p.ebitda||0),0),
    equity:active.reduce((s,p)=>s+(p.equity||0),0)
  }),[portfolio]);

  const startAdd=()=>{setForm(emptyCompany);setMode("add")};
  const startEdit=(company)=>{setForm({...company});setMode("edit")};
  const cancel=()=>{setMode("view")};
  const saveAdd=()=>{
    if(!form.name.trim()) return alert("Bitte Unternehmensname eintragen.");
    const company=normalizeCompany(form,Date.now());
    setPortfolio(prev=>[...prev,company]);setSelected(company.id);setMode("view");
  };
  const saveEdit=()=>{
    if(!form.name.trim()) return alert("Bitte Unternehmensname eintragen.");
    const company=normalizeCompany(form,form.id);
    setPortfolio(prev=>prev.map(p=>p.id===company.id?company:p));setSelected(company.id);setMode("view");
  };
  const remove=(id)=>{if(confirm("Diese Beteiligung löschen?")){setPortfolio(prev=>prev.filter(p=>p.id!==id));setSelected(null);setMode("view")}};

  const exportJson=()=>{
    const blob=new Blob([JSON.stringify(portfolio,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="apex-portfolio.json";a.click();URL.revokeObjectURL(url);
  };

  return <div className="fade-in">
    <div className="page-header">
      <div><div className="page-title">PORTFOLIO <span>MANAGEMENT</span></div><div className="page-sub">Direkt in der App bearbeiten · Speicherung im Browser</div></div>
      <div className="button-row"><button className="btn btn-primary" onClick={startAdd}>+ BETEILIGUNG</button><button className="btn btn-ghost" onClick={exportJson}>EXPORT JSON</button><button className="btn btn-ghost" onClick={resetPortfolio}>RESET</button></div>
    </div>

    <div className="kpi-grid compact">
      <div className="kpi-card"><div className="kpi-label">Aktive Beteiligungen</div><div className="kpi-value">{totals.count}</div></div>
      <div className="kpi-card"><div className="kpi-label">Revenue aktiv</div><div className="kpi-value">€{totals.revenue.toFixed(1)}M</div></div>
      <div className="kpi-card"><div className="kpi-label">EBITDA aktiv</div><div className="kpi-value">€{totals.ebitda.toFixed(1)}M</div></div>
      <div className="kpi-card"><div className="kpi-label">Equity aktiv</div><div className="kpi-value">€{totals.equity.toFixed(1)}M</div></div>
    </div>

    {mode!=="view" && <CompanyForm form={form} setForm={setForm} onSave={mode==="add"?saveAdd:saveEdit} onCancel={cancel} isEdit={mode==="edit"}/>} 

    <div className="grid-65-35">
      <div className="card"><div className="card-title">Portfolio Companies</div><table className="table"><thead><tr><th>Unternehmen</th><th>Sektor</th><th>Revenue</th><th>EBITDA</th><th>IRR</th><th>MOIC</th><th>Score</th><th>Status</th></tr></thead><tbody>{portfolio.map(p=><tr key={p.id} onClick={()=>setSelected(p.id)} className={p.id===selected?"selected-row":""}><td className="bold">{p.name}</td><td>{p.sector}</td><td>€{p.revenue}M</td><td className="green">€{p.ebitda}M</td><td className={p.irr>=25?"green":p.irr>=15?"orange":"red"}>{p.irr}%</td><td className="blue">{p.moic}x</td><td><ScoreBar value={p.score}/></td><td><Pill type={p.status==="Exit"?"gray":"green"}>{p.status}</Pill></td></tr>)}</tbody></table></div>
      <div className="card">{sel?<><div className="detail-head"><h2>{sel.name}</h2><div className="button-row"><button className="btn btn-sm btn-primary" onClick={()=>startEdit(sel)}>BEARBEITEN</button><button className="btn btn-sm btn-ghost" onClick={()=>remove(sel.id)}>LÖSCHEN</button></div></div><Pill type={sel.stage==="Roll-up"?"blue":sel.stage==="Sold"?"gray":"green"}>{sel.stage}</Pill><p className="muted detail-text">{sel.notes||"Keine Notizen hinterlegt."}</p><hr/><div className="metric-row"><span>Entry Jahr</span><b>{sel.entry}</b></div><div className="metric-row"><span>Entry Multiple</span><b>{sel.entryMultiple}x</b></div><div className="metric-row"><span>Current Multiple</span><b>{sel.currentMultiple}x</b></div><ProgressBar label="KI-Potenzial" value={sel.aiScore}/><ProgressBar label="EBITDA Impact" value={Math.max(20,sel.aiScore-25)} color="var(--orange)"/></>:<p className="muted center">← Unternehmen auswählen</p>}</div>
    </div>
  </div>;
}
