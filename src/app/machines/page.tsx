import Link from "next/link";

const machines = [
  { name: "HAL Unit", src: "/hal.glb", thumbnail: "/globe.svg" },
];

export default function MachinesPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.5px", marginBottom: 16 }}>
        Select a Machine
      </h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Choose a machine to open in the 3D viewer.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
        {machines.map((m) => (
          <Link
            key={m.src}
            href={`/viewer?src=${encodeURIComponent(m.src)}`}
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #eaeaea",
              borderRadius: 12,
              overflow: "hidden",
              textDecoration: "none",
            }}
          >
            <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f8f8" }}>
              <img src={m.thumbnail} alt={m.name} style={{ width: 64, height: 64 }} />
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ fontWeight: 600 }}>{m.name}</div>
              <div style={{ color: "#666", fontSize: 12 }}>{m.src}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}