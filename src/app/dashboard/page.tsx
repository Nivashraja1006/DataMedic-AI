"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import InsightCarousel from "@/components/InsightCarousel";
import { motion } from "framer-motion";
import Papa from "papaparse";
import * as XLSX from "xlsx";
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

type PreviewMetrics = {
  rows: number;
  columns: number;
  nullPercent: number;
  duplicatePercent: number;
  completeness: number;
  uniqueness: number;
  validity: number;
  score: number;
  outlierPercent: number;
  alerts: string[];
  previewRows: Record<string, any>[];
  parsedSuccessfully: boolean;
};

function getScoreColor(value: number) {
  if (value >= 80) return "#34D399";
  if (value >= 60) return "#F2B84B";
  return "#FF6B75";
}

function normalizeRecordRow(row: Record<string, any>) {
  const normalized: Record<string, any> = {};
  Object.entries(row).forEach(([key, value]) => {
    const cleanKey = String(key || "").trim() || `column_${Math.random().toString(36).slice(2, 8)}`;
    normalized[cleanKey] = value === null || value === undefined ? "" : String(value).trim() === "" ? "" : value;
  });
  return normalized;
}

function normalizeParsedRows(rows: Record<string, any>[]): Record<string, any>[] {
  return rows
    .map((row) => normalizeRecordRow(row || {}))
    .filter((row) => Object.keys(row).length > 0 && Object.values(row).some((value) => value !== null && value !== undefined && String(value).trim() !== ""));
}

