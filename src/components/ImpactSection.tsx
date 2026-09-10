"use client";

import { useEffect, useState } from "react";
import { Check, Database, Mail, MapPin, TriangleAlert } from "lucide-react";

const tickerItems = [
  "48M+ ROWS CLEANED MONTHLY",
  "98.6% AVERAGE ACCURACY",
  "12X FASTER THAN MANUAL REVIEW",
  "73% FEWER DOWNSTREAM ERRORS",
  "0 MISSED SCHEMA DRIFTS",
];

const rows = [
  {
    id: "CUS-1048",
    dirty: { name: "  maya chen", email: "maya..chen@acme.com", region: "apac" },
    clean: { name: "Maya Chen", email: "maya.chen@acme.com", region: "APAC" },
  },
  {
    id: "CUS-1049",
    dirty: { name: "JORDAN  REED", email: "jordan.reed@@northstar.io", region: "EMEA" },
    clean: { name: "Jordan Reed", email: "jordan.reed@northstar.io", region: "EMEA" },
  },
  {
    id: "CUS-1050",
    dirty: { name: "  priya nair", email: "priya.nair@  orbit.co", region: "na" },
    clean: { name: "Priya Nair", email: "priya.nair@orbit.co", region: "NA" },
  },
  {
    id: "CUS-1051",
    dirty: { name: "LUCAS MARTIN ", email: "lucas.martin@atelier..fr", region: "eu" },
    clean: { name: "Lucas Martin", email: "lucas.martin@atelier.fr", region: "EU" },
  },
  {
    id: "CUS-1052",
    dirty: { name: "  sofia  garcia", email: "sofia.garcia@sol..es", region: "latam" },
    clean: { name: "Sofia Garcia", email: "sofia.garcia@sol.es", region: "LATAM" },
  },
];

type RowData = typeof rows[number]["dirty"];

function DisplayValue({ value, cleaned }: { value: string; cleaned: string }) {
  return <span className="cleaning-demo__value">{cleaned === value ? value : cleaned}</span>;
}

