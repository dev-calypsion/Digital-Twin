"use client";
import { Suspense, useMemo, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Bounds, Center, Grid, useBounds } from "@react-three/drei";
import { Box3, Vector3, type Object3D } from "three";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

function ClickableEnvelopes({
  root,
  selected,
  onSelect,
}: {
  root: Object3D;
  selected: Object3D | null;
  onSelect: (obj: Object3D) => void;
}) {
  const api = useBounds();
  useEffect(() => {
    if (selected) api.refresh(selected).fit();
  }, [selected, api]);
  const items = useMemo(() => {
    if (!root) return [] as { center: [number, number, number]; size: [number, number, number]; obj: Object3D }[];
    return root.children
      .map((child) => {
        const box = new Box3().setFromObject(child);
        const size = box.getSize(new Vector3());
        const center = box.getCenter(new Vector3());
        if (!isFinite(size.x + size.y + size.z)) return null;
        if (size.x + size.y + size.z <= 1e-6) return null;
        return {
          center: [center.x, center.y, center.z] as [number, number, number],
          size: [size.x, size.y, size.z] as [number, number, number],
          obj: child,
        };
      })
      .filter(Boolean) as { center: [number, number, number]; size: [number, number, number]; obj: Object3D }[];
  }, [root]);
  return (
    <>
      {items.map((e, i) => (
        <mesh
          key={i}
          position={e.center}
          onClick={(ev) => {
            ev.stopPropagation();
            api.refresh(e.obj).fit();
            onSelect(e.obj);
          }}
        >
          <boxGeometry args={e.size} />
          <meshBasicMaterial wireframe color={selected === e.obj ? "orange" : "#555"} transparent opacity={0.3} />
        </mesh>
      ))}
    </>
  );
}

function Model({
  url,
  selected,
  onSelect,
  onReady,
}: {
  url: string;
  selected: Object3D | null;
  onSelect: (obj: Object3D) => void;
  onReady?: (root: Object3D) => void;
}) {
  const gltf = useGLTF(url);
  useEffect(() => {
    if (gltf.scene && onReady) onReady(gltf.scene);
  }, [gltf.scene, onReady]);
  return (
    <>
      <primitive object={gltf.scene} />
      <ClickableEnvelopes root={gltf.scene} selected={selected} onSelect={onSelect} />
    </>
  );
}

// Preload default asset on client
// Moved into effect to avoid preloading during build/prerender
function PreloadDefault() {
  useEffect(() => {
    useGLTF.preload("/hal.glb");
  }, []);
  return null;
}

function ViewerInner() {
  const searchParams = useSearchParams();
  const src = searchParams.get("src") ?? "/hal.glb";
  const [root, setRoot] = useState<Object3D | null>(null);
  const [selected, setSelected] = useState<Object3D | null>(null);
  const parts = useMemo(
    () =>
      root
        ? root.children
            .map((child, i) => {
              const box = new Box3().setFromObject(child);
              const size = box.getSize(new Vector3());
              if (!isFinite(size.x + size.y + size.z)) return null;
              if (size.x + size.y + size.z <= 1e-6) return null;
              const name = child.name && child.name.trim() ? child.name : `Part ${i + 1}`;
              return { name, obj: child };
            })
            .filter(Boolean) as { name: string; obj: Object3D }[]
        : [],
    [root]
  );
  return (
    <div style={{ height: "calc(100vh - 60px)", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          right: 12,
          top: 12,
          background: "rgba(255,255,255,0.85)",
          border: "1px solid #eaeaea",
          borderRadius: 12,
          padding: 12,
          maxHeight: "50vh",
          overflow: "auto",
          minWidth: 220,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Machines</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {parts.map((p, i) => (
            <button
              key={i}
              onClick={() => setSelected(p.obj)}
              style={{
                textAlign: "left",
                border: "1px solid #eaeaea",
                borderRadius: 8,
                padding: "8px 10px",
                background: selected === p.obj ? "#f0f0f0" : "#fff",
                cursor: "pointer",
              }}
            >
              {p.name}
            </button>
          ))}
          {parts.length === 0 ? <div style={{ color: "#666" }}>No machines detected</div> : null}
        </div>
      </div>
      <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <OrbitControls makeDefault />
        <Environment preset="city" />
        <Grid infiniteGrid sectionColor={"#444"} cellColor={"#222"} />
        <PreloadDefault />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <Center>
              <Model url={src} selected={selected} onSelect={setSelected} onReady={setRoot} />
            </Center>
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default function ViewerPage() {
  return (
    <Suspense fallback={null}>
      <ViewerInner />
    </Suspense>
  );
}
