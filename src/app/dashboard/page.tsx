"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import InsightCarousel from "@/components/InsightCarousel";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { datasetService } from "@/services/api";
import {
  Upload,
  LogOut,
  Database,
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  Sparkles,
  Users,
  ChevronRight,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Bot,
  ShieldCheck,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";

function getScoreColor(value: number) {
  if (value >= 80) return "#34D399";
  if (value >= 60) return "#F2B84B";
  return "#FF6B75";
}

function ScoreRing({ value, label }: { value: number; label: string }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="h-36 w-36 -rotate-90" viewBox="0 0 160 160" aria-label={label}>
        <circle cx="80" cy="80" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" />
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          stroke={getScoreColor(safeValue)}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="display text-4xl font-semibold text-white">{safeValue.toFixed(0)}</span>
        <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Score</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout, isAuthenticated, isLoading } = useAuth();
  const [datasets, setDatasets] = useState<any[]>([]);
  const [isLoadingDatasets, setIsLoadingDatasets] = useState(false);
  const [error, setError] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadName, setUploadName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [processingStage, setProcessingStage] = useState<"idle" | "uploading" | "analyzing" | "completed">("idle");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (token) {
      loadDatasets();
    }
  }, [token]);

  const summary = useMemo(() => {
    const totalDatasets = datasets.length;
    const averageScore =
      totalDatasets > 0
        ? datasets.reduce((sum, item) => sum + (Number(item?.analysis?.overall_score ?? item?.quality_score ?? 0) || 0), 0) / totalDatasets
        : 0;
    const totalRows = datasets.reduce((sum, item) => sum + (Number(item?.rows) || 0), 0);
    const avgNulls =
      totalDatasets > 0
        ? datasets.reduce((sum, item) => sum + (Number(item?.analysis?.null_percent ?? item?.null_percent ?? 0) || 0), 0) / totalDatasets
        : 0;
    const avgDuplicates =
      totalDatasets > 0
        ? datasets.reduce((sum, item) => sum + (Number(item?.analysis?.duplicate_percent ?? item?.duplicate_percent ?? 0) || 0), 0) / totalDatasets
        : 0;

    return {
      totalDatasets,
      averageScore,
      totalRows,
      avgNulls,
      avgDuplicates,
    };
  }, [datasets]);

  const loadDatasets = async () => {
    setIsLoadingDatasets(true);
    try {
      const result = await datasetService.getDatasets(token!);
      setDatasets(result);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load datasets");
    } finally {
      setIsLoadingDatasets(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadName) {
      setError("Please select a file and enter a name");
      return;
    }

    setUploading(true);
    setProcessingStage("uploading");
    setError("");

    try {
      const uploadResult = await datasetService.uploadDataset(uploadFile, uploadName, token!);
      setProcessingStage("analyzing");

      const analyzed = await datasetService.analyzeDataset(uploadResult.dataset.id, token!);
      const mergedDataset = {
        ...uploadResult.dataset,
        quality_score: analyzed.overall_score ?? uploadResult.dataset.quality_score ?? 0,
        analysis: analyzed,
      };

      setDatasets((prev) => [mergedDataset, ...prev]);
      setUploadFile(null);
      setUploadName("");
      setShowUpload(false);
      setProcessingStage("completed");
      window.setTimeout(() => setProcessingStage("idle"), 1800);
    } catch (err: any) {
      setError(err.message || "Upload failed");
      setProcessingStage("idle");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#05070C] flex items-center justify-center text-white">
        <div className="text-center">
          <Sparkles size={48} className="mx-auto mb-4 text-[#6C7CFB]" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const latestDataset = datasets[0];
  const latestScore = Number(latestDataset?.analysis?.overall_score ?? latestDataset?.quality_score ?? 0) || 0;

  return (
    <div className="min-h-screen bg-[#05070C] text-[#EDF0F8] overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .display { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.02em; }
        .glass-panel { backdrop-filter: blur(14px); background: rgba(9, 12, 18, 0.7); }
        .glass-card { background: rgba(15, 19, 29, 0.7); border: 1px solid rgba(255,255,255,0.08); box-shadow: inset 0 1px 0 rgba(255,255,255,0.04); }
        .glow-btn { transition: transform .2s ease, box-shadow .3s ease; }
        .glow-btn:hover { transform: translateY(-1px); box-shadow: 0 12px 36px -10px rgba(108,124,251,0.6); }
        .card-hover { transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease; }
        .card-hover:hover { transform: translateY(-3px); border-color: rgba(156,170,255,0.4); box-shadow: 0 18px 38px -20px rgba(108,124,251,0.7); }
        .animated-bg { position: absolute; inset: 0; background:
          radial-gradient(circle at 20% 20%, rgba(108,124,251,0.18), transparent 22%),
          radial-gradient(circle at 80% 10%, rgba(47,217,196,0.12), transparent 18%),
          radial-gradient(circle at 50% 80%, rgba(154,107,255,0.15), transparent 25%);
          animation: drift 16s ease-in-out infinite alternate;
        }
        @keyframes drift {
          0% { transform: scale(1) translate3d(0,0,0); }
          100% { transform: scale(1.12) translate3d(24px,-18px,0); }
        }
      `}</style>

      <div className="animated-bg" aria-hidden="true" />

      <header className="relative z-10 border-b border-white/8 px-6 py-4 glass-panel">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 transition duration-200 hover:opacity-90 hover:scale-[1.02]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C7CFB] to-[#2FD9C4] flex items-center justify-center shadow-[0_10px_26px_rgba(108,124,251,0.45)] transition duration-200 group-hover:scale-105">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="display text-[20px] font-semibold">DataMedic <span className="text-[#838DA3]">AI</span></h1>
              <p className="text-[11px] text-[#666f82]">Real-time data quality intelligence</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.02]">
              <Users size={14} className="text-[#666f82]" />
              <span className="text-[12px] text-[#B7C0D6]">{user?.username}</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#6C7CFB]/20 text-[#9A6BFF]">{user?.role}</span>
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="flex items-center gap-1.5 text-[12px] px-3 py-2 rounded-lg hover:bg-white/[0.05] text-[#8993A8] hover:text-white transition-colors"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[12px] uppercase tracking-[0.25em] text-[#6C7CFB] mb-2">Operations Overview</p>
            <h2 className="display text-[30px] md:text-[36px] font-semibold mb-2">Welcome, {user?.username}!</h2>
            <p className="text-[#8993A8]">Monitor quality, detect drift, and resolve issues with live AI insights.</p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#6C7CFB]/30 bg-[#5b68f9]/8 px-3 py-2 text-[12px] text-[#c5d0ff]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#34D399] animate-pulse" />
            System live
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Datasets", value: summary.totalDatasets, icon: Database, tone: "#6C7CFB" },
            { label: "Avg. Quality", value: `${summary.averageScore.toFixed(0)}/100`, icon: BarChart3, tone: "#9A6BFF" },
            { label: "Rows Scanned", value: summary.totalRows.toLocaleString(), icon: TrendingUp, tone: "#2FD9C4" },
          ].map((metric) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] text-[#666f82]">{metric.label}</span>
                <div className="rounded-lg p-2" style={{ background: `${metric.tone}22`, color: metric.tone }}>
                  <metric.icon size={16} />
                </div>
              </div>
              <span className="display text-[30px] font-semibold text-white">{metric.value}</span>
            </motion.div>
          ))}
        </div>

        <div className="mb-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[12px] uppercase tracking-[0.2em] text-slate-400">Quality overview</p>
                <h3 className="display text-[20px] font-semibold">Real-time scoring</h3>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[11px] text-slate-300">
                <Activity size={14} className="text-[#34D399]" />
                Live
              </div>
            </div>

            <div className="grid md:grid-cols-[220px_minmax(0,1fr)] gap-6 items-center">
              <div className="flex justify-center">
                <ScoreRing value={latestScore || summary.averageScore || 0} label="Dataset score" />
              </div>

              <div className="space-y-4">
                {[{ label: "Null %", value: summary.avgNulls, color: "#60a5fa" }, { label: "Duplicates %", value: summary.avgDuplicates, color: "#fbbf24" }].map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-[12px] text-slate-300">
                      <span>{item.label}</span>
                      <span>{item.value.toFixed(1)}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/6">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(item.value, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: item.color }}
                      />
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-slate-300">
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                    <div className="text-slate-400">Validity</div>
                    <div className="display text-[20px] font-semibold text-white">{latestDataset?.analysis?.validity_score ?? 0}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                    <div className="text-slate-400">Outliers</div>
                    <div className="display text-[20px] font-semibold text-white">{latestDataset?.analysis?.outlier_percent ?? 0}%</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <InsightCarousel />
        </div>

        <div className="mb-8 glass-card rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[12px] uppercase tracking-[0.2em] text-slate-400">Processing flow</p>
              <h3 className="display text-[20px] font-semibold">Upload → Analyzing → Completed</h3>
            </div>
            <div className="text-[12px] text-slate-300">{processingStage === "idle" ? "Ready" : processingStage}</div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Upload", active: processingStage === "uploading" || processingStage === "analyzing" || processingStage === "completed" },
              { label: "Analyzing", active: processingStage === "analyzing" || processingStage === "completed" },
              { label: "Completed", active: processingStage === "completed" },
            ].map((step, index) => (
              <div key={step.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[12px] text-slate-300">{index + 1}</span>
                  <span className={`h-2.5 w-2.5 rounded-full ${step.active ? "bg-[#34D399]" : "bg-white/10"}`} />
                </div>
                <div className="text-[13px] font-medium text-white">{step.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          {!showUpload ? (
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setShowUpload(true)}
              className="glow-btn w-full rounded-2xl border border-dashed border-[#6C7CFB]/40 bg-gradient-to-r from-[#6C7CFB]/10 to-[#9A6BFF]/10 p-8 text-center"
            >
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="rounded-full bg-[#6C7CFB]/12 p-3 text-[#9A6BFF]">
                  <Upload size={28} />
                </div>
                <div>
                  <p className="display text-[18px] font-semibold text-white">Upload a new dataset</p>
                  <p className="text-[12px] text-[#8993A8]">CSV, Excel, or JSON • Up to 200MB</p>
                </div>
              </div>
            </motion.button>
          ) : (
            <div className="glass-card rounded-3xl p-6">
              <h3 className="display text-[18px] font-semibold mb-4">Upload Dataset</h3>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-[12px] text-[#B7C0D6] mb-2">Dataset Name</label>
                  <input
                    type="text"
                    value={uploadName}
                    onChange={(e) => setUploadName(e.target.value)}
                    placeholder="Customer data • Q1 2026"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] text-white outline-none text-[13px] focus:border-[#6C7CFB]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[12px] text-[#B7C0D6] mb-2">Select File</label>
                  <input
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    accept=".csv,.xlsx,.xls,.json"
                    className="w-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-3 text-[12px] text-slate-300"
                    required
                  />
                  {uploadFile && <p className="mt-2 text-[12px] text-[#34D399]">✓ {uploadFile.name} selected</p>}
                </div>

                {error && (
                  <div className="rounded-xl border border-[#FF6B75]/25 bg-[#FF6B75]/10 p-3 text-[12px] text-[#FF6B75]">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={uploading || !uploadFile || !uploadName}
                    className="glow-btn flex-1 rounded-xl bg-gradient-to-r from-[#6C7CFB] to-[#9A6BFF] px-4 py-3 text-[13px] font-semibold text-white disabled:opacity-50"
                  >
                    {uploading ? "Uploading and analyzing..." : "Upload dataset"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUpload(false);
                      setUploadFile(null);
                      setUploadName("");
                      setError("");
                    }}
                    className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-[13px] text-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="display text-[22px] font-semibold">Your datasets</h3>
            <div className="flex items-center gap-2 text-[12px] text-[#8993A8]">
              <span className="h-2 w-2 rounded-full bg-[#34D399]" />
              {datasets.length} active
            </div>
          </div>

          {isLoadingDatasets ? (
            <div className="glass-card rounded-3xl py-12 text-center text-[#8993A8]">Loading datasets...</div>
          ) : datasets.length === 0 ? (
            <div className="glass-card rounded-3xl py-16 text-center text-[#8993A8]">
              <Database size={48} className="mx-auto mb-4 opacity-60" />
              <p>No datasets yet. Upload one to get started.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {datasets.map((dataset, index) => {
                const score = Number(dataset?.analysis?.overall_score ?? dataset?.quality_score ?? 0) || 0;
                const nullPct = Number(dataset?.analysis?.null_percent ?? dataset?.null_percent ?? 0) || 0;
                const duplicatePct = Number(dataset?.analysis?.duplicate_percent ?? dataset?.duplicate_percent ?? 0) || 0;
                const insight = (dataset?.analysis?.insights ?? ["Dataset uploaded successfully."])[0];

                return (
                  <motion.div
                    key={dataset.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => router.push(`/dashboard/dataset/${dataset.id}`)}
                    className="card-hover cursor-pointer rounded-3xl border border-white/10 glass-card p-5"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="rounded-2xl bg-[#6C7CFB]/12 p-2.5 text-[#8aa2ff]">
                        <FileSpreadsheet size={18} />
                      </div>
                      <div className="rounded-full px-2.5 py-1 text-[10px] font-medium border" style={{ background: `${getScoreColor(score)}20`, borderColor: `${getScoreColor(score)}55`, color: getScoreColor(score) }}>
                        {score.toFixed(0)}/100
                      </div>
                    </div>

                    <h4 className="display text-[18px] font-semibold text-white mb-2">{dataset.name}</h4>

                    <div className="mb-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white/[0.02] p-2.5">
                        <div className="text-[10px] uppercase tracking-[0.15em] text-slate-400">Rows</div>
                        <div className="mt-1 text-[18px] font-semibold text-white">{(dataset.rows || 0).toLocaleString()}</div>
                      </div>
                      <div className="rounded-2xl bg-white/[0.02] p-2.5">
                        <div className="text-[10px] uppercase tracking-[0.15em] text-slate-400">Cols</div>
                        <div className="mt-1 text-[18px] font-semibold text-white">{dataset.cols || 0}</div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {[{ label: "Null %", value: nullPct, color: "#60a5fa" }, { label: "Duplicates %", value: duplicatePct, color: "#fbbf24" }].map((bar) => (
                        <div key={bar.label}>
                          <div className="mb-1 flex items-center justify-between text-[11px] text-slate-300">
                            <span>{bar.label}</span>
                            <span>{bar.value.toFixed(1)}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-white/6">
                            <div className="h-full rounded-full" style={{ width: `${Math.min(bar.value, 100)}%`, background: bar.color }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0d1320] p-3 text-[11px] leading-5 text-slate-300">
                      {insight}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{new Date(dataset.created_at).toLocaleDateString()}</span>
                      <span className="inline-flex items-center gap-1 text-[#b7c0d6]">
                        View <ChevronRight size={12} />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
