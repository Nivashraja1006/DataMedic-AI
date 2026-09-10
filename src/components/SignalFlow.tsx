"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  CheckCircle2,
  Database,
  Gauge,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

const stages = [
  { label: "Upload", icon: Database, color: "#60a5fa", glow: "rgba(96,165,250,.28)" },
  { label: "Parsing", icon: Sparkles, color: "#a78bfa", glow: "rgba(167,139,250,.28)" },
  { label: "Cleaning", icon: ShieldCheck, color: "#4ade80", glow: "rgba(74,222,128,.28)" },
  { label: "Validation", icon: Gauge, color: "#22d3ee", glow: "rgba(34,211,238,.28)" },
  { label: "AI Insight", icon: Bot, color: "#f472b6", glow: "rgba(244,114,182,.28)" },
];

const paths = stages.map((_, index) => {
  const y = 29 + index * 60;
  const bend = index < 2 ? 8 : index > 2 ? -8 : 0;
  return `M 55 ${y} C 105 ${y}, 135 ${150 + bend}, 238 150`;
});

export default function SignalFlow() {
  const panelRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1500;
    const animateScore = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setScore(Math.round(92 * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) requestAnimationFrame(animateScore);
    };
    const frame = requestAnimationFrame(animateScore);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);

  const updateTilt = () => {
    frameRef.current = null;
    setTilt((current) => {
      const next = {
        x: current.x + (targetRef.current.x - current.x) * 0.14,
        y: current.y + (targetRef.current.y - current.y) * 0.14,
      };
      if (Math.abs(targetRef.current.x - next.x) > 0.01 || Math.abs(targetRef.current.y - next.y) > 0.01) {
        frameRef.current = requestAnimationFrame(updateTilt);
      }
      return next;
    });
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const panel = panelRef.current;
    if (!panel) return;
    const bounds = panel.getBoundingClientRect();
    targetRef.current = {
      x: ((event.clientY - bounds.top) / bounds.height - 0.5) * -6,
      y: ((event.clientX - bounds.left) / bounds.width - 0.5) * 6,
    };
    panel.style.setProperty("--pointer-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    panel.style.setProperty("--pointer-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
    if (!frameRef.current) frameRef.current = requestAnimationFrame(updateTilt);
  };

  const handlePointerLeave = () => {
    targetRef.current = { x: 0, y: 0 };
    panelRef.current?.style.setProperty("--pointer-x", "68%");
    panelRef.current?.style.setProperty("--pointer-y", "42%");
    if (!frameRef.current) frameRef.current = requestAnimationFrame(updateTilt);
  };

  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - score / 100);

  return (
    <div
      ref={panelRef}
      className="signal-flow"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
    >
      <div className="signal-flow__light" />
      <header className="signal-flow__header">
        <div className="signal-flow__title-group">
          <span className="signal-flow__badge"><Database size={16} /></span>
          <div>
            <h2>Signal flow</h2>
            <p>customer_export.csv <span>• 214 rows / 14 columns</span></p>
          </div>
        </div>
        <div className="signal-flow__live"><i /> LIVE</div>
      </header>

      <div className="signal-flow__diagram">
        <svg className="signal-flow__paths" viewBox="0 0 420 300" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="signal-core-gradient" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#818cf8" />
              <stop offset=".52" stopColor="#22d3ee" />
              <stop offset="1" stopColor="#4ade80" />
            </linearGradient>
            {paths.map((path, index) => <path key={path} id={`signal-path-${index}`} d={path} />)}
          </defs>
          {paths.map((path, index) => (
            <g key={`flow-${path}`}>
              <path d={path} className="signal-flow__track" style={{ stroke: stages[index].color }} />
              {[2, 1, 0].map((trail) => (
                <circle key={trail} r={trail === 0 ? 3.8 : trail === 1 ? 2.5 : 1.6} fill={stages[index].color} opacity={trail === 0 ? 1 : trail === 1 ? 0.45 : 0.18}>
                  <animateMotion dur="2.8s" begin={`${index * 0.43 + trail * 0.11}s`} repeatCount="indefinite" path={path} />
                </circle>
              ))}
            </g>
          ))}
        </svg>

        <div className="signal-flow__stages">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <div className="signal-flow__stage" key={stage.label} style={{ "--stage-color": stage.color, "--stage-glow": stage.glow, animationDelay: `${index * 90}ms` } as React.CSSProperties}>
                <span className="signal-flow__stage-icon"><Icon size={16} /></span>
                <span>{stage.label}</span>
              </div>
            );
          })}
        </div>

        <div className="signal-flow__core-wrap">
          <div className="signal-flow__ping signal-flow__ping--one" />
          <div className="signal-flow__ping signal-flow__ping--two" />
          <svg className="signal-flow__ring" viewBox="0 0 124 124" aria-label={`Trust score ${score} out of 100`}>
            <circle className="signal-flow__ring-track" cx="62" cy="62" r="54" />
            <circle className="signal-flow__ring-value" cx="62" cy="62" r="54" stroke="url(#signal-core-gradient)" style={{ strokeDasharray: circumference, strokeDashoffset: offset }} />
          </svg>
          <div className="signal-flow__score"><strong>{score}</strong><span>/ 100</span></div>
        </div>

        <div className="signal-flow__core-copy"><strong>Trust score</strong><span>updated continuously<br />across all stages</span></div>
      </div>

      <div className="signal-flow__footer">
        <div><Zap size={15} /><strong>214 rows/s</strong><span>throughput</span></div>
        <div><CheckCircle2 size={15} /><strong>5/5 passing</strong><span>quality gates</span></div>
      </div>

      <style jsx>{`
        .signal-flow { --panel: #111319; position: relative; isolation: isolate; overflow: hidden; min-height: 490px; padding: 22px 24px 18px; color: #eef2ff; border: 1px solid rgba(255,255,255,.09); border-radius: 28px; background: linear-gradient(140deg, #171a24 0%, #101218 54%, #11171a 100%); box-shadow: 0 28px 80px rgba(0,0,0,.42), inset 0 1px rgba(255,255,255,.04); transition: transform .7s cubic-bezier(.2,.8,.2,1); animation: signal-entry .8s cubic-bezier(.2,.8,.2,1) both; }
        .signal-flow__light { position: absolute; z-index: -1; pointer-events: none; inset: 0; opacity: .42; background: radial-gradient(circle at var(--pointer-x, 68%) var(--pointer-y, 42%), rgba(34,211,238,.14), transparent 30%), radial-gradient(circle at 5% 100%, rgba(129,140,248,.12), transparent 34%); transition: background .18s ease-out; }
        .signal-flow__header, .signal-flow__title-group, .signal-flow__live, .signal-flow__footer div { display: flex; align-items: center; }
        .signal-flow__header { justify-content: space-between; gap: 12px; }
        .signal-flow__title-group { gap: 11px; }
        .signal-flow__badge { display: grid; width: 34px; height: 34px; place-items: center; color: #a5b4fc; border: 1px solid rgba(129,140,248,.28); border-radius: 11px; background: rgba(129,140,248,.12); }
        h2, p { margin: 0; }
        h2 { font: 600 16px/1.2 Inter, ui-sans-serif, system-ui, sans-serif; letter-spacing: -.01em; }
        .signal-flow__title-group p { margin-top: 4px; color: #8991a4; font: 11px/1.3 'IBM Plex Mono', ui-monospace, monospace; }
        .signal-flow__title-group p span { color: #626b7d; }
        .signal-flow__live { gap: 7px; padding: 6px 9px; color: #86efac; border: 1px solid rgba(74,222,128,.24); border-radius: 999px; background: rgba(74,222,128,.08); font: 10px 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .14em; }
        .signal-flow__live i { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 0 0 rgba(74,222,128,.65); animation: live-pulse 1.8s infinite; }
        .signal-flow__diagram { position: relative; height: 330px; margin-top: 19px; }
        .signal-flow__paths { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
        .signal-flow__paths defs path { fill: none; }
        .signal-flow__track { fill: none; opacity: .18; stroke-width: 1.3; stroke-dasharray: 3 6; }
        .signal-flow__stages { position: absolute; top: 0; bottom: 0; left: 0; width: 35%; display: flex; flex-direction: column; justify-content: space-between; padding: 3px 0; }
        .signal-flow__stage { display: flex; align-items: center; gap: 10px; opacity: 0; transform: translateX(-14px); animation: stage-in .6s cubic-bezier(.2,.8,.2,1) forwards; color: #cdd2df; font: 500 12px Inter, ui-sans-serif, system-ui, sans-serif; }
        .signal-flow__stage-icon { display: grid; width: 34px; height: 34px; place-items: center; color: var(--stage-color); border: 1px solid color-mix(in srgb, var(--stage-color) 30%, transparent); border-radius: 10px; background: var(--stage-glow); box-shadow: 0 0 20px var(--stage-glow); }
        .signal-flow__core-wrap { position: absolute; top: 50%; left: 62%; width: 124px; height: 124px; transform: translate(-50%, -50%); }
        .signal-flow__ring { position: absolute; inset: 0; transform: rotate(-90deg); overflow: visible; }
        .signal-flow__ring-track, .signal-flow__ring-value { fill: #111722; stroke-width: 5; }
        .signal-flow__ring-track { stroke: rgba(255,255,255,.08); }
        .signal-flow__ring-value { fill: none; stroke-linecap: round; filter: drop-shadow(0 0 5px rgba(34,211,238,.45)); transition: stroke-dashoffset .1s linear; }
        .signal-flow__score { position: absolute; inset: 0; display: flex; align-items: baseline; justify-content: center; align-content: center; flex-wrap: wrap; padding-top: 2px; }
        .signal-flow__score strong { width: 100%; color: #f8fafc; text-align: center; font: 600 32px/1 'IBM Plex Mono', ui-monospace, monospace; }
        .signal-flow__score span { width: 100%; color: #697386; text-align: center; font: 10px 'IBM Plex Mono', ui-monospace, monospace; }
        .signal-flow__ping { position: absolute; inset: -10px; border: 1px solid rgba(34,211,238,.22); border-radius: 50%; animation: ping 3.2s ease-out infinite; }
        .signal-flow__ping--two { inset: -22px; border-color: rgba(129,140,248,.13); animation-delay: 1.35s; }
        .signal-flow__core-copy { position: absolute; top: 50%; left: 76%; transform: translateY(-50%); white-space: nowrap; }
        .signal-flow__core-copy strong { display: block; color: #e2e8f0; font: 600 13px Inter, ui-sans-serif, system-ui, sans-serif; }
        .signal-flow__core-copy span { display: block; margin-top: 5px; color: #70798b; font: 10px/1.55 'IBM Plex Mono', ui-monospace, monospace; }
        .signal-flow__footer { display: flex; gap: 28px; padding-top: 17px; border-top: 1px solid rgba(255,255,255,.08); }
        .signal-flow__footer div { gap: 8px; flex-wrap: wrap; color: #8892a5; font-size: 11px; }
        .signal-flow__footer svg { color: #67e8f9; }
        .signal-flow__footer strong { color: #e7ebf5; font: 600 12px 'IBM Plex Mono', ui-monospace, monospace; }
        .signal-flow__footer span { width: 100%; margin-left: 23px; color: #656e80; font: 10px 'IBM Plex Mono', ui-monospace, monospace; }
        @keyframes signal-entry { from { opacity: 0; transform: perspective(1100px) translateY(18px); } to { opacity: 1; transform: perspective(1100px) translateY(0); } }
        @keyframes stage-in { to { opacity: 1; transform: translateX(0); } }
        @keyframes ping { 0%, 100% { opacity: .12; transform: scale(.94); } 45% { opacity: .5; transform: scale(1.02); } }
        @keyframes live-pulse { 70% { box-shadow: 0 0 0 5px transparent; } 100% { box-shadow: 0 0 0 0 transparent; } }
        @media (max-width: 560px) { .signal-flow { min-height: 510px; padding: 18px 16px 16px; } .signal-flow__diagram { height: 350px; } .signal-flow__stages { width: 42%; } .signal-flow__core-wrap { left: 59%; transform: translate(-50%, -50%) scale(.82); } .signal-flow__core-copy { top: 85%; left: 51%; transform: translateX(-50%); text-align: center; } .signal-flow__core-copy span br { display: none; } .signal-flow__footer { gap: 14px; } }
        @media (prefers-reduced-motion: reduce) { .signal-flow, .signal-flow__stage, .signal-flow__live i, .signal-flow__ping { animation: none; } }
      `}</style>
    </div>
  );
}