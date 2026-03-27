import { useState, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import { client, auth } from "./client";
import { Transformer } from "@grid/sdk";

/* ── Types ─────────────────────────────────────────────────── */
interface TransformerData {
  transformerId: string;
  oilTempC?: number;
  loadAmps?: number;
  voltage?: number;
  ageYears?: number;
  circuitId?: string;
  geographicZone?: string;
}

/* ── Helpers ───────────────────────────────────────────────── */
function getStatus(temp?: number): "healthy" | "warning" | "critical" {
  if (temp == null) return "healthy";
  if (temp > 85) return "critical";
  if (temp >= 65) return "warning";
  return "healthy";
}

const statusColor = {
  healthy: "text-emerald-400",
  warning: "text-amber-400",
  critical: "text-rose-400",
} as const;

const statusDot = {
  healthy: "bg-emerald-400",
  warning: "bg-amber-400",
  critical: "bg-rose-400",
} as const;

const statusGlow = {
  healthy: "shadow-[0_0_8px_rgba(52,211,153,0.5)]",
  warning: "shadow-[0_0_8px_rgba(251,191,36,0.5)]",
  critical: "shadow-[0_0_8px_rgba(251,113,133,0.6)]",
} as const;

/* ── Topbar ────────────────────────────────────────────────── */
function Topbar({
  authenticated,
  onConnect,
  connecting,
}: {
  authenticated: boolean;
  onConnect: () => void;
  connecting: boolean;
}) {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-lg tracking-tight font-semibold text-white">
          ⚡ Grid 360 COP
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 border border-slate-700 rounded px-1.5 py-0.5">
          v2.0
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs">
          <div
            className={`w-2 h-2 rounded-full ${
              authenticated ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" : "bg-slate-600"
            }`}
          />
          <span className={authenticated ? "text-emerald-400" : "text-slate-500"}>
            {authenticated ? "CONNECTED" : "OFFLINE"}
          </span>
        </div>
        {!authenticated && (
          <button
            onClick={onConnect}
            disabled={connecting}
            className="text-xs px-3 py-1.5 rounded border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/60 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {connecting ? "Connecting..." : "Connect to Palantir"}
          </button>
        )}
      </div>
    </header>
  );
}

