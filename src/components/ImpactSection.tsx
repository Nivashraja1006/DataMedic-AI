"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, Database, TrendingDown, TrendingUp } from "lucide-react";

const stats = [
  { value: 48, suffix: "M+", label: "rows cleaned monthly", icon: Database, color: "#818cf8" },
  { value: 98.6, suffix: "%", label: "average accuracy", icon: CheckCircle2, color: "#34d399", decimals: 1 },
  { value: 12, suffix: "x", label: "faster than manual review", icon: Clock3, color: "#22d3ee" },
  { value: 73, suffix: "%", label: "fewer downstream errors", icon: TrendingDown, color: "#f472b6" },
];

const comparisons = [
  { label: "Duplicate records", raw: 78, clean: 12 },
  { label: "Missing values", raw: 64, clean: 9 },
  { label: "Schema mismatches", raw: 52, clean: 6 },
  { label: "Format inconsistencies", raw: 70, clean: 11 },
];

const trendPoints = [52, 56, 58, 62, 65, 69, 72, 76, 79, 84, 89, 94];
const chartPoints = trendPoints.map((value, index) => `${index * 32 + 18},${154 - (value - 45) * 2.15}`).join(" ");

function CountUp({ value, decimals = 0, active, delay }: { value: number; decimals?: number; active: boolean; delay: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let start = 0;
    const timer = window.setTimeout(() => {
      const tick = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / 1100, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Number((value * eased).toFixed(decimals)));
        if (progress < 1) frame = window.requestAnimationFrame(tick);
      };
      frame = window.requestAnimationFrame(tick);
    }, delay);
    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);
    };
  }, [active, delay, decimals, value]);

  return <>{display.toFixed(decimals)}</>;
}

