
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  Stethoscope,
  Users,
  LogOut,
  HeartPulse,
} from "lucide-react";

const nav = [
  { href: "/", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/doctors", label: "Doctors", Icon: Stethoscope },
  { href: "/patients", label: "Patients", Icon: Users },
];

export default function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();

  function logout() {
    localStorage.removeItem("dt_token");
    localStorage.removeItem("dt_user");
    router.push("/login");
  }

  const pageTitle =
    path === "/"
      ? "Overview"
      : path.startsWith("/doctors")
        ? "Doctor Management"
        : path.startsWith("/patients")
          ? "Patient Management"
          : "Administration";

  return (
    <div className="main-layout">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-icon">
            <HeartPulse size={23} />
          </span>

          <span>
            <strong className="brand-title">Doctor Tracker</strong>
            <small className="muted">Care Guide BD</small>
          </span>
        </Link>

        <p className="workspace-label">WORKSPACE</p>

        <nav className="nav-wrap">
          {nav.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link ${
                path === href ||
                (href !== "/" && path.startsWith(href))
                  ? "active"
                  : ""
              }`}
            >
              <Icon size={19} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="status-card">
          <div className="status-heading">
            <Activity size={18} color="#2563eb" />
            <strong>System status</strong>
          </div>

          <p className="muted status-description">
            Doctor Tracker workspace
          </p>

          <button
            type="button"
            onClick={logout}
            className="btn btn-light logout-button"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <div className="muted breadcrumb">
              Care Guide BD / Administration
            </div>

            <h1 className="page-title">{pageTitle}</h1>
          </div>

          <div className="admin-card">
            <div className="admin-avatar">A</div>

            <div>
              <strong className="admin-name">Administrator</strong>
              <small className="muted">Admin account</small>
            </div>
          </div>
        </header>

        {children}
      </main>

      <style jsx>{`
        .main-layout {
          display: flex;
          min-height: 100vh;
          background: #f7f9fd;
        }

        .sidebar {
          width: 248px;
          flex-shrink: 0;
          background: #fff;
          border-right: 1px solid #e8ecf4;
          padding: 22px;
          position: fixed;
          inset: 0 auto 0 0;
          display: flex;
          flex-direction: column;
          z-index: 10;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 5px 5px 28px;
          text-decoration: none;
          color: #172033;
        }

        .brand-icon {
          background: #2563eb;
          color: #fff;
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .brand-title {
          font-size: 17px;
          display: block;
        }

        .muted {
          color: #7b8497;
        }

        .workspace-label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          padding-left: 12px;
          color: #7b8497;
        }

        .nav-wrap {
          display: grid;
          gap: 5px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 12px;
          border-radius: 10px;
          text-decoration: none;
          color: #596579;
          font-size: 14px;
          font-weight: 600;
          transition: background 0.2s, color 0.2s;
        }

        .nav-link:hover,
        .nav-link.active {
          background: #edf3ff;
          color: #245bd7;
        }

        .status-card {
          margin-top: auto;
          background: #f4f7fd;
          padding: 15px;
          border-radius: 14px;
        }

        .status-heading {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 13px;
        }

        .status-description {
          font-size: 12px;
          margin: 8px 0 13px;
        }

        .logout-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }

        .main-content {
          margin-left: 248px;
          width: calc(100% - 248px);
          min-width: 0;
          padding: 28px clamp(16px, 3vw, 42px);
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
        }

        .breadcrumb {
          font-size: 13px;
        }

        .page-title {
          font-size: 26px;
          font-weight: 800;
          margin: 7px 0 0;
          color: #172033;
        }

        .admin-card {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff;
          border: 1px solid #e8ecf4;
          border-radius: 14px;
          padding: 9px 13px;
        }

        .admin-avatar {
          width: 34px;
          height: 34px;
          border-radius: 11px;
          background: #eaf1ff;
          color: #245bd7;
          display: grid;
          place-items: center;
          font-weight: 800;
        }

        .admin-name {
          display: block;
          font-size: 13px;
        }

        @media (max-width: 767px) {
          .main-layout {
            display: block;
          }

          .sidebar {
            width: 100%;
            position: relative;
            padding: 14px;
            border-right: 0;
            border-bottom: 1px solid #e8ecf4;
          }

          .brand {
            padding-bottom: 14px;
          }

          .workspace-label,
          .status-card {
            display: none;
          }

          .nav-wrap {
            display: flex;
            flex-wrap: wrap;
          }

          .nav-link {
            padding: 10px;
          }

          .main-content {
            margin-left: 0;
            width: 100%;
            padding: 18px;
          }

          .page-header {
            align-items: flex-start;
          }

          .page-title {
            font-size: 22px;
          }

          .admin-card {
            padding: 7px;
          }
        }

        @media (max-width: 420px) {
          .admin-card {
            gap: 6px;
          }

          .admin-card .muted {
            display: none;
          }

          .breadcrumb {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
}