function safeNumeric(value: any, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function computeDatasetPreviewMetrics(file: File): Promise<PreviewMetrics> {
  return new Promise((resolve) => {
    const fileName = file.name.toLowerCase();

    const finalizeInvalid = (message: string): void => {
      resolve({
        rows: 0,
        columns: 0,
        nullPercent: 0,
        duplicatePercent: 0,
        completeness: 100,
        uniqueness: 100,
        validity: 100,
        score: 100,
        outlierPercent: 0,
        alerts: [message],
        previewRows: [],
        parsedSuccessfully: false,
      });
    };

    try {
      if (fileName.endsWith(".csv")) {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim() || "column",
          complete: (result) => {
            console.log("CSV parsed output:", result);
            const records = normalizeParsedRows((result.data as Record<string, any>[]) || []);
            if (!records.length) {
              finalizeInvalid("Invalid or empty dataset");
              return;
            }

            const columns = Object.keys(records[0] || {}).length || 0;
            const rows = records.length;
            const totalCells = Math.max(rows * columns, 1);
            let nullCount = 0;
            records.forEach((row) => {
              Object.values(row).forEach((value) => {
                if (value === null || value === undefined || String(value).trim() === "") nullCount += 1;
              });
            });

            const uniqueRows = new Set(records.map((row) => JSON.stringify(Object.values(row).map((value) => String(value).trim()))));
            const duplicateCount = Math.max(rows - uniqueRows.size, 0);
            const nullPercent = (nullCount / totalCells) * 100;
            const duplicatePercent = rows > 0 ? (duplicateCount / rows) * 100 : 0;
            const completeness = 100 - nullPercent;
            const uniqueness = 100 - duplicatePercent;
            const validity = 100;
            const score = (completeness + uniqueness + validity) / 3;

            const previewRows = records.slice(0, 5);
            console.log("Parsed rows preview:", previewRows);
            resolve({
              rows,
              columns,
              nullPercent: Number.isFinite(nullPercent) ? nullPercent : 0,
              duplicatePercent: Number.isFinite(duplicatePercent) ? duplicatePercent : 0,
              completeness: Number.isFinite(completeness) ? completeness : 100,
              uniqueness: Number.isFinite(uniqueness) ? uniqueness : 100,
              validity: Number.isFinite(validity) ? validity : 100,
              score: Number.isFinite(score) ? score : 100,
              outlierPercent: 0,
              alerts: ["File parsed successfully"],
              previewRows,
              parsedSuccessfully: true,
            });
          },
          error: (error) => {
            console.error("CSV parsing error:", error);
            finalizeInvalid("Invalid or empty dataset");
          },
        });
        return;
      }

      if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls") || fileName.endsWith(".json")) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            let records: Record<string, any>[] = [];
            const rawText = String(reader.result || "");

            if (fileName.endsWith(".json")) {
              const parsed = JSON.parse(rawText || "[]");
              records = Array.isArray(parsed)
                ? parsed
                : Array.isArray(parsed?.data)
                  ? parsed.data
                  : Array.isArray(parsed?.rows)
                    ? parsed.rows
                    : [];
            } else {
              const workbook = XLSX.read(reader.result as ArrayBuffer, { type: "array", cellDates: true });
              const sheetName = workbook.SheetNames[0];
              const sheet = workbook.Sheets[sheetName];
              records = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false, blankrows: false }) as Record<string, any>[];
            }

            console.log("Excel/JSON parsed output:", records);
            const cleaned = normalizeParsedRows(records);
            if (!cleaned.length) {
              finalizeInvalid("Invalid or empty dataset");
              return;
            }

            const rows = cleaned.length;
            const columns = Object.keys(cleaned[0] || {}).length || 0;
            const totalCells = Math.max(rows * columns, 1);
            let nullCount = 0;
            cleaned.forEach((row) => {
              Object.values(row).forEach((value) => {
                if (value === null || value === undefined || String(value).trim() === "") nullCount += 1;
              });
            });

            const uniqueRows = new Set(cleaned.map((row) => JSON.stringify(Object.values(row).map((value) => String(value).trim()))));
            const duplicateCount = Math.max(rows - uniqueRows.size, 0);
            const nullPercent = (nullCount / totalCells) * 100;
            const duplicatePercent = rows > 0 ? (duplicateCount / rows) * 100 : 0;
            const completeness = 100 - nullPercent;
            const uniqueness = 100 - duplicatePercent;
            const validity = 100;
            const score = (completeness + uniqueness + validity) / 3;

            const previewRows = cleaned.slice(0, 5);
            console.log("Parsed rows preview:", previewRows);
            resolve({
              rows,
              columns,
              nullPercent: Number.isFinite(nullPercent) ? nullPercent : 0,
              duplicatePercent: Number.isFinite(duplicatePercent) ? duplicatePercent : 0,
              completeness: Number.isFinite(completeness) ? completeness : 100,
              uniqueness: Number.isFinite(uniqueness) ? uniqueness : 100,
              validity: Number.isFinite(validity) ? validity : 100,
              score: Number.isFinite(score) ? score : 100,
              outlierPercent: 0,
              alerts: ["File parsed successfully"],
              previewRows,
              parsedSuccessfully: true,
            });
          } catch (error) {
            console.error("Excel/JSON parsing error:", error);
            finalizeInvalid("Invalid or empty dataset");
          }
        };

        if (fileName.endsWith(".json")) {
          reader.readAsText(file);
          return;
        }

        reader.readAsArrayBuffer(file);
        return;
      }

      finalizeInvalid("Invalid or empty dataset");
    } catch (error) {
      console.error("File parse failed:", error);
      finalizeInvalid("Invalid or empty dataset");
    }
  });
}

