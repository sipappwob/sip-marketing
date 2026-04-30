/* eslint-disable react/no-unescaped-entities */
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: 24,
          background: "#f5f0e8",
          color: "#1a1a1a",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            background: "#fff",
            borderRadius: 14,
            padding: 20,
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 10px 28px rgba(95, 62, 57, 0.08)",
          }}
        >
          <h1 style={{ marginTop: 0 }}>Sip</h1>
          <p style={{ marginBottom: 12 }}>
            Something went wrong loading this page.
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: "#a5473f",
              color: "#fff",
              border: "none",
              padding: "10px 14px",
              borderRadius: 999,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <p style={{ marginTop: 16, fontSize: 12, color: "#666" }}>
            If this keeps happening, email{" "}
            <a href="mailto:sam@sipapp.co">sam@sipapp.co</a>.
          </p>
          {error?.digest ? (
            <p style={{ fontSize: 12, color: "#999" }}>
              Error id: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}

