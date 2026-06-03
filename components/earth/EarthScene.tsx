"use client";

import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
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

function StarField() {
  const geometry = useMemo(() => {
    const positions = new Float32Array(2600 * 3);
    const colors = new Float32Array(2600 * 3);

    for (let index = 0; index < 2600; index += 1) {
      const radius = 18 + Math.random() * 48;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index * 3 + 2] = radius * Math.cos(phi);

      const blueTint = 0.72 + Math.random() * 0.28;
      colors[index * 3] = blueTint;
      colors[index * 3 + 1] = 0.86 + Math.random() * 0.14;
      colors[index * 3 + 2] = 1;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return starGeometry;
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial size={0.035} sizeAttenuation vertexColors transparent opacity={0.9} />
    </points>
  );
}

type EventSelectionHandler = (event: ActiveEvent, anchor: { x: number; y: number }) => void;

function EarthMesh({
  events,
  onReady,
  onSelectEvent
}: {
  events: ActiveEvent[];
  onReady?: () => void;
  onSelectEvent?: EventSelectionHandler;
}) {
  const earthRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [earthMap, specularMap, normalMap, cloudMap] = useTexture([
    "/textures/earth_atmos_2048.jpg",
    "/textures/earth_specular_2048.jpg",
    "/textures/earth_normal_2048.jpg",
    "/textures/earth_clouds_1024.png"
  ]);

  earthMap.colorSpace = THREE.SRGBColorSpace;
  cloudMap.colorSpace = THREE.SRGBColorSpace;
  specularMap.colorSpace = THREE.NoColorSpace;
  normalMap.colorSpace = THREE.NoColorSpace;

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.032;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.045;
    }
  });

  const handlePointClick = (event: ThreeEvent<MouseEvent>, instanceId: string) => {
    event.stopPropagation();
    const point = events.find((item) => item.instanceId === instanceId);
    if (point) {
      onSelectEvent?.(point, { x: event.clientX, y: event.clientY });
    }
  };

  return (
    <group ref={earthRef} rotation={[0.16, -0.62, -0.12]}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[2.55, 64, 64]} />
        <meshPhongMaterial
          map={earthMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.42, 0.42)}
          shininess={24}
          specular="#78cfff"
          specularMap={specularMap}
        />
      </mesh>
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.59, 64, 64]} />
        <meshLambertMaterial map={cloudMap} transparent opacity={0.42} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.68, 64, 64]} />
        <meshBasicMaterial color="#58dfff" transparent opacity={0.13} side={THREE.BackSide} />
      </mesh>
      <mesh scale={[1.035, 1.035, 1.035]}>
        <sphereGeometry args={[2.68, 64, 64]} />
        <meshBasicMaterial color="#1f8fff" transparent opacity={0.07} blending={THREE.AdditiveBlending} />
      </mesh>
      {events.map((activeEvent) => {
        const position = latLngToVector3(activeEvent.latitude, activeEvent.longitude, 2.76);
        const color = statusColors[activeEvent.status];
        return (
          <group key={activeEvent.instanceId} position={position}>
            <mesh onClick={(event) => handlePointClick(event, activeEvent.instanceId)}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.6} />
            </mesh>
            <mesh onClick={(event) => handlePointClick(event, activeEvent.instanceId)}>
              <sphereGeometry args={[0.21, 16, 16]} />
              <meshBasicMaterial color={color} transparent opacity={0.14} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh>
              <torusGeometry args={[0.24, 0.007, 8, 56]} />
              <meshBasicMaterial color={color} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function EarthScene({
  events,
  onReady,
  onSelectEvent
}: {
  events: ActiveEvent[];
  onReady?: () => void;
  onSelectEvent?: EventSelectionHandler;
}) {
  return (
    <div className="earth-canvas">
      <Canvas camera={{ position: [0, 0.14, 6.15], fov: 41 }} gl={{ antialias: true }} shadows>
        <color attach="background" args={["#01030b"]} />
        <fog attach="fog" args={["#01030b", 12, 48]} />
        <StarField />
        <ambientLight intensity={0.12} />
        <directionalLight position={[5, 2.7, 4]} intensity={3.8} castShadow color="#fff8ee" />
        <pointLight position={[-5, 1.6, 3.4]} color="#2f8cff" intensity={4.6} />
        <pointLight position={[3, -4, -6]} color="#4fffd2" intensity={1.35} />
        <EarthMesh events={events} onReady={onReady} onSelectEvent={onSelectEvent} />
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.16}
          enableDamping
          dampingFactor={0.06}
          enablePan={false}
          enableZoom
          minDistance={3.95}
          maxDistance={9.5}
          rotateSpeed={0.5}
          zoomSpeed={0.7}
        />
      </Canvas>
    </div>
  );
}
