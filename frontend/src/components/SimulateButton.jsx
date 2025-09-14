import { useState } from "react";
import { simulateClient } from "../api/apiClient";

function SimulateButton({ clientId, setTimeline }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSimulate = async () => {

    setLoading(true);
    setError(null);
    try {
      // Call backend simulation endpoint
      const res = await simulateClient();

      if (res && res.success) {
        setResult(res.data);
        setTimeline((prev) => ({
          ...prev,
          simulated: res.data.simulated,
          analysis: res.data.analysis,
        }));
      } else {
        setError(res?.error || "Simulation failed with unknown error");
      }
    } catch (err) {
      console.error("Simulation failed", err);
      setError(err.message || "Simulation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 15 }}>
      <button
        onClick={handleSimulate}
        disabled={loading}
        style={{
          background: "#FFD700",
          color: "#333",
          fontWeight: "bold",
          padding: "10px 20px",
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
          transition: "transform 0.2s",
          opacity: loading ? 0.7 : 1,
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {loading ? "⏳ Simulating..." : "🔄 Simulate"}
      </button>

      {/* Show result if success */}
      {result && (
        <div style={{ marginTop: 10, color: "green", textAlign: "left" }}>
          <h4>Simulation Result:</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {/* Show error if failed */}
      {error && (
        <div style={{ marginTop: 10, color: "red" }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

export default SimulateButton;
