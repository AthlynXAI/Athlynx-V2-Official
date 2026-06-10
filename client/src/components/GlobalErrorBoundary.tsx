/**
 * GlobalErrorBoundary — AthlynXAI
 * Catches ALL React runtime errors platform-wide.
 * Never shows a white crash screen. Always recovers gracefully.
 * The platform NEVER goes down.
 */
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // Log to console for debugging — never expose to user
    console.error("[AthlynXAI] Runtime error caught by GlobalErrorBoundary:", error, errorInfo);
  }

  handleRecover = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Navigate home
    window.location.href = "/";
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #000a1a 0%, #0d1b3e 50%, #000a1a 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "32px 20px",
          textAlign: "center",
        }}>
          {/* Logo */}
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚡</div>
          <div style={{
            fontSize: "28px",
            fontWeight: "900",
            background: "linear-gradient(135deg, #00c8ff, #0066cc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px",
            letterSpacing: "2px",
          }}>
            AthlynXAI
          </div>

          {/* Error message */}
          <div style={{
            background: "rgba(13,27,62,0.95)",
            border: "1px solid rgba(0,200,255,0.2)",
            borderRadius: "16px",
            padding: "32px",
            maxWidth: "480px",
            width: "100%",
            marginTop: "24px",
          }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔧</div>
            <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "800", marginBottom: "8px" }}>
              Something went wrong
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "24px", lineHeight: "1.6" }}>
              The platform hit an unexpected error. Your data is safe. Click below to recover.
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={this.handleRecover}
                style={{
                  background: "linear-gradient(135deg, #0066cc, #00c8ff)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "800",
                  padding: "14px 28px",
                  cursor: "pointer",
                }}
              >
                🏠 Go Home
              </button>
              <button
                onClick={this.handleRetry}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "700",
                  padding: "14px 28px",
                  cursor: "pointer",
                }}
              >
                🔄 Retry
              </button>
            </div>
          </div>

          <p style={{ color: "#334155", fontSize: "12px", marginTop: "24px" }}>
            AthlynXAI · Iron Sharpens Iron — Proverbs 27:17
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * RouteErrorBoundary — wraps individual pages
 * Catches page-level errors without crashing the whole app
 */
export class RouteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[AthlynXAI] Page error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          textAlign: "center",
          background: "#000a1a",
          fontFamily: "system-ui, sans-serif",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚡</div>
          <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: "800", marginBottom: "8px" }}>
            This page hit an error
          </h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
            The rest of the platform is fine. Click below to continue.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => { window.location.href = "/dashboard"; }}
              style={{ background: "#0066cc", border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: "700", padding: "12px 24px", cursor: "pointer" }}
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: "700", padding: "12px 24px", cursor: "pointer" }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
