"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Bounds, Center, Grid } from "@react-three/drei";

function Model({ url }: { url: string }) {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene} />;
}

useGLTF.preload("/hal.glb");

export default function ViewerPage() {
  return (
    <div style={{ height: "calc(100vh - 60px)" }}>
      <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <OrbitControls makeDefault />
        <Environment preset="city" />
        <Grid infiniteGrid sectionColor={"#444"} cellColor={"#222"} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <Center>
              <Model url={"/hal.glb"} />
            </Center>
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  );
}
