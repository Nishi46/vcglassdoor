"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const VERT = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  attribute float aRandom;
  attribute float aSpeed;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Float animation
    pos.y += sin(uTime * aSpeed + aRandom * 6.28) * 0.08;
    pos.x += cos(uTime * aSpeed * 0.7 + aRandom * 3.14) * 0.04;

    // Mouse repulsion
    vec2 diff = pos.xy - uMouse;
    float dist = length(diff);
    float repulse = smoothstep(1.2, 0.0, dist) * uHover;
    pos.xy += normalize(diff) * repulse * 0.5;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = (aRandom * 2.0 + 1.0) * (300.0 / -mvPos.z);

    vAlpha = 0.3 + aRandom * 0.5;
  }
`;

const FRAG = `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, d) * vAlpha;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

function Particles() {
  const meshRef = useRef<THREE.Points>(null!);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const targetMouse = useRef(new THREE.Vector2(0, 0));
  const hover = useRef(0);
  const { viewport } = useThree();

  const COUNT = 1200;

  const [positions, randoms, speeds] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const rnd = new Float32Array(COUNT);
    const spd = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      rnd[i] = Math.random();
      spd[i] = 0.3 + Math.random() * 0.7;
    }
    return [pos, rnd, spd];
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uHover: { value: 0 },
    uColor: { value: new THREE.Color("#60a5fa") },
  }), []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetMouse.current.set(
        (e.clientX / window.innerWidth - 0.5) * viewport.width,
        -(e.clientY / window.innerHeight - 0.5) * viewport.height
      );
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [viewport]);

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
    mouse.current.lerp(targetMouse.current, 0.06);
    uniforms.uMouse.value.copy(mouse.current);
    hover.current += (1 - hover.current) * 0.02;
    uniforms.uHover.value = hover.current;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleField() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Particles />
      </Canvas>
    </div>
  );
}