export default function ImpactSection() {
  const [cleanedRows, setCleanedRows] = useState(0);

  useEffect(() => {
    let timeoutId: number | undefined;
    const intervalId = window.setInterval(() => {
      setCleanedRows((current) => {
        if (current < rows.length) return current + 1;
        window.clearInterval(intervalId);
        timeoutId = window.setTimeout(() => setCleanedRows(0), 1800);
        return current;
      });
    }, 850);

    return () => {
      window.clearInterval(intervalId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section id="impact" className="cleaning-demo-section">
      <div className="cleaning-demo-section__intro">
        <p>See it work</p>
        <h2>Watch messy data become decision-ready, live.</h2>
      </div>

      <div className="cleaning-demo__ticker" aria-label="DataMedic performance metrics">
        <div className="cleaning-demo__ticker-track">
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`}><i />{item}</span>
          ))}
        </div>
      </div>

      <div className="cleaning-demo__layout">
        <div className="cleaning-demo__card">
          <div className="cleaning-demo__card-heading">
            <div>
              <span className="cleaning-demo__eyebrow"><Database size={14} /> Live cleaning demo</span>
              <h3>Customer records</h3>
            </div>
            <span className={`cleaning-demo__status ${cleanedRows === rows.length ? "cleaning-demo__status--done" : ""}`}>
              <i />{cleanedRows === rows.length ? "100% clean" : "processing..."}
            </span>
          </div>

          <div className="cleaning-demo__table-wrap">
            <div className="cleaning-demo__table cleaning-demo__table--header"><span>ID</span><span>NAME</span><span>EMAIL</span><span>REGION</span><span aria-hidden="true" /></div>
            {rows.map((row, index) => {
              const clean = index < cleanedRows;
              const current: RowData = clean ? row.clean : row.dirty;
              return (
                <div className={`cleaning-demo__table cleaning-demo__row ${clean ? "cleaning-demo__row--clean" : ""}`} key={row.id}>
                  <span className="cleaning-demo__id">{row.id}</span>
                  <DisplayValue value={row.dirty.name} cleaned={current.name} />
                  <span className="cleaning-demo__email"><Mail size={12} /><DisplayValue value={row.dirty.email} cleaned={current.email} /></span>
                  <span className="cleaning-demo__region"><MapPin size={12} /><DisplayValue value={row.dirty.region} cleaned={current.region} /></span>
                  <span className="cleaning-demo__row-icon">{clean ? <Check size={14} /> : <TriangleAlert size={14} />}</span>
                </div>
              );
            })}
          </div>

          <div className="cleaning-demo__footer">
            <span><strong>{cleanedRows}/5</strong> rows normalized</span>
            <span className={cleanedRows === rows.length ? "cleaning-demo__footer-done" : ""}>{cleanedRows === rows.length ? "Ready for decisions" : "Cleaning in progress"}</span>
          </div>
        </div>

        <div className="cleaning-demo__meter">
          <span className="cleaning-demo__eyebrow">Impact meter</span>
          <div className="cleaning-demo__rings" aria-hidden="true">
            <div className="cleaning-demo__ring cleaning-demo__ring--one" />
            <div className="cleaning-demo__ring cleaning-demo__ring--two" />
            <div className="cleaning-demo__ring cleaning-demo__ring--three" />
            <div className="cleaning-demo__score"><strong>98.6</strong><span>/ 100</span></div>
          </div>
          <h3>Avg. quality score</h3>
          <p>across every dataset processed</p>
        </div>
      </div>

      <style jsx>{`
        .cleaning-demo-section { max-width: 1280px; margin: 0 auto; padding: 96px 24px; color: #eef0f5; }
        .cleaning-demo-section__intro { max-width: 700px; margin: 0 auto 42px; text-align: center; }
        .cleaning-demo-section__intro p, .cleaning-demo__eyebrow { display: flex; align-items: center; gap: 7px; margin: 0 0 12px; color: #818cf8; font: 11px 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .2em; text-transform: uppercase; }
        .cleaning-demo-section__intro p { display: block; }
        .cleaning-demo-section__intro h2 { margin: 0; color: #eef0f5; font: 600 clamp(2rem, 4vw, 3.6rem)/1.05 Inter, ui-sans-serif, system-ui, sans-serif; letter-spacing: -.045em; }
        .cleaning-demo__ticker { width: 100vw; margin: 0 calc(50% - 50vw) 34px; overflow: hidden; border-top: 1px solid rgba(255,255,255,.08); border-bottom: 1px solid rgba(255,255,255,.08); background: rgba(17,19,25,.7); }
        .cleaning-demo__ticker-track { display: flex; width: max-content; animation: cleaning-ticker 34s linear infinite; }
        .cleaning-demo__ticker-track span { display: flex; align-items: center; gap: 10px; padding: 15px 25px; color: #a9afbf; white-space: nowrap; font: 10px 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .12em; }
        .cleaning-demo__ticker-track i, .cleaning-demo__status i { display: block; width: 6px; height: 6px; border-radius: 50%; background: #34d399; box-shadow: 0 0 10px rgba(52,211,153,.7); }
        .cleaning-demo__layout { display: grid; grid-template-columns: 1.6fr 1fr; gap: 16px; }
        .cleaning-demo__card, .cleaning-demo__meter { border: 1px solid rgba(255,255,255,.08); border-radius: 20px; background: #111319; box-shadow: 0 25px 70px rgba(0,0,0,.2); }
        .cleaning-demo__card { padding: 25px; }
        .cleaning-demo__card-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 15px; margin-bottom: 24px; }
        .cleaning-demo__eyebrow { margin-bottom: 9px; letter-spacing: .13em; }
        .cleaning-demo__eyebrow svg { color: #22d3ee; }
        .cleaning-demo__card-heading h3, .cleaning-demo__meter h3 { margin: 0; color: #eef0f5; font: 600 18px/1.2 Inter, ui-sans-serif, system-ui, sans-serif; }
        .cleaning-demo__status { display: flex; align-items: center; gap: 7px; color: #8b90a3; font: 10px 'IBM Plex Mono', ui-monospace, monospace; white-space: nowrap; }
        .cleaning-demo__status--done { color: #34d399; }
        .cleaning-demo__table-wrap { overflow-x: auto; }
        .cleaning-demo__table { display: grid; grid-template-columns: .78fr 1.1fr 1.8fr .72fr 24px; min-width: 560px; align-items: center; gap: 12px; }
        .cleaning-demo__table--header { padding: 0 12px 11px; color: #626a7c; font: 9px 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .12em; }
        .cleaning-demo__row { min-height: 47px; margin-bottom: 7px; padding: 0 12px; border: 1px solid rgba(248,113,113,.2); border-radius: 11px; background: rgba(248,113,113,.055); color: #c7ccd7; font: 11px 'IBM Plex Mono', ui-monospace, monospace; transition: border-color .5s ease, background .5s ease, color .5s ease; }
        .cleaning-demo__row--clean { border-color: rgba(52,211,153,.25); background: rgba(52,211,153,.07); color: #d7f8e7; }
        .cleaning-demo__id { color: #858da0; font-size: 10px; }
        .cleaning-demo__email, .cleaning-demo__region { display: flex; align-items: center; gap: 5px; min-width: 0; overflow: hidden; }
        .cleaning-demo__email svg, .cleaning-demo__region svg { flex: 0 0 auto; color: #717b8d; }
        .cleaning-demo__value { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .cleaning-demo__row-icon { display: grid; place-items: center; color: #f87171; }
        .cleaning-demo__row--clean .cleaning-demo__row-icon { color: #34d399; animation: cleaning-check .4s cubic-bezier(.2,1.6,.4,1) both; }
        .cleaning-demo__footer { display: flex; justify-content: space-between; gap: 15px; padding-top: 17px; color: #8b90a3; font: 11px 'IBM Plex Mono', ui-monospace, monospace; }
        .cleaning-demo__footer strong { color: #eef0f5; }.cleaning-demo__footer-done { color: #34d399; }
        .cleaning-demo__meter { display: flex; min-height: 390px; flex-direction: column; align-items: center; justify-content: center; padding: 28px; text-align: center; }
        .cleaning-demo__meter > .cleaning-demo__eyebrow { color: #8b90a3; }
        .cleaning-demo__rings { position: relative; width: 220px; height: 220px; margin: 8px 0 25px; display: grid; place-items: center; }
        .cleaning-demo__rings::before { position: absolute; inset: 36px; border: 1px solid rgba(99,102,241,.4); border-radius: 50%; content: ''; box-shadow: 0 0 38px rgba(99,102,241,.2), inset 0 0 28px rgba(34,211,238,.08); }
        .cleaning-demo__ring { position: absolute; inset: 0; border: 1px solid rgba(34,211,238,.25); border-radius: 50%; opacity: 0; animation: cleaning-ripple 3.6s ease-out infinite; }
        .cleaning-demo__ring--two { animation-delay: 1.2s; }.cleaning-demo__ring--three { animation-delay: 2.4s; }
        .cleaning-demo__score { position: relative; z-index: 1; display: flex; align-items: baseline; justify-content: center; flex-wrap: wrap; width: 112px; }
        .cleaning-demo__score strong { width: 100%; color: #f8fafc; font: 600 37px/1 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: -.06em; }
        .cleaning-demo__score span { width: 100%; margin-top: 7px; color: #71798b; font: 10px 'IBM Plex Mono', ui-monospace, monospace; }
        .cleaning-demo__meter h3 { font-size: 15px; }.cleaning-demo__meter p { margin: 8px 0 0; color: #8b90a3; font: 11px 'IBM Plex Mono', ui-monospace, monospace; }
        @keyframes cleaning-ticker { from { transform: translateX(0); } to { transform: translateX(-33.333333%); } }
        @keyframes cleaning-check { from { opacity: 0; transform: scale(.3); } to { opacity: 1; transform: scale(1); } }
        @keyframes cleaning-ripple { 0% { opacity: 0; transform: scale(.46); } 15% { opacity: .7; } 75%, 100% { opacity: 0; transform: scale(1); } }
        @media (max-width: 820px) { .cleaning-demo__layout { grid-template-columns: 1fr; }.cleaning-demo__meter { min-height: 350px; } }
        @media (max-width: 560px) { .cleaning-demo-section { padding: 72px 18px; }.cleaning-demo__card { padding: 19px 15px; }.cleaning-demo__footer { align-items: flex-start; flex-direction: column; gap: 8px; }.cleaning-demo__meter { min-height: 320px; } }
        @media (prefers-reduced-motion: reduce) { .cleaning-demo__ticker-track, .cleaning-demo__ring { animation: none; }.cleaning-demo__row--clean .cleaning-demo__row-icon { animation: none; } }
      `}</style>
    </section>
  );
}