export default function ImpactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const chartLength = 440;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setActive(true);
        observer.disconnect();
      }
    }, { threshold: 0.18 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="impact" className={`impact-section ${active ? "impact-section--active" : ""}`}>
      <div className="impact-section__intro">
        <p>Impact</p>
        <h2>What clean data actually does for your team.</h2>
      </div>

      <div className="impact-section__stats">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div className="impact-stat" key={stat.label} style={{ "--stat-color": stat.color, "--stat-delay": `${index * 150}ms` } as React.CSSProperties}>
              <span className="impact-stat__icon"><Icon size={18} /></span>
              <strong><CountUp value={stat.value} decimals={stat.decimals} active={active} delay={index * 150} />{stat.suffix}</strong>
              <span className="impact-stat__label">{stat.label}</span>
            </div>
          );
        })}
      </div>

      <div className="impact-section__grid">
        <div className="impact-panel">
          <div className="impact-panel__heading">
            <div><span className="impact-panel__eyebrow">Quality delta</span><h3>Before vs. after DataMedic</h3></div>
            <TrendingUp size={18} />
          </div>
          <div className="impact-bars">
            {comparisons.map((metric, index) => (
              <div className="impact-bar-row" key={metric.label} style={{ "--bar-delay": `${index * 130}ms` } as React.CSSProperties}>
                <div className="impact-bar-row__label"><span>{metric.label}</span><span>raw / clean</span></div>
                <div className="impact-bar"><i className="impact-bar__raw" style={{ "--bar-value": `${metric.raw}%` } as React.CSSProperties} /><i className="impact-bar__clean" style={{ "--bar-value": `${metric.clean}%` } as React.CSSProperties} /></div>
                <div className="impact-bar-row__values"><span>{metric.raw}%</span><strong>{metric.clean}%</strong></div>
              </div>
            ))}
          </div>
          <div className="impact-legend"><span><i className="impact-legend__raw" />Raw input</span><span><i className="impact-legend__clean" />Clean output</span></div>
        </div>

        <div className="impact-panel impact-trend">
          <div className="impact-panel__heading">
            <div><span className="impact-panel__eyebrow">12-week signal</span><h3>Org-wide data quality trend</h3></div>
            <span className="impact-trend__delta">+42%</span>
          </div>
          <div className="impact-chart-wrap">
            <div className="impact-chart__axis"><span>100%</span><span>75%</span><span>50%</span></div>
            <svg className="impact-chart" viewBox="0 0 370 180" role="img" aria-label="Data quality trend rising from 52 percent to 94 percent over 12 weeks">
              <defs>
                <linearGradient id="impact-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#6366f1" stopOpacity=".34" /><stop offset="1" stopColor="#22d3ee" stopOpacity="0" /></linearGradient>
                <linearGradient id="impact-line" x1="0" x2="1"><stop stopColor="#6366f1" /><stop offset="1" stopColor="#22d3ee" /></linearGradient>
              </defs>
              {[42, 96, 150].map((y) => <line key={y} x1="18" x2="354" y1={y} y2={y} className="impact-chart__grid" />)}
              <polygon points={`18,${154 - (trendPoints[0] - 45) * 2.15} ${chartPoints} 370,170 18,170`} fill="url(#impact-fill)" className="impact-chart__area" />
              <polyline points={chartPoints} fill="none" stroke="url(#impact-line)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength="100" className="impact-chart__line" style={{ "--chart-length": `${chartLength}` } as React.CSSProperties} />
              <circle cx="370" cy={154 - (trendPoints[trendPoints.length - 1] - 45) * 2.15} r="5" className="impact-chart__dot" />
            </svg>
            <div className="impact-chart__weeks"><span>W1</span><span>W4</span><span>W8</span><span>W12</span></div>
          </div>
          <div className="impact-trend__footer"><CheckCircle2 size={16} /><span>Quality is compounding across every team.</span><AlertTriangle size={15} /></div>
        </div>
      </div>

      <style jsx>{`
        .impact-section { max-width: 1280px; margin: 0 auto; padding: 96px 24px; color: #eef0f5; }
        .impact-section__intro { max-width: 680px; margin: 0 auto 48px; text-align: center; }
        .impact-section__intro p, .impact-panel__eyebrow { margin: 0 0 12px; color: #818cf8; font: 11px 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .2em; text-transform: uppercase; }
        .impact-section__intro h2 { margin: 0; color: #eef0f5; font: 600 clamp(2rem, 4vw, 3.6rem)/1.05 Inter, ui-sans-serif, system-ui, sans-serif; letter-spacing: -.045em; }
        .impact-section__stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .impact-stat { padding: 22px; border: 1px solid rgba(255,255,255,.08); border-radius: 18px; background: #111319; opacity: 0; transform: translateY(18px); transition: opacity .65s ease var(--stat-delay), transform .65s ease var(--stat-delay); }
        .impact-section--active .impact-stat { opacity: 1; transform: translateY(0); }
        .impact-stat__icon { display: grid; width: 38px; height: 38px; margin-bottom: 22px; place-items: center; color: var(--stat-color); border: 1px solid color-mix(in srgb, var(--stat-color) 25%, transparent); border-radius: 11px; background: color-mix(in srgb, var(--stat-color) 13%, transparent); }
        .impact-stat strong { display: block; color: #f8fafc; font: 600 clamp(1.6rem, 3vw, 2.35rem)/1 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: -.05em; }
        .impact-stat__label { display: block; margin-top: 9px; color: #8b90a3; font: 12px/1.4 Inter, ui-sans-serif, system-ui, sans-serif; }
        .impact-section__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 14px; }
        .impact-panel { min-width: 0; padding: 26px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; background: #111319; }
        .impact-panel__heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 28px; }
        .impact-panel__heading h3 { margin: 0; color: #eef0f5; font: 600 18px/1.2 Inter, ui-sans-serif, system-ui, sans-serif; }
        .impact-panel__heading > svg { color: #34d399; }
        .impact-bars { display: grid; gap: 21px; }
        .impact-bar-row__label, .impact-bar-row__values { display: flex; justify-content: space-between; color: #c5cad6; font: 11px 'IBM Plex Mono', ui-monospace, monospace; }
        .impact-bar-row__label span:last-child { color: #606a7c; font-size: 9px; text-transform: uppercase; }
        .impact-bar { display: grid; gap: 4px; margin: 8px 0 5px; }
        .impact-bar i { display: block; height: 7px; border-radius: 99px; transform-origin: left; transform: scaleX(0); transition: transform .85s cubic-bezier(.2,.8,.2,1) var(--bar-delay); }
        .impact-section--active .impact-bar i { transform: scaleX(1); }
        .impact-bar__raw { width: var(--bar-value); background: #fb7185; box-shadow: 0 0 12px rgba(251,113,133,.25); }
        .impact-bar__clean { width: var(--bar-value); background: #34d399; box-shadow: 0 0 12px rgba(52,211,153,.25); }
        .impact-bar-row__values { color: #fb7185; font-size: 10px; }
        .impact-bar-row__values strong { color: #34d399; font-weight: 500; }
        .impact-legend { display: flex; gap: 20px; margin-top: 27px; color: #8b90a3; font: 10px 'IBM Plex Mono', ui-monospace, monospace; }
        .impact-legend span { display: flex; align-items: center; gap: 7px; }
        .impact-legend i { width: 8px; height: 8px; border-radius: 50%; }
        .impact-legend__raw { background: #fb7185; }.impact-legend__clean { background: #34d399; }
        .impact-trend__delta { color: #34d399; font: 12px 'IBM Plex Mono', ui-monospace, monospace; }
        .impact-chart-wrap { position: relative; padding-left: 29px; }
        .impact-chart { display: block; width: 100%; height: auto; overflow: visible; }
        .impact-chart__grid { stroke: rgba(255,255,255,.07); stroke-dasharray: 3 5; }
        .impact-chart__area { opacity: 0; transition: opacity 1s ease .25s; }
        .impact-section--active .impact-chart__area { opacity: 1; }
        .impact-chart__line { stroke-dasharray: 100; stroke-dashoffset: 100; transition: stroke-dashoffset 1.6s cubic-bezier(.2,.8,.2,1) .25s; }
        .impact-section--active .impact-chart__line { stroke-dashoffset: 0; }
        .impact-chart__dot { fill: #22d3ee; stroke: #111319; stroke-width: 4; opacity: 0; transition: opacity .4s ease 1.65s; animation: impact-pulse 1.8s ease-in-out infinite; }
        .impact-section--active .impact-chart__dot { opacity: 1; }
        .impact-chart__axis { position: absolute; top: 2px; bottom: 21px; left: 0; display: flex; flex-direction: column; justify-content: space-between; color: #606a7c; font: 9px 'IBM Plex Mono', ui-monospace, monospace; }
        .impact-chart__weeks { display: flex; justify-content: space-between; color: #606a7c; font: 9px 'IBM Plex Mono', ui-monospace, monospace; }
        .impact-trend__footer { display: flex; align-items: center; gap: 8px; margin-top: 21px; padding-top: 17px; border-top: 1px solid rgba(255,255,255,.08); color: #8b90a3; font: 11px Inter, ui-sans-serif, system-ui, sans-serif; }
        .impact-trend__footer svg:first-child { color: #34d399; }.impact-trend__footer svg:last-child { margin-left: auto; color: #f59e0b; }
        @keyframes impact-pulse { 0%, 100% { filter: drop-shadow(0 0 0 rgba(34,211,238,0)); } 50% { filter: drop-shadow(0 0 8px rgba(34,211,238,.8)); } }
        @media (max-width: 800px) { .impact-section { padding: 72px 18px; }.impact-section__stats, .impact-section__grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px) { .impact-section__stats, .impact-section__grid { grid-template-columns: 1fr; }.impact-section__intro { margin-bottom: 34px; }.impact-panel { padding: 21px; } }
        @media (prefers-reduced-motion: reduce) { .impact-stat, .impact-bar i, .impact-chart__line, .impact-chart__area, .impact-chart__dot { transition-duration: .01ms; animation: none; } }
      `}</style>
    </section>
  );
}
