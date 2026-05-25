"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { ActiveEvent, DangerStatus } from "@/features/game/types";

const statusColors: Record<DangerStatus, string> = {
  yellow: "#ffe45e",
  orange: "#ff9d38",
  red: "#ff3f5f",
  black: "#060707"
};

function latLngToVector3(latitude: number, longitude: number, radius: number) {
  const phi = (90 - latitude) * (Math.PI / 180);
  const theta = (longitude + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function makeEarthTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const ocean = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  ocean.addColorStop(0, "#061b4a");
  ocean.addColorStop(0.35, "#064f87");
  ocean.addColorStop(0.68, "#071f5c");
  ocean.addColorStop(1, "#020817");
  context.fillStyle = ocean;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.globalAlpha = 0.28;
  for (let i = 0; i < 900; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = 1 + Math.random() * 2.4;
    context.fillStyle = Math.random() > 0.45 ? "#58d7ff" : "#183a76";
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    context.fill();
  }
  context.globalAlpha = 1;

  const continents = [
    [0.2, 0.38, 0.12, 0.24, -0.35],
    [0.31, 0.62, 0.09, 0.19, 0.2],
    [0.5, 0.36, 0.16, 0.22, 0.12],
    [0.58, 0.55, 0.11, 0.18, -0.22],
    [0.71, 0.43, 0.18, 0.16, 0.18],
    [0.78, 0.68, 0.1, 0.12, 0.18],
    [0.46, 0.78, 0.22, 0.08, 0]
  ];

  for (const [cx, cy, rx, ry, rotation] of continents) {
    context.save();
    context.translate(cx * canvas.width, cy * canvas.height);
    context.rotate(rotation);
    const land = context.createRadialGradient(0, 0, 10, 0, 0, rx * canvas.width);
    land.addColorStop(0, "#9fd66c");
    land.addColorStop(0.4, "#38a86d");
    land.addColorStop(0.78, "#1d704e");
    land.addColorStop(1, "#123927");
    context.fillStyle = land;
    context.beginPath();
    context.ellipse(0, 0, rx * canvas.width, ry * canvas.height, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  context.globalAlpha = 0.25;
  context.strokeStyle = "#b8f4ff";
  context.lineWidth = 2;
  for (let y = 110; y < canvas.height; y += 128) {
    context.beginPath();
    context.moveTo(0, y);
    for (let x = 0; x <= canvas.width; x += 80) {
      context.lineTo(x, y + Math.sin(x * 0.018 + y) * 18);
    }
    context.stroke();
  }
  context.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function makeCloudTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 180; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const rx = 30 + Math.random() * 150;
    const ry = 6 + Math.random() * 28;
    context.save();
    context.translate(x, y);
    context.rotate((Math.random() - 0.5) * 0.7);
    context.fillStyle = `rgba(235, 250, 255, ${0.08 + Math.random() * 0.22})`;
    context.beginPath();
    context.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function StarField() {
  const geometry = useMemo(() => {
    const positions = new Float32Array(1800 * 3);
    for (let index = 0; index < 1800; index += 1) {
      const radius = 18 + Math.random() * 34;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index * 3 + 2] = radius * Math.cos(phi);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return starGeometry;
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial color="#dff8ff" size={0.045} sizeAttenuation transparent opacity={0.86} />
    </points>
  );
}

function EarthMesh({ events }: { events: ActiveEvent[] }) {
  const earthRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const router = useRouter();
  const earthTexture = useMemo(() => makeEarthTexture(), []);
  const cloudTexture = useMemo(() => makeCloudTexture(), []);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.055;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.075;
    }
  });

  const handlePointClick = (event: ThreeEvent<MouseEvent>, instanceId: string) => {
    event.stopPropagation();
    router.push(`/event/${encodeURIComponent(instanceId)}`);
  };

  return (
    <group ref={earthRef} rotation={[0.1, -0.52, -0.06]}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[2.35, 128, 128]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#052761"
          emissiveIntensity={0.08}
          map={earthTexture ?? undefined}
          metalness={0.02}
          roughness={0.68}
        />
      </mesh>
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.39, 128, 128]} />
        <meshStandardMaterial
          alphaMap={cloudTexture ?? undefined}
          color="#f2fbff"
          transparent
          opacity={0.36}
          depthWrite={false}
          roughness={0.2}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.46, 128, 128]} />
        <meshBasicMaterial color="#6ce8ff" transparent opacity={0.11} side={THREE.BackSide} />
      </mesh>
      {events.map((activeEvent) => {
        const position = latLngToVector3(activeEvent.latitude, activeEvent.longitude, 2.55);
        const color = statusColors[activeEvent.status];
        return (
          <group key={activeEvent.instanceId} position={position}>
            <mesh onClick={(event) => handlePointClick(event, activeEvent.instanceId)}>
              <sphereGeometry args={[0.075, 32, 32]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.2} />
            </mesh>
            <mesh onClick={(event) => handlePointClick(event, activeEvent.instanceId)}>
              <sphereGeometry args={[0.18, 32, 32]} />
              <meshBasicMaterial color={color} transparent opacity={0.18} />
            </mesh>
            <mesh>
              <torusGeometry args={[0.22, 0.008, 8, 48]} />
              <meshBasicMaterial color={color} transparent opacity={0.72} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function EarthScene({ events }: { events: ActiveEvent[] }) {
  return (
    <div className="earth-canvas">
      <Canvas camera={{ position: [0, 0.2, 6.4], fov: 42 }} gl={{ antialias: true }} shadows>
        <color attach="background" args={["#01040d"]} />
        <fog attach="fog" args={["#01040d", 8, 34]} />
        <StarField />
        <ambientLight intensity={0.26} />
        <directionalLight position={[4, 2, 5]} intensity={3.2} castShadow color="#f6fbff" />
        <pointLight position={[-5, 1, 3]} color="#2f8cff" intensity={4.2} />
        <pointLight position={[3, -4, -5]} color="#4fffd2" intensity={1.2} />
        <EarthMesh events={events} />
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.22}
          enableDamping
          dampingFactor={0.06}
          enablePan={false}
          enableZoom
          minDistance={4.2}
          maxDistance={9.2}
          rotateSpeed={0.52}
          zoomSpeed={0.72}
        />
      </Canvas>
    </div>
  );
}

