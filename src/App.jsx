import { useState } from "react";

const colors = {
  bitcoinOrange: "#f7931a",
  darkBg: "#1a1a1a",
  lightBg: "#2d2d2d",
  accent: "#ffaa33",
};

const hoverStyles = `
  .upload-label:hover {
    transform: scale(1.05);
  }
  .verify-button:not(:disabled):hover {
    background-color: ${colors.accent} !important;
    transform: translateY(-2px);
  }
  .tx-link:hover {
    text-decoration: underline;
  }
  .test-file-link:hover {
    opacity: 0.8;
  }
`;

function App() {
  const [file, setFile] = useState(null);
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createProof = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setProof(null);

    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashHex = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      let verified = false;
      let txId = null;

      // Blockstream API check
      const blockstreamResponse = await fetch(
        `https://blockstream.info/api/search/raw?script=${hashHex}`
      );

      if (blockstreamResponse.ok) {
        const blockstreamData = await blockstreamResponse.json();
        if (blockstreamData.length > 0) {
          verified = true;
          txId = blockstreamData[0].tx_id;
        }
      }

      // Blockchain.com fallback
      if (!verified) {
        const blockchainResponse = await fetch(
          `https://blockchain.info/rawtx/${hashHex}?format=hex&cors=true`
        );
        if (blockchainResponse.ok) {
          verified = true;
          txId = hashHex;
        }
      }

      setProof({ hash: hashHex, txId, verified });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colors.darkBg,
        color: "white",
        fontFamily: "'Inter', sans-serif",
        padding: "2rem",
        display: "flex",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
      }}
    >
      <style>{hoverStyles}</style>

      <div
        style={{
          maxWidth: "800px",
          width: "100%",
          backgroundColor: colors.lightBg,
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          margin: "1rem", // Prevents overlapping
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            borderBottom: `2px solid ${colors.bitcoinOrange}`,
            paddingBottom: "1rem",
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              margin: 0,
              background: "linear-gradient(45deg, #f7931a, #ffd700)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: colors.bitcoinOrange,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "1.2em" }}>₿</span>
            Bitcoin Timestamp Verifier
          </h1>
          <p style={{ color: "#ccc", marginTop: "0.5rem" }}>
            Prove your document's existence in the Bitcoin blockchain
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <label
            className="upload-label"
            style={{
              backgroundColor: colors.bitcoinOrange,
              color: "white",
              padding: "0.8rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
          >
            📁 Choose File
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              disabled={loading}
              style={{ display: "none" }}
            />
          </label>

          <button
            className="verify-button"
            onClick={createProof}
            disabled={loading}
            style={{
              backgroundColor: loading ? "#666" : colors.bitcoinOrange,
              color: "white",
              border: "none",
              padding: "0.8rem 2rem",
              borderRadius: "8px",
              fontSize: "1.1rem",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {loading ? "⏳ Verifying..." : "🔍 Check Timestamp"}
          </button>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#ff444433",
              padding: "1rem",
              borderRadius: "8px",
              margin: "1rem 0",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ color: "#ff4444", fontSize: "1.2rem" }}>⚠️</span>
            <p style={{ margin: 0, color: "#ff4444" }}>{error}</p>
          </div>
        )}

        {proof && (
          <div
            style={{
              backgroundColor: "#ffffff0d",
              padding: "1.5rem",
              borderRadius: "12px",
              border: `1px solid ${colors.bitcoinOrange}33`,
              marginBottom: "2rem",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                color: colors.bitcoinOrange,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {proof.verified
                ? "✅ Verification Successful"
                : "❌ Verification Failed"}
            </h3>

            <div style={{ marginBottom: "1rem" }}>
              <strong>SHA256 Hash:</strong>
              <code
                style={{
                  display: "block",
                  wordBreak: "break-all",
                  backgroundColor: "#00000033",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  marginTop: "0.5rem",
                  fontFamily: "'Fira Code', monospace",
                }}
              >
                {proof.hash}
              </code>
            </div>

            {proof.verified ? (
              <div>
                <p style={{ margin: "0.5rem 0" }}>
                  Transaction found in Bitcoin blockchain:
                </p>
                <a
                  href={`https://blockstream.info/tx/${proof.txId}`}
                  className="tx-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: colors.bitcoinOrange,
                    wordBreak: "break-all",
                    textDecoration: "none",
                  }}
                >
                  🔗 {proof.txId}
                </a>
              </div>
            ) : (
              <p style={{ color: "#ff6666" }}>
                No matching transaction found in the Bitcoin blockchain
              </p>
            )}
          </div>
        )}

        <div
          style={{
            padding: "1.5rem",
            backgroundColor: "#ffffff0d",
            borderRadius: "12px",
          }}
        >
          <h4
            style={{
              color: colors.bitcoinOrange,
              marginTop: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            🧪 Test Files
          </h4>
          <p style={{ color: "#ccc", marginBottom: "1rem" }}>
            Try these pre-verified documents:
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ marginBottom: "0.5rem" }}>
              <a
                href="https://bitcoin.org/img/icons/logotop.svg"
                className="test-file-link"
                download="bitcoin-logo.svg"
                style={{
                  color: colors.bitcoinOrange,
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
              >
                📄 Bitcoin Logo (SVG)
              </a>
            </li>
            <li>
              <a
                href="https://bitcoin.org/bitcoin.pdf"
                className="test-file-link"
                download="bitcoin-whitepaper.pdf"
                style={{
                  color: colors.bitcoinOrange,
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
              >
                📜 Bitcoin Whitepaper (PDF)
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;