/* ── Transformer Card ──────────────────────────────────────── */
function TransformerCard({
  data,
  active,
  onClick,
}: {
  data: TransformerData;
  active: boolean;
  onClick: () => void;
}) {
  const s = getStatus(data.oilTempC);
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 group ${
        active
          ? "bg-slate-800/80 border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.08)]"
          : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-white truncate max-w-[140px]">
          {data.transformerId}
        </span>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${statusDot[s]} ${statusGlow[s]}`} />
          <span className={`text-[10px] uppercase tracking-wider ${statusColor[s]}`}>
            {s}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
        <div className="text-slate-500">
          OIL TEMP{" "}
          <span className={`${statusColor[s]} font-medium`}>
            {data.oilTempC != null ? `${data.oilTempC.toFixed(1)}°C` : "—"}
          </span>
        </div>
        <div className="text-slate-500">
          LOAD{" "}
          <span className="text-slate-300 font-medium">
            {data.loadAmps != null ? `${data.loadAmps.toFixed(0)}A` : "—"}
          </span>
        </div>
        <div className="text-slate-500">
          VOLTAGE{" "}
          <span className="text-slate-300 font-medium">
            {data.voltage != null ? `${(data.voltage / 1000).toFixed(1)}kV` : "—"}
          </span>
        </div>
        <div className="text-slate-500">
          AGE{" "}
          <span className="text-slate-300 font-medium">
            {data.ageYears != null ? `${data.ageYears}yr` : "—"}
          </span>
        </div>
      </div>
    </button>
  );
}

/* ── Analysis Terminal ─────────────────────────────────────── */
function AnalysisTerminal({ output, loading }: { output: string | null; loading: boolean }) {
  const hasAlert = output?.includes("ALERT");
  return (
    <div className="bg-black/80 border border-slate-800 rounded-lg p-4 font-mono text-xs min-h-[200px] max-h-[400px] overflow-auto relative">
      <div className="flex items-center gap-2 mb-3 text-[10px] text-slate-600 uppercase tracking-widest">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/60" />
        AIP Analysis Output
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-cyan-400/70">
          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Analyzing telemetry data...</span>
        </div>
      ) : output ? (
        <pre className={`whitespace-pre-wrap leading-relaxed ${hasAlert ? "text-rose-400" : "text-emerald-400/90"}`}>
          {output}
        </pre>
      ) : (
        <span className="text-slate-600 italic">
          Select an asset and run AIP Risk Assessment to see results here.
        </span>
      )}
    </div>
  );
}

/* ── Dashboard (main page) ─────────────────────────────────── */
function Dashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [transformers, setTransformers] = useState<TransformerData[]>([]);
  const [loadingGrid, setLoadingGrid] = useState(false);
  const [selected, setSelected] = useState<TransformerData | null>(null);
  const [analysisOutput, setAnalysisOutput] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleConnect = useCallback(async () => {
    setConnecting(true);
    try {
      await auth.signIn();
      setAuthenticated(true);
    } catch (e) {
      console.error("Auth failed:", e);
    } finally {
      setConnecting(false);
    }
  }, []);

  const loadGrid = useCallback(async () => {
    setLoadingGrid(true);
    try {
      const res = await client(Transformer).fetchPage({ $pageSize: 20 });
      const mapped: TransformerData[] = (res.data as any[]).map((t: any) => ({
        transformerId: t.transformerId ?? t.$primaryKey ?? "unknown",
        oilTempC: t.oilTempC ?? undefined,
        loadAmps: t.loadAmps ?? undefined,
        voltage: t.voltage ?? undefined,
        ageYears: t.ageYears ?? undefined,
        circuitId: t.circuitId ?? undefined,
        geographicZone: t.geographicZone ?? undefined,
      }));
      setTransformers(mapped);
      setAuthenticated(true);
    } catch (e) {
      console.error("Fetch failed:", e);
    } finally {
      setLoadingGrid(false);
    }
  }, []);

  const runAnalysis = useCallback(async () => {
    if (!selected) return;
    setAnalyzing(true);
    setAnalysisOutput(null);
    try {
      // Placeholder — evaluate_transformer_risk not yet implemented
      await new Promise((r) => setTimeout(r, 2000));
      const mockResult =
        (selected.oilTempC ?? 0) > 85
          ? `⚠ ALERT: Transformer ${selected.transformerId} shows elevated thermal risk.\nOil temperature ${selected.oilTempC?.toFixed(1)}°C exceeds threshold.\nRecommendation: Schedule immediate inspection.`
          : `✓ Transformer ${selected.transformerId} operating within normal parameters.\nOil temp: ${selected.oilTempC?.toFixed(1) ?? "N/A"}°C | Load: ${selected.loadAmps?.toFixed(0) ?? "N/A"}A\nNo immediate action required.`;
      setAnalysisOutput(mockResult);
    } catch (e) {
      setAnalysisOutput("Error running analysis. Check console.");
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  }, [selected]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Topbar authenticated={authenticated} onConnect={handleConnect} connecting={connecting} />

      <div className="flex-1 flex overflow-hidden">
        {/* ── Left: Asset List ──────────────────────────────── */}
        <aside className="w-80 border-r border-slate-800 flex flex-col shrink-0 bg-slate-900/40">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold text-white uppercase tracking-wider">
                Grid Assets
              </h2>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {transformers.length} transformers loaded
              </p>
            </div>
            <button
              onClick={loadGrid}
              disabled={loadingGrid}
              className="text-[10px] px-2.5 py-1.5 rounded border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {loadingGrid ? (
                <>
                  <svg className="animate-spin h-2.5 w-2.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading...
                </>
              ) : (
                "Load Grid Data"
              )}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {transformers.length === 0 && !loadingGrid && (
              <div className="text-center py-12 text-slate-600 text-xs">
                <div className="text-2xl mb-2 opacity-40">⚡</div>
                Click "Load Grid Data" to fetch transformer telemetry
              </div>
            )}
            {transformers.map((t) => (
              <TransformerCard
                key={t.transformerId}
                data={t}
                active={selected?.transformerId === t.transformerId}
                onClick={() => {
                  setSelected(t);
                  setAnalysisOutput(null);
                }}
              />
            ))}
          </div>
        </aside>

        {/* ── Right: Analysis Panel ────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {selected ? (
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Asset header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                    Active Asset
                  </p>
                  <h2 className="text-lg font-semibold text-white">
                    {selected.transformerId}
                  </h2>
                  {selected.geographicZone && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      Zone: {selected.geographicZone}
                      {selected.circuitId && ` · Circuit: ${selected.circuitId}`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {(() => {
                    const s = getStatus(selected.oilTempC);
                    return (
                      <>
                        <div className={`w-2 h-2 rounded-full ${statusDot[s]} ${statusGlow[s]}`} />
                        <span className={`text-xs font-medium ${statusColor[s]}`}>
                          {s.toUpperCase()}
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Telemetry cards */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Oil Temp", value: selected.oilTempC, unit: "°C", fmt: (v: number) => v.toFixed(1) },
                  { label: "Load", value: selected.loadAmps, unit: "A", fmt: (v: number) => v.toFixed(0) },
                  { label: "Voltage", value: selected.voltage, unit: "kV", fmt: (v: number) => (v / 1000).toFixed(1) },
                  { label: "Age", value: selected.ageYears, unit: "yr", fmt: (v: number) => String(v) },
                ].map(({ label, value, unit, fmt }) => (
                  <div
                    key={label}
                    className="bg-slate-900/60 border border-slate-800 rounded-lg p-3"
                  >
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                      {label}
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {value != null ? fmt(value) : "—"}
                      <span className="text-xs text-slate-500 ml-1">{value != null ? unit : ""}</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* AIP button */}
              <button
                onClick={runAnalysis}
                disabled={analyzing}
                className="w-full py-3 rounded-lg font-medium text-sm transition-all border border-cyan-500/30 text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.08)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Running AIP Risk Assessment...
                  </>
                ) : (
                  "⚡ Run AIP Risk Assessment"
                )}
              </button>

              {/* Terminal output */}
              <AnalysisTerminal output={analysisOutput} loading={analyzing} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-3 opacity-20">⚡</div>
                <p className="text-sm text-slate-500">
                  Select a transformer from the asset list
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  to view telemetry and run AIP analysis
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ── Auth Callback ─────────────────────────────────────────── */
function AuthCallback() {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <svg className="animate-spin h-6 w-6 text-cyan-400 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-sm text-slate-400">Logging in...</p>
      </div>
    </div>
  );
}

/* ── App Router ────────────────────────────────────────────── */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
    </Routes>
  );
}
