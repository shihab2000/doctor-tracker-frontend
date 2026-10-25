
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HeartPulse,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { api } from "@/lib/api";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("shihab/2002");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("dt_token", data.token);
      localStorage.setItem("dt_user", JSON.stringify(data.user));

      router.push("/");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "#fff",
      }}
    >
      <section
        style={{
          padding: "clamp(24px, 7vw, 90px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 48,
          }}
        >
          <span
            style={{
              background: "#2563eb",
              color: "#fff",
              width: 46,
              height: 46,
              borderRadius: 15,
              display: "grid",
              placeItems: "center",
            }}
          >
            <HeartPulse size={25} />
          </span>

          <div>
            <strong style={{ fontSize: 19 }}>Doctor Tracker</strong>
            <div className="muted" style={{ fontSize: 13 }}>
              Care Guide BD
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 410, width: "100%", margin: "0 auto" }}>
          <p className="badge">ADMIN PORTAL</p>

          <h1
            style={{
              fontSize: 34,
              fontWeight: 800,
              lineHeight: 1.15,
              margin: "18px 0 10px",
            }}
          >
            Welcome back
          </h1>

          <p className="muted" style={{ marginBottom: 30 }}>
            Sign in to manage doctors, patients and insights.
          </p>

          <form onSubmit={submit} style={{ display: "grid", gap: 17 }}>
            <label style={{ fontWeight: 700, fontSize: 13 }}>
              Email address

              <div style={{ position: "relative", marginTop: 8 }}>
                <Mail
                  size={17}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: 13,
                    color: "#8a94a7",
                  }}
                />

                <input
                  className="field"
                  style={{ paddingLeft: 38 }}
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </label>

            <label style={{ fontWeight: 700, fontSize: 13 }}>
              Password

              <div style={{ position: "relative", marginTop: 8 }}>
                <LockKeyhole
                  size={17}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: 13,
                    color: "#8a94a7",
                  }}
                />

                <input
                  className="field"
                  style={{ paddingLeft: 38 }}
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </label>

            {error && (
              <p
                role="alert"
                style={{
                  color: "#c43333",
                  fontSize: 13,
                  margin: 0,
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="btn btn-primary"
              style={{ padding: 13, marginTop: 5 }}
            >
              {busy ? "Signing in..." : "Sign in to dashboard"}
            </button>
          </form>

          <p className="muted" style={{ fontSize: 12, marginTop: 22 }}>
            Sign in with your configured administrator account.
          </p>
        </div>
      </section>

      <section
        style={{
          background:
            "linear-gradient(145deg, #1646a6, #3677ed 60%, #77a7ff)",
          padding: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 470 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 24,
              background: "#ffffff24",
              display: "grid",
              placeItems: "center",
              marginBottom: 28,
            }}
          >
            <HeartPulse size={40} />
          </div>

          <h2
            style={{
              fontSize: 40,
              fontWeight: 800,
              lineHeight: 1.1,
              margin: "0 0 20px",
            }}
          >
            Better oversight.
            <br />
            Better care.
          </h2>

          <p
            style={{
              fontSize: 17,
              lineHeight: 1.8,
              color: "#e3ecff",
            }}
          >
            One clear workspace to organize doctor profiles, manage patient
            records and understand your operations at a glance.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 30,
            }}
          >
            {["Secure access", "Live analytics", "Simple workflow"].map(
              (item) => (
                <span
                  key={item}
                  style={{
                    border: "1px solid #ffffff55",
                    borderRadius: 999,
                    padding: "9px 13px",
                    fontSize: 13,
                  }}
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 750px) {
          main {
            grid-template-columns: 1fr !important;
          }

          section:nth-child(2) {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}
