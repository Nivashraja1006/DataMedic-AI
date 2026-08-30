"use client";

import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { datasetService } from "@/services/api";
import {
  ArrowLeft, BarChart3, AlertTriangle, CheckCircle2, Gauge, Download,
  FileSpreadsheet, RefreshCw, Sparkles, Eye, Copy, Ban, Hash,
  GitCompare, TrendingUp, Percent, Info, Send, Bot, User as UserIcon,
  Filter, ChevronDown, ChevronRight
} from "lucide-react";

export default function DatasetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const datasetId = Number(params.id);
  const { token, isAuthenticated } = useAuth();

  const [dataset, setDataset] = useState<any>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [scores, setScores] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [profiling, setProfiling] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [severityFilter, setSeverityFilter] = useState("All");
  const [messages, setMessages] = useState<any[]>([]);
  const [copilotInput, setCopilotInput] = useState("");
  const [copilotLoading, setCopilotLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    loadData();
  }, [isAuthenticated, token]);

  const loadData = async () => {
    setLoading(true);
    try {
      const datasetRes = await datasetService.getDataset(datasetId, token!);
      setDataset(datasetRes);

      const profileRes = await datasetService.profileDataset(datasetId, token!);
      setProfiles(profileRes.columns_profile || []);

      const issuesRes = await datasetService.getIssues(datasetId, token!);
      setIssues(issuesRes);

      const scoreRes = await datasetService.scoreDataset(datasetId, token!);
      setScores(scoreRes);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfile = async () => {
    setProfiling(true);
    try {
      const result = await datasetService.profileDataset(datasetId, token!);
      setProfiles(result.columns_profile || []);
    } catch (error) {
      console.error("Error profiling:", error);
    } finally {
      setProfiling(false);
    }
  };

  const handleDetect = async () => {
    setDetecting(true);
    try {
      const result = await datasetService.detectIssues(datasetId, token!);
      setIssues(result.issues || []);
    } catch (error) {
      console.error("Error detecting issues:", error);
    } finally {
      setDetecting(false);
    }
  };

  const handleScore = async () => {
    setScoring(true);
    try {
      const result = await datasetService.scoreDataset(datasetId, token!);
      setScores(result);
    } catch (error) {
      console.error("Error scoring:", error);
    } finally {
      setScoring(false);
    }
  };

  const handleCopilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim()) return;

    const userMessage = copilotInput;
    setCopilotInput("");
    setMessages([...messages, { role: "user", text: userMessage }]);
    setCopilotLoading(true);

    try {
      const result = await datasetService.getDataset(datasetId, token!);
      // Simulate copilot response based on question
      const response = generateCopilotResponse(userMessage, result, issues);
      setMessages(prev => [...prev, { role: "bot", text: response }]);
    } catch (error) {
      console.error("Copilot error:", error);
    } finally {
      setCopilotLoading(false);
    }
  };

  const generateCopilotResponse = (question: string, dataset: any, issues: any[]) => {
    const q = question.toLowerCase();
    if (q.includes("why") || q.includes("quality")) {
      return `Your dataset has a quality score of ${dataset.quality_score}/100. Main issues: ${issues.length} detected problems including ${issues.filter(i => i.severity === "High").length} high-severity issues.`;
    }
    if (q.includes("fix") || q.includes("should")) {
      return `I recommend: 1) Address ${issues.filter(i => i.severity === "High").length} high-severity issues first, 2) Remove duplicates, 3) Validate formats, 4) Review outliers.`;
    }
    return `Based on your dataset analysis, you have ${issues.length} total issues detected. The quality score is ${dataset.quality_score}/100.`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070C] flex items-center justify-center text-white">
        <Sparkles size={48} className="animate-spin" />
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="min-h-screen bg-[#05070C] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="mb-4">Dataset not found</p>
          <button onClick={() => router.push("/dashboard")} className="text-[#6C7CFB] hover:underline">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const filteredIssues = severityFilter === "All" 
    ? issues 
    : issues.filter(i => i.severity === severityFilter);

  const categoryIcon: any = {
    duplicate: Copy,
    missing: Ban,
    format: Hash,
    consistency: GitCompare,
    outlier: TrendingUp,
    type: Percent,
  };

  return (
    <div className="min-h-screen bg-[#05070C] text-[#EDF0F8]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .display { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.02em; }
        .card-hover { transition: transform .25s ease, border-color .25s ease; }
        .card-hover:hover { transform: translateY(-2px); }
        .tab-btn { transition: background .2s ease, color .2s ease; }
      `}</style>

      {/* Header */}
      <header className="border-b border-white/8 px-6 py-4 sticky top-0 bg-[#05070C]/80 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => router.push("/dashboard")} className="flex items-center gap-1 text-[#8993A8] hover:text-white text-[13px]">
              <ArrowLeft size={16} /> Back
            </button>
            <div className="flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-[#6C7CFB]" />
              <h1 className="display text-[18px] font-semibold">{dataset.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#666f82]">
            <span>{dataset.rows?.toLocaleString()} rows</span>
            <span>•</span>
            <span>{dataset.cols} cols</span>
            <span>•</span>
            <span className="px-2 py-1 rounded font-medium" style={{
              background: `${dataset.quality_score >= 80 ? '#34D399' : dataset.quality_score >= 60 ? '#F2B84B' : '#FF6B75'}20`,
              color: dataset.quality_score >= 80 ? '#34D399' : dataset.quality_score >= 60 ? '#F2B84B' : '#FF6B75'
            }}>
              {dataset.quality_score?.toFixed(1) || 0}/100
            </span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/8 px-6 bg-[#05070C]/50">
        <div className="max-w-7xl mx-auto flex gap-1">
          {[
            { id: "profile", label: "Profile", icon: BarChart3 },
            { id: "issues", label: "Issues", icon: AlertTriangle },
            { id: "scores", label: "Scores", icon: Gauge },
            { id: "copilot", label: "AI Copilot", icon: Sparkles },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn flex items-center gap-2 px-4 py-3 text-[13px] font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#6C7CFB] text-white"
                  : "border-transparent text-[#8993A8] hover:text-white"
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="display text-[20px] font-semibold">Data Profile</h2>
              <button
                onClick={handleProfile}
                disabled={profiling}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#6C7CFB] to-[#9A6BFF] text-white text-[12px] disabled:opacity-50"
              >
                <RefreshCw size={14} className={profiling ? "animate-spin" : ""} />
                {profiling ? "Profiling..." : "Re-profile"}
              </button>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-white/8 text-[#666f82] text-[11px] uppercase bg-white/[0.01]">
                      <th className="text-left px-5 py-3 font-medium">Column</th>
                      <th className="text-left px-3 py-3 font-medium">Type</th>
                      <th className="text-left px-3 py-3 font-medium">Null %</th>
                      <th className="text-left px-3 py-3 font-medium">Unique %</th>
                      <th className="text-left px-3 py-3 font-medium">Missing</th>
                      <th className="text-left px-3 py-3 font-medium">Unique</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((profile, idx) => (
                      <tr key={idx} className="border-t border-white/6 hover:bg-white/[0.02]">
                        <td className="px-5 py-3 text-[#D6DBE8] font-medium">{profile.name}</td>
                        <td className="px-3 py-3 text-[#8993A8]">{profile.type}</td>
                        <td className="px-3 py-3" style={{ color: profile.null_percent > 5 ? "#F2B84B" : "#8993A8" }}>
                          {profile.null_percent.toFixed(1)}%
                        </td>
                        <td className="px-3 py-3 text-[#8993A8]">{profile.unique_percent.toFixed(1)}%</td>
                        <td className="px-3 py-3 text-[#666f82]">{profile.missing_count}</td>
                        <td className="px-3 py-3 text-[#666f82]">{profile.unique_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ISSUES TAB */}
        {activeTab === "issues" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="display text-[20px] font-semibold">Detected Issues ({issues.length})</h2>
              <button
                onClick={handleDetect}
                disabled={detecting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#6C7CFB] to-[#9A6BFF] text-white text-[12px] disabled:opacity-50"
              >
                <RefreshCw size={14} className={detecting ? "animate-spin" : ""} />
                {detecting ? "Detecting..." : "Detect Issues"}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {["All", "High", "Medium", "Low"].map(severity => (
                <button
                  key={severity}
                  onClick={() => setSeverityFilter(severity)}
                  className={`px-3 py-1.5 text-[11px] rounded-lg font-medium transition-colors ${
                    severityFilter === severity
                      ? "bg-white/10 text-white border border-white/20"
                      : "bg-white/[0.02] text-[#8993A8] border border-white/10 hover:text-white"
                  }`}
                >
                  {severity}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredIssues.length === 0 ? (
                <div className="text-center py-12 text-[#8993A8]">
                  <CheckCircle2 size={48} className="mx-auto mb-3 opacity-50 text-[#34D399]" />
                  <p>No {severityFilter === "All" ? "" : severityFilter.toLowerCase()} severity issues found!</p>
                </div>
              ) : (
                filteredIssues.map((issue) => {
                  const IconComponent = categoryIcon[issue.category as keyof typeof categoryIcon] || AlertTriangle;
                  const severityColorMap: Record<string, string> = {
                    High: "#FF6B75",
                    Medium: "#F2B84B",
                    Low: "#8993A8",
                  };
                  const severityColor = severityColorMap[issue.severity] || "#8993A8";

                  return (
                    <div key={issue.id} className="card-hover rounded-xl border border-white/10 bg-white/[0.02] p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{
                          background: `${severityColor}20`,
                          color: severityColor
                        }}>
                          <IconComponent size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[13px] font-semibold text-white">{issue.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-medium" style={{
                              background: `${severityColor}20`,
                              color: severityColor
                            }}>
                              {issue.severity}
                            </span>
                          </div>
                          <p className="text-[12px] text-[#8993A8] mb-2">{issue.description}</p>
                          <div className="flex items-center gap-4 text-[11px] text-[#666f82]">
                            <span>Column: <span className="text-[#B7C0D6]">{issue.column || "N/A"}</span></span>
                            <span>Affected: <span className="text-[#B7C0D6]">{issue.affected_rows?.toLocaleString() || 0} rows</span></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* SCORES TAB */}
        {activeTab === "scores" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="display text-[20px] font-semibold">Quality Scores</h2>
              <button
                onClick={handleScore}
                disabled={scoring}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#6C7CFB] to-[#9A6BFF] text-white text-[12px] disabled:opacity-50"
              >
                <RefreshCw size={14} className={scoring ? "animate-spin" : ""} />
                {scoring ? "Calculating..." : "Recalculate"}
              </button>
            </div>

            {scores ? (
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center">
                  <p className="text-[12px] text-[#666f82] mb-2">Overall Quality Score</p>
                  <p className="display text-[56px] font-bold" style={{
                    color: scores.overall_score >= 80 ? "#34D399" : scores.overall_score >= 60 ? "#F2B84B" : "#FF6B75"
                  }}>
                    {scores.overall_score.toFixed(1)}
                  </p>
                  <p className="text-[12px] text-[#8993A8] mt-2">out of 100</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                  <p className="text-[13px] font-semibold text-white mb-4">Dimension Scores</p>
                  <div className="space-y-3">
                    {Object.entries(scores.dimension_scores || {}).map(([key, value]: [string, any]) => (
                      <div key={key}>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-[#B7C0D6] capitalize">{key}</span>
                          <span className="text-white font-medium">{value.toFixed(0)}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, value)}%`,
                              background: value >= 80 ? "#34D399" : value >= 60 ? "#F2B84B" : "#FF6B75"
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-[#8993A8]">
                <p>Run detection to calculate scores</p>
              </div>
            )}
          </div>
        )}

        {/* COPILOT TAB */}
        {activeTab === "copilot" && (
          <div className="space-y-6">
            <h2 className="display text-[20px] font-semibold">AI Data Quality Copilot</h2>
            
            <div className="rounded-xl border border-white/10 bg-white/[0.02] h-96 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-[#8993A8] text-[12px]">
                    <p>Ask me anything about your dataset's quality...</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[12px] ${
                        msg.role === "user"
                          ? "bg-white/10 text-white"
                          : "bg-gradient-to-br from-[#6C7CFB] to-[#2FD9C4] text-white"
                      }`}>
                        {msg.role === "user" ? "U" : "AI"}
                      </div>
                      <div className={`max-w-[80%] text-[12px] rounded-lg px-3 py-2 ${
                        msg.role === "user"
                          ? "bg-white/10 text-white"
                          : "bg-black/25 text-[#D6DBE8]"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleCopilot} className="border-t border-white/8 p-4 flex gap-2">
                <input
                  value={copilotInput}
                  onChange={(e) => setCopilotInput(e.target.value)}
                  placeholder="Ask about your data..."
                  className="flex-1 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02] text-white outline-none text-[12px]"
                />
                <button
                  type="submit"
                  disabled={copilotLoading || !copilotInput.trim()}
                  className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#6C7CFB] to-[#9A6BFF] text-white flex items-center justify-center disabled:opacity-50"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