function ScoreRing({ value, label }: { value: number; label: string }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="score-shell relative flex items-center justify-center">
      <div className="score-glow" />
      <svg className="h-40 w-40 -rotate-90" viewBox="0 0 160 160" aria-label={label}>
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6C7CFB" />
            <stop offset="50%" stopColor="#9A6BFF" />
            <stop offset="100%" stopColor="#2FD9C4" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" />
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          stroke="url(#scoreGradient)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="drop-shadow-[0_0_18px_rgba(108,124,251,0.8)]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="display text-4xl font-semibold text-white"
        >
          {safeValue.toFixed(0)}
        </motion.span>
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
  const [previewMetrics, setPreviewMetrics] = useState<PreviewMetrics | null>(null);
  const [isCalculatingPreview, setIsCalculatingPreview] = useState(false);
  const [processingStage, setProcessingStage] = useState<"idle" | "uploading" | "analyzing" | "completed">("idle");
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const particles = useMemo(
    () => [
      { left: "10%", top: "18%", size: 4, delay: 0 },
      { left: "22%", top: "68%", size: 3, delay: 1.5 },
      { left: "36%", top: "25%", size: 5, delay: 2.5 },
      { left: "54%", top: "14%", size: 4, delay: 0.8 },
      { left: "68%", top: "44%", size: 6, delay: 3 },
      { left: "82%", top: "28%", size: 4, delay: 1.2 },
      { left: "90%", top: "62%", size: 3, delay: 2.2 },
      { left: "12%", top: "80%", size: 5, delay: 0.5 },
    ],
    [],
  );

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

  useEffect(() => {
    if (!uploadFile) {
      setPreviewMetrics(null);
      setIsCalculatingPreview(false);
      return;
    }

    let active = true;
    setIsCalculatingPreview(true);

    computeDatasetPreviewMetrics(uploadFile)
      .then((metrics) => {
        if (active) {
          setPreviewMetrics(metrics);
        }
      })
      .finally(() => {
        if (active) {
          setIsCalculatingPreview(false);
        }
      });

    return () => {
      active = false;
    };
  }, [uploadFile]);

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
    <div
      className="relative min-h-screen overflow-hidden bg-[#05070C] text-[#EDF0F8]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        setPointer({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .display { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.02em; }
        .glass-panel { backdrop-filter: blur(16px); background: rgba(9, 12, 18, 0.72); border: 1px solid rgba(255,255,255,0.07); box-shadow: inset 0 1px 0 rgba(255,255,255,0.05); }
        .glass-card {
          background: linear-gradient(180deg, rgba(15,19,29,0.82), rgba(9,12,18,0.7));
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 18px 40px -24px rgba(99,102,241,0.82);
        }
        .premium-card {
          position: relative;
          overflow: hidden;
        }
        .premium-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, rgba(108,124,251,0.8), rgba(47,217,196,0.5), rgba(154,107,255,0.8));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.9;
          pointer-events: none;
        }
        .glow-btn { transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
        .glow-btn:hover { transform: translateY(-1px) scale(1.01); box-shadow: 0 0 0 1px rgba(108,124,251,0.2), 0 18px 45px -18px rgba(108,124,251,0.85); }
        .card-hover { transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease; }
        .card-hover:hover { transform: translateY(-3px); border-color: rgba(156,170,255,0.38); box-shadow: 0 18px 38px -20px rgba(108,124,251,0.8), 0 0 0 1px rgba(59,130,246,0.12); }
        .upload-hover { transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
        .upload-hover:hover { transform: scale(1.03); border-color: rgba(108,124,251,0.5); box-shadow: 0 0 0 1px rgba(108,124,251,0.18), 0 18px 40px -18px rgba(108,124,251,0.9), 0 0 28px rgba(59,130,246,0.18); }
        .mesh-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(108,124,251,0.26), transparent 18%),
            radial-gradient(circle at 80% 12%, rgba(140,92,255,0.22), transparent 20%),
            radial-gradient(circle at 60% 80%, rgba(47,217,196,0.18), transparent 20%),
            linear-gradient(120deg, rgba(10,13,20,0.95), rgba(5,7,12,0.96));
          animation: drift 16s ease-in-out infinite alternate;
        }
        .mesh-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(255,255,255,0.03), transparent 28%, rgba(255,255,255,0.02));
        }
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(130, 146, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(130, 146, 255, 0.08) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(circle at center, black 55%, transparent 100%);
          opacity: 0.7;
        }
        .spotlight {
          position: absolute;
          left: var(--mx, 50%);
          top: var(--my, 50%);
          width: 38rem;
          height: 38rem;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(107,122,255,0.18), rgba(115,92,255,0.08), transparent 64%);
          filter: blur(30px);
          pointer-events: none;
        }
        .particle {
          position: absolute;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(255,255,255,0.9), rgba(127,138,255,0.25), transparent 72%);
          box-shadow: 0 0 18px rgba(127,138,255,0.5);
          animation: floatParticle 14s ease-in-out infinite;
        }
        .score-shell {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .score-glow {
          position: absolute;
          inset: 12%;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(108,124,251,0.32), rgba(154,107,255,0.18), transparent 70%);
          filter: blur(24px);
          animation: pulseGlow 2.8s ease-in-out infinite;
        }
        .progress-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transform: translateX(-100%);
          animation: shimmer 2.5s infinite;
        }
        .alert-card { animation: slideInUp 0.5s ease-out; }
        .status-dot {
          box-shadow: 0 0 18px rgba(52,211,153,0.8);
        }
        @keyframes drift {
          0% { transform: scale(1) translate3d(0,0,0); }
          100% { transform: scale(1.12) translate3d(24px,-18px,0); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.75; transform: scale(0.94); }
          50% { opacity: 1; transform: scale(1.06); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(120%); }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.25; }
          50% { transform: translateY(-18px) scale(1.3); opacity: 0.9; }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="mesh-bg" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />
      <div className="spotlight" aria-hidden="true" style={{ ['--mx' as any]: `${pointer.x}px`, ['--my' as any]: `${pointer.y}px` }} />
      {particles.map((particle, index) => (
        <span
          key={index}
          className="particle"
          style={{
            left: particle.left,
            top: particle.top,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
          }}
          aria-hidden="true"
        />
      ))}

      <header className="relative z-10 border-b border-white/8 px-6 py-4 glass-panel">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2 transition duration-200 hover:opacity-100 hover:scale-[1.02]" aria-label="Go to DataMedic AI home">
            <Image
              src="/logo-main.svg"
              alt="DataMedic AI logo"
              width={220}
              height={52}
              priority
              className="h-[42px] w-auto object-contain transition-all duration-200 group-hover:scale-105 group-hover:drop-shadow-[0_0_14px_rgba(59,130,246,0.5)] md:h-[46px]"
            />
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
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: index * 0.08, ease: "easeOut" }}
              className="premium-card glass-card rounded-2xl p-4"
              whileHover={{ y: -4, scale: 1.01 }}
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
            className="premium-card glass-card rounded-3xl p-6"
            whileHover={{ y: -2 }}
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

        <div className="premium-card mb-8 glass-card rounded-3xl p-5">
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
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={() => setShowUpload(true)}
              className="upload-hover glow-btn w-full rounded-2xl border border-dashed border-[#6C7CFB]/40 bg-gradient-to-r from-[#6C7CFB]/10 to-[#9A6BFF]/10 p-8 text-center"
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
            <div className="premium-card glass-card rounded-3xl p-6">
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

                {uploadFile && (
                  <div className="premium-card rounded-2xl border border-white/10 bg-[#0A1220]/90 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Live dataset preview</p>
                        <h4 className="display text-[18px] font-semibold text-white">{uploadName || uploadFile.name}</h4>
                      </div>
                      {isCalculatingPreview ? (
                        <div className="flex items-center gap-2 rounded-full border border-[#6C7CFB]/30 bg-[#6C7CFB]/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#A9B9FF]">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-[#6C7CFB]" />
                          Analyzing
                        </div>
                      ) : previewMetrics ? (
                        <div className="rounded-full border border-[#34D399]/30 bg-[#34D399]/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#7AE8BA]">
                          {previewMetrics.score.toFixed(0)}/100
                        </div>
                      ) : null}
                    </div>

                    {previewMetrics ? (
                      <div className="space-y-4">
                        {previewMetrics.rows === 0 && previewMetrics.columns === 0 ? (
                          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-[12px] text-red-200">
                            Invalid or empty dataset
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-300 sm:grid-cols-4">
                              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
                                <div className="text-slate-400">Rows</div>
                                <div className="display mt-1 text-[18px] text-white">{previewMetrics.rows}</div>
                              </div>
                              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
                                <div className="text-slate-400">Cols</div>
                                <div className="display mt-1 text-[18px] text-white">{previewMetrics.columns}</div>
                              </div>
                              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
                                <div className="text-slate-400">Null %</div>
                                <div className="display mt-1 text-[18px] text-white">{previewMetrics.nullPercent.toFixed(1)}%</div>
                              </div>
                              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
                                <div className="text-slate-400">Dup %</div>
                                <div className="display mt-1 text-[18px] text-white">{previewMetrics.duplicatePercent.toFixed(1)}%</div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              {[
                                { label: "Completeness", value: previewMetrics.completeness, color: "#60a5fa" },
                                { label: "Uniqueness", value: previewMetrics.uniqueness, color: "#34D399" },
                                { label: "Validity", value: previewMetrics.validity, color: "#9A6BFF" },
                              ].map((metric) => (
                                <div key={metric.label}>
                                  <div className="mb-1 flex items-center justify-between text-[11px] text-slate-300">
                                    <span>{metric.label}</span>
                                    <span>{metric.value.toFixed(1)}%</span>
                                  </div>
                                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/6">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${Math.min(metric.value, 100)}%` }}
                                      transition={{ duration: 0.8, ease: "easeOut" }}
                                      className="h-full rounded-full"
                                      style={{ background: metric.color }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3">
                              <div>
                                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Quality score</div>
                                <div className="display text-[20px] text-white">{previewMetrics.score.toFixed(0)}/100</div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {previewMetrics.alerts.map((alert) => (
                                  <span
                                    key={alert}
                                    className="rounded-full border border-white/10 bg-[#0D1424] px-2 py-1 text-[10px] text-slate-200"
                                    style={{ boxShadow: alert.includes("success") || alert.includes("healthy") ? "0 0 18px rgba(52,211,153,0.2)" : "0 0 18px rgba(251,191,36,0.12)" }}
                                  >
                                    {alert}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {previewMetrics.previewRows.length > 0 && (
                              <div className="rounded-xl border border-white/10 bg-[#0B1120] p-3">
                                <div className="mb-2 flex items-center justify-between">
                                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Preview</div>
                                  <div className="text-[10px] uppercase tracking-[0.14em] text-[#34D399]">File parsed successfully</div>
                                </div>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full text-left text-[11px] text-slate-200">
                                    <thead>
                                      <tr>
                                        {Object.keys(previewMetrics.previewRows[0]).map((header) => (
                                          <th key={header} className="border-b border-white/10 px-2 py-1.5 font-medium text-slate-300">
                                            {header}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {previewMetrics.previewRows.map((row, index) => (
                                        <tr key={`${index}-${Object.values(row).join("-")}`}>
                                          {Object.values(row).map((value, valueIndex) => (
                                            <td key={`${index}-${valueIndex}`} className="border-b border-white/5 px-2 py-1.5 text-slate-300">
                                              {String(value ?? "")}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-3 text-[12px] text-slate-400">
                        Preparing preview metrics...
                      </div>
                    )}
                  </div>
                )}

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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
                    onClick={() => router.push(`/dashboard/dataset/${dataset.id}`)}
                    className="card-hover premium-card cursor-pointer rounded-3xl border border-white/10 glass-card p-5"
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
                        <div key={bar.label} className="alert-card">
                          <div className="mb-1 flex items-center justify-between text-[11px] text-slate-300">
                            <span>{bar.label}</span>
                            <span style={{ color: bar.color }}>{bar.value.toFixed(1)}%</span>
                          </div>
                          <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/6">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(bar.value, 100)}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="relative h-full rounded-full"
                              style={{ background: `linear-gradient(90deg, ${bar.color}, #9A6BFF)` }}
                            >
                              <span className="progress-shine" />
                            </motion.div>
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
