import { useState, useRef } from "react";
import axios from "axios";

const SAMPLE_BUGGY_CODE = `def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    average = total / len(numbers)
    return averege

nums = [10, 20, 30, 40, 50]
result = calculate_average(nums)
print("Average is: " + result)`;

const colors = {
  bg: "#0D1117",
  card: "#161B22",
  border: "#30363D",
  accent: "#58A6FF",
  accentGreen: "#3FB950",
  accentYellow: "#D29922",
  accentRed: "#F85149",
  accentPurple: "#BC8CFF",
  text: "#E6EDF3",
  textSec: "#8B949E",
  textMut: "#484F58",
  headerBg: "#21262D",
};

function AgentStep({ step, index }) {
  const [open, setOpen] = useState(index === 0);
  const agentColor = {
    "Reader Agent": colors.accent,
    "Fixer Agent": colors.accentGreen,
    "Tester Agent": colors.accentPurple,
  };
  const agentIcon = {
    "Reader Agent": "🔍",
    "Fixer Agent": "🔧",
    "Tester Agent": "🧪",
  };
  const color = agentColor[step.agent] || colors.accent;

  return (
    <div style={{ border: `1px solid ${colors.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
      <div onClick={() => setOpen(!open)} style={{ padding: "10px 14px", background: colors.headerBg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14 }}>{agentIcon[step.agent]}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color }}>Attempt {step.attempt} — {step.agent}</span>
          <span style={{ fontSize: 11, color: colors.textSec, background: colors.bg, padding: "2px 8px", borderRadius: 20 }}>{step.action}</span>
        </div>
        <span style={{ color: colors.textSec, fontSize: 12 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ padding: "12px 14px", background: colors.bg }}>
          <pre style={{ fontSize: 12, color: colors.textSec, whiteSpace: "pre-wrap", lineHeight: 1.6, margin: 0, fontFamily: "monospace" }}>
            {typeof step.output === "string" ? step.output : JSON.stringify(step.output, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [code, setCode] = useState(SAMPLE_BUGGY_CODE);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("fixed");
  const resultRef = useRef();

  const debugCode = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await axios.post("http://localhost:5002/debug", { code }, { timeout: 120000 });
      setResult(res.data);
      setActiveTab("fixed");
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      setError("API quota exceeded or server error. Please wait 1 minute and try again.");
    }
    setLoading(false);
  };

  const statusColor = result?.status === "success" ? colors.accentGreen : colors.accentYellow;
  const statusLabel = result?.status === "success" ? "✅ Fixed successfully" : "⚠️ Partially fixed";

  return (
    <div style={{ fontFamily: "monospace", background: colors.bg, minHeight: "100vh", color: colors.text }}>
      <div style={{ background: colors.card, borderBottom: `1px solid ${colors.border}`, padding: "0 2rem", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, background: "#1F6FEB", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>AutoDebug</div>
            <div style={{ fontSize: 11, color: colors.textSec }}>Autonomous multi-agent code repair</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ color: colors.accent, label: "Reader Agent" }, { color: colors.accentGreen, label: "Fixer Agent" }, { color: colors.accentPurple, label: "Tester Agent" }].map((a) => (
            <span key={a.label} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, border: `1px solid ${a.color}33`, color: a.color, background: `${a.color}11` }}>{a.label}</span>
          ))}
        </div>
      </div>

      <div style={{ background: "linear-gradient(135deg, #0D1117 0%, #161B22 100%)", borderBottom: `1px solid ${colors.border}`, padding: "1.75rem 2rem" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.text, marginBottom: 8 }}>
          Paste broken code.<br />
          <span style={{ color: colors.accent }}>Watch 3 AI agents fix it.</span>
        </h1>
        <p style={{ fontSize: 13, color: colors.textSec, lineHeight: 1.7, maxWidth: 600, marginBottom: "1rem" }}>
          AutoDebug uses a chain of specialized AI agents — a Reader, a Fixer, and a Tester — that autonomously identify, repair, and validate bugs in your code. If the fix fails, the loop retries automatically.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          {[{ icon: "🔄", val: "3 max retries", label: "Auto loop" }, { icon: "⚡", val: "Multi-agent", label: "Gemini powered" }, { icon: "🧪", val: "Live execution", label: "Code runner" }].map((s) => (
            <div key={s.val} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "7px 12px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.text }}>{s.val}</div>
                <div style={{ fontSize: 10, color: colors.textSec }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", padding: "1rem 2rem" }}>
        <div style={{ background: colors.card, borderRadius: 10, border: `1px solid ${colors.border}`, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${colors.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: colors.headerBg }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>📝</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>Buggy code input</span>
            </div>
            <button onClick={() => setCode(SAMPLE_BUGGY_CODE)} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, border: `1px solid ${colors.border}`, background: "transparent", color: colors.textSec, cursor: "pointer" }}>
              Load sample
            </button>
          </div>
          <div style={{ padding: "1rem" }}>
            <div style={{ fontSize: 11, color: colors.textSec, marginBottom: 8, display: "flex", gap: 16 }}>
              <span>🐍 Python supported</span>
              <span>📏 {code.split("\n").length} lines</span>
            </div>
            <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste your buggy Python code here..." style={{ width: "100%", height: 320, background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "12px", fontSize: 12, color: colors.text, fontFamily: "monospace", lineHeight: 1.7, outline: "none", resize: "vertical" }} />
            <button onClick={debugCode} disabled={loading || !code.trim()} style={{ marginTop: "1rem", width: "100%", padding: "12px", background: loading ? colors.headerBg : "#1F6FEB", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? <>⏳ Agents are working... please wait</> : <>🤖 Run AutoDebug agents</>}
            </button>
            {loading && (
              <div style={{ marginTop: "1rem", background: colors.bg, borderRadius: 8, padding: "1rem", border: `1px solid ${colors.border}` }}>
                <div style={{ fontSize: 12, color: colors.textSec, marginBottom: 8 }}>Agent pipeline running:</div>
                {["🔍 Reader Agent — scanning for bugs...", "🔧 Fixer Agent — writing fix...", "🧪 Tester Agent — validating fix..."].map((s, i) => (
                  <div key={i} style={{ fontSize: 12, color: colors.textSec, padding: "4px 0", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors.accent, display: "inline-block" }}></span>
                    {s}
                  </div>
                ))}
              </div>
            )}
            {error && (
              <div style={{ marginTop: "1rem", background: "#2D1B1B", border: `1px solid ${colors.accentRed}44`, borderRadius: 8, padding: "1rem", fontSize: 12, color: colors.accentRed, lineHeight: 1.6 }}>
                {error}
              </div>
            )}
          </div>
        </div>

        <div ref={resultRef} style={{ background: colors.card, borderRadius: 10, border: `1px solid ${colors.border}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${colors.border}`, background: colors.headerBg, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>⚡</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>Agent output</span>
            </div>
            {result && (
              <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: `${statusColor}22`, color: statusColor, fontWeight: 600 }}>
                {statusLabel} • {result.attempts} attempt{result.attempts > 1 ? "s" : ""}
              </span>
            )}
          </div>
          {!result && !loading && (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, padding: "3rem", color: colors.textMut }}>
              <div style={{ fontSize: 40 }}>🤖</div>
              <div style={{ fontSize: 13, textAlign: "center", lineHeight: 1.7 }}>Paste your buggy code on the left<br />and click Run AutoDebug agents</div>
            </div>
          )}
          {result && (
            <div style={{ flex: 1, overflow: "auto", padding: "1rem" }}>
              <div style={{ display: "flex", gap: 4, marginBottom: "1rem", background: colors.bg, borderRadius: 8, padding: 4 }}>
                {["fixed", "bugs", "audit"].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: "7px", borderRadius: 6, border: "none", background: activeTab === tab ? colors.card : "transparent", color: activeTab === tab ? colors.text : colors.textSec, fontSize: 12, fontWeight: activeTab === tab ? 600 : 400, cursor: "pointer", fontFamily: "monospace" }}>
                    {tab === "fixed" ? "🔧 Fixed code" : tab === "bugs" ? "🔍 Bug report" : "📋 Audit trail"}
                  </button>
                ))}
              </div>
              {activeTab === "fixed" && (
                <div>
                  {result.run_output && (
                    <div style={{ background: "#0D2818", border: `1px solid ${colors.accentGreen}44`, borderRadius: 8, padding: "10px 12px", marginBottom: "1rem" }}>
                      <div style={{ fontSize: 11, color: colors.accentGreen, fontWeight: 600, marginBottom: 4 }}>✅ EXECUTION OUTPUT</div>
                      <pre style={{ fontSize: 12, color: colors.accentGreen, margin: 0, fontFamily: "monospace" }}>{result.run_output}</pre>
                    </div>
                  )}
                  <pre style={{ fontSize: 12, color: colors.text, background: colors.bg, borderRadius: 8, padding: "1rem", border: `1px solid ${colors.border}`, whiteSpace: "pre-wrap", lineHeight: 1.7, fontFamily: "monospace", margin: 0 }}>{result.fixed_code}</pre>
                </div>
              )}
              {activeTab === "bugs" && (
                <pre style={{ fontSize: 12, color: colors.textSec, background: colors.bg, borderRadius: 8, padding: "1rem", border: `1px solid ${colors.border}`, whiteSpace: "pre-wrap", lineHeight: 1.7, fontFamily: "monospace", margin: 0 }}>{result.bug_report}</pre>
              )}
              {activeTab === "audit" && (
                <div>
                  <div style={{ fontSize: 12, color: colors.textSec, marginBottom: "1rem" }}>{result.audit_trail.length} agent actions across {result.attempts} attempt{result.attempts > 1 ? "s" : ""}</div>
                  {result.audit_trail.map((step, i) => <AgentStep key={i} step={step} index={i} />)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}