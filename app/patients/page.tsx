"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  UserRound,
} from "lucide-react";
import Shell from "@/components/Shell";
import { api, getToken } from "@/lib/api";

type Patient = {
  _id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  phone: string;
  doctor: any;
  createdAt: string;
};

const blank = {
  name: "",
  age: "",
  gender: "Female",
  condition: "",
  phone: "",
  doctor: "",
};

export const dynamic = "force-dynamic";

export default function Patients() {
  const router = useRouter();

  const [doctorParam, setDoctorParam] = useState("");
  const [data, setData] = useState<any>({
    items: [],
    pagination: { page: 1, pages: 1, total: 0 },
  });
  const [doctors, setDoctors] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("");
  const [doctor, setDoctor] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<any>(blank);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Read the doctor query parameter in the browser.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDoctorParam(params.get("doctor") || "");
  }, []);

  // Apply a doctor filter when the URL contains ?doctor=...
  useEffect(() => {
    if (doctorParam) {
      setDoctor(doctorParam);
    }
  }, [doctorParam]);

  // Check authentication and load doctors.
  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    api("/doctors?limit=100")
      .then((result) => setDoctors(result.items || []))
      .catch(() => {});
  }, [router]);

  const load = useCallback(async () => {
    try {
      setError("");

      const params = new URLSearchParams({
        page: String(page),
        limit: "8",
      });

      if (search) params.set("search", search);
      if (condition) params.set("condition", condition);
      if (doctor) params.set("doctor", doctor);

      const result = await api("/patients?" + params.toString());
      setData(result);
    } catch (e: any) {
      setError(e.message || "Unable to load patients.");
    }
  }, [page, search, condition, doctor]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [search, condition, doctor]);

  function open(item?: Patient) {
    setEditing(item ? item._id : null);

    setForm(
      item
        ? {
            name: item.name,
            age: String(item.age),
            gender: item.gender,
            condition: item.condition,
            phone: item.phone,
            doctor: item.doctor?._id || item.doctor || "",
          }
        : { ...blank, doctor: doctor || "" }
    );

    setError("");
    setModal(true);
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const body = {
        ...form,
        age: Number(form.age),
      };

      await api(
        editing ? `/patients/${editing}` : "/patients",
        {
          method: editing ? "PUT" : "POST",
          body: JSON.stringify(body),
        }
      );

      setModal(false);
      setNotice(
        editing
          ? "Patient updated successfully"
          : "Patient added successfully"
      );

      await load();
    } catch (e: any) {
      setError(e.message || "Unable to save patient.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this patient record?")) return;

    try {
      await api("/patients/" + id, { method: "DELETE" });
      setNotice("Patient deleted");
      await load();
    } catch (e: any) {
      setError(e.message || "Unable to delete patient.");
    }
  }

  return (
    <Shell>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div>
          <h2 style={{ fontSize: 19, fontWeight: 800, margin: 0 }}>
            Patient directory
          </h2>
          <p className="muted" style={{ fontSize: 13, margin: "6px 0 0" }}>
            Review patient records and assigned doctors.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => open()}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <Plus size={17} /> Add patient
        </button>
      </div>

      {notice && (
        <div
          style={{
            padding: 12,
            background: "#e8f8ef",
            color: "#137447",
            borderRadius: 10,
            marginBottom: 14,
          }}
        >
          {notice}
          <button
            onClick={() => setNotice("")}
            style={{ float: "right" }}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}

      {error && !modal && (
        <div
          style={{
            padding: 12,
            background: "#fff0f0",
            color: "#b42323",
            borderRadius: 10,
            marginBottom: 14,
          }}
        >
          {error}
        </div>
      )}

      <div
        className="panel"
        style={{
          padding: 16,
          marginBottom: 18,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: "1 1 220px" }}>
          <Search
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
            placeholder="Search patient or condition…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="field"
          style={{ width: "auto", minWidth: 170 }}
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        >
          <option value="">All conditions</option>
          {[
            "Hypertension",
            "Diabetes",
            "Asthma",
            "Migraine",
            "Routine checkup",
            "Cardiac care",
            "Dermatology",
          ].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          className="field"
          style={{ width: "auto", minWidth: 190 }}
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
        >
          <option value="">All doctors</option>
          {doctors.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>

        {doctor && (
          <button className="btn btn-light" onClick={() => setDoctor("")}>
            Clear doctor
          </button>
        )}
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Age / Gender</th>
                <th>Condition</th>
                <th>Assigned doctor</th>
                <th>Phone</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {(data.items || []).map((p: Patient) => (
                <tr key={p._id}>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 12,
                          background: "#e6f8f1",
                          color: "#16805b",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <UserRound size={18} />
                      </div>
                      <strong>{p.name}</strong>
                    </div>
                  </td>

                  <td>
                    {p.age} / {p.gender}
                  </td>

                  <td>
                    <span
                      className="badge"
                      style={{ background: "#f1edff", color: "#6741bd" }}
                    >
                      {p.condition}
                    </span>
                  </td>

                  <td>
                    {p.doctor?.name || "—"}
                    <div className="muted" style={{ fontSize: 12 }}>
                      {p.doctor?.specialization || ""}
                    </div>
                  </td>

                  <td>{p.phone}</td>
                  <td>
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        title="Edit"
                        aria-label="Edit patient"
                        className="btn btn-light"
                        onClick={() => open(p)}
                      >
                        <Edit2 size={15} />
                      </button>

                      <button
                        title="Delete"
                        aria-label="Delete patient"
                        className="btn btn-danger"
                        onClick={() => remove(p._id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!(data.items || []).length && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: 35,
                      color: "#7b8599",
                    }}
                  >
                    No patients found. Add a patient to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            padding: 15,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <span className="muted" style={{ fontSize: 13 }}>
            Showing {(data.items || []).length} of{" "}
            {data.pagination?.total || 0} patients
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              className="btn btn-light"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              <ChevronLeft size={16} />
            </button>

            <span style={{ fontSize: 13 }}>
              Page {data.pagination?.page || page} of{" "}
              {Math.max(1, data.pagination?.pages || 1)}
            </span>

            <button
              className="btn btn-light"
              disabled={page >= (data.pagination?.pages || 1)}
              onClick={() => setPage((current) => current + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {modal && (
        <div
          className="overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModal(false);
          }}
        >
          <div className="modal">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div>
                <h2 style={{ fontSize: 21, fontWeight: 800, margin: 0 }}>
                  {editing ? "Edit patient" : "Add a patient"}
                </h2>
                <p className="muted" style={{ fontSize: 13, margin: "6px 0 0" }}>
                  Connect every patient to a doctor.
                </p>
              </div>

              <button
                onClick={() => setModal(false)}
                className="btn btn-light"
                aria-label="Close form"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={save}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
                gap: 14,
              }}
            >
              <label style={{ fontSize: 13, fontWeight: 700 }}>
                Full name
                <input
                  className="field"
                  style={{ marginTop: 7 }}
                  required
                  value={form.name}
                  placeholder="Patient name"
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </label>

              <label style={{ fontSize: 13, fontWeight: 700 }}>
                Age
                <input
                  className="field"
                  style={{ marginTop: 7 }}
                  type="number"
                  min="0"
                  max="120"
                  required
                  value={form.age}
                  onChange={(e) =>
                    setForm({ ...form, age: e.target.value })
                  }
                />
              </label>

              <label style={{ fontSize: 13, fontWeight: 700 }}>
                Gender
                <select
                  className="field"
                  style={{ marginTop: 7 }}
                  value={form.gender}
                  onChange={(e) =>
                    setForm({ ...form, gender: e.target.value })
                  }
                >
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </label>

              <label style={{ fontSize: 13, fontWeight: 700 }}>
                Condition
                <input
                  className="field"
                  style={{ marginTop: 7 }}
                  required
                  value={form.condition}
                  placeholder="e.g. Asthma"
                  onChange={(e) =>
                    setForm({ ...form, condition: e.target.value })
                  }
                />
              </label>

              <label style={{ fontSize: 13, fontWeight: 700 }}>
                Phone
                <input
                  className="field"
                  style={{ marginTop: 7 }}
                  required
                  value={form.phone}
                  placeholder="Patient phone"
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                />
              </label>

              <label style={{ fontSize: 13, fontWeight: 700 }}>
                Assigned doctor
                <select
                  className="field"
                  style={{ marginTop: 7 }}
                  required
                  value={form.doctor}
                  onChange={(e) =>
                    setForm({ ...form, doctor: e.target.value })
                  }
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name} — {item.specialization}
                    </option>
                  ))}
                </select>
              </label>

              {error && (
                <p style={{ gridColumn: "1/-1", color: "#b42323", fontSize: 13 }}>
                  {error}
                </p>
              )}

              <div
                style={{
                  gridColumn: "1/-1",
                  display: "flex",
                  justifyContent: "end",
                  gap: 9,
                  marginTop: 8,
                }}
              >
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setModal(false)}
                >
                  Cancel
                </button>

                <button
                  disabled={busy || !doctors.length}
                  className="btn btn-primary"
                >
                  {busy
                    ? "Saving…"
                    : editing
                      ? "Save changes"
                      : "Create patient"}
                </button>
              </div>

              {!doctors.length && (
                <p
                  style={{
                    gridColumn: "1/-1",
                    fontSize: 12,
                    color: "#b42323",
                  }}
                >
                  Add a doctor first before creating a patient.
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </Shell>
  );
}
