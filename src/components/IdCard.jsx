/* eslint-disable react/no-unknown-property */
import * as THREE from "three";
import React, { Component, useEffect, useMemo, useRef, useState, Suspense, memo } from "react";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture, Environment, Lightformer } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { RotateCw, Move } from "lucide-react";

extend({ MeshLineGeometry, MeshLineMaterial });

const GLTF_PATH = "/assets/kartu.glb";
const BAND_TEXTURE_PATH = "/assets/band_custom.png";
const CARD_TEXTURE_PATH = "/assets/card_custom.png";

useGLTF.preload(GLTF_PATH);
useTexture.preload(BAND_TEXTURE_PATH);
useTexture.preload(CARD_TEXTURE_PATH);

const GRAVITY = [0, -40, 0];
const CAMERA_CONFIG = { position: [0, -0.15, 13.8], fov: 24 };
const GL_CONFIG = { alpha: true, antialias: true, powerPreference: "high-performance" };
const DPR_CONFIG = [1, 2];

class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("3D Card Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
          <div className="w-56 rounded-2xl border-2 border-sky-400/70 bg-gradient-to-br from-slate-900 to-sky-950 flex flex-col items-center justify-center p-5 text-white shadow-2xl">
            <div className="w-24 h-24 rounded-xl border-2 border-sky-400 overflow-hidden mb-3">
              <img src="/Photo.jpg" alt="Billy Wicaksono" className="w-full h-full object-cover" />
            </div>
            <h4 className="font-bold text-base">Billy Wicaksono</h4>
            <p className="text-xs text-sky-400">Software Engineer • UNPAS</p>
            <p className="text-[11px] text-emerald-400 mt-1 font-mono">IPK 3.76 • BNSP • GSA</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const Band = memo(function Band({ maxSpeed = 50, minSpeed = 10, cardRefExternal }) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();

  const { vec, ang, rot, dir } = useMemo(
    () => ({
      vec: new THREE.Vector3(),
      ang: new THREE.Vector3(),
      rot: new THREE.Vector3(),
      dir: new THREE.Vector3(),
    }),
    []
  );

  const segmentProps = useMemo(
    () => ({
      type: "dynamic",
      canSleep: false,
      colliders: false,
      angularDamping: 3.5,
      linearDamping: 3.5,
    }),
    []
  );

  const { nodes, materials } = useGLTF(GLTF_PATH);
  const rawBandTexture = useTexture(BAND_TEXTURE_PATH);
  const rawCardTexture = useTexture(CARD_TEXTURE_PATH);
  const { width, height } = useThree((state) => state.size);

  const bandTexture = useMemo(() => {
    const tex = rawBandTexture.clone();
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    tex.needsUpdate = true;
    return tex;
  }, [rawBandTexture]);

  const cardTexture = useMemo(() => {
    const tex = rawCardTexture.clone();
    // kartu.glb uses glTF UV origin (top-left): flipY MUST be false
    tex.flipY = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    tex.needsUpdate = true;
    return tex;
  }, [rawCardTexture]);

  const resolution = useMemo(() => [Math.max(1, width), Math.max(1, height)], [width, height]);
  const repeat = useMemo(() => [-4, 1], []);

  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.5, 0),
      new THREE.Vector3(0, 2.3, 0),
      new THREE.Vector3(0, 3.1, 0),
      new THREE.Vector3(0, 4.0, 0),
    ]);
    c.curveType = "chordal";
    return c;
  });

  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useEffect(() => {
    if (cardRefExternal) {
      cardRefExternal.current = card.current;
    }
  });

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  useEffect(() => {
    if (!dragged) return;
    const stopDrag = () => drag(false);
    window.addEventListener("pointerup", stopDrag);
    window.addEventListener("pointercancel", stopDrag);
    return () => {
      window.removeEventListener("pointerup", stopDrag);
      window.removeEventListener("pointercancel", stopDrag);
    };
  }, [dragged]);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);

    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (fixed.current && j1.current && j2.current && j3.current && card.current && band.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) {
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        }
        const t = ref.current.translation();
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(t)));
        ref.current.lerped.lerp(t, delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());

      band.current.geometry.setPoints(curve.getPoints(32));

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      // Keep card lightly stabilized unless user spins or swings it aggressively
      card.current.setAngvel({
        x: ang.x,
        y: ang.y - rot.y * 0.22,
        z: ang.z,
      });
    }
  });

  return (
    <>
      <group position={[0, 4.15, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.45, -0.75, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.9, -1.5, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.35, -2.25, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1.8, -3.0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={(e) => {
              e.stopPropagation();
              hover(true);
            }}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              e.stopPropagation();
              try {
                e.target.releasePointerCapture(e.pointerId);
              } catch {
                // pointer capture already released
              }
              drag(false);
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              try {
                e.target.setPointerCapture(e.pointerId);
              } catch {
                // pointer capture unavailable
              }
              const t = card.current.translation();
              drag(new THREE.Vector3().copy(e.point).sub(vec.set(t.x, t.y, t.z)));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardTexture || materials.base.map}
                map-anisotropy={16}
                clearcoat={0.95}
                clearcoatRoughness={0.14}
                roughness={0.32}
                metalness={0.18}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.25} material-metalness={0.85} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} material-roughness={0.25} material-metalness={0.85} />
          </group>
        </RigidBody>
      </group>

      {/* Solid Lanyard Rope MeshLine (frustumCulled=false + depthTest=true prevents any flicker) */}
      <mesh ref={band} frustumCulled={false}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={true}
          transparent={false}
          resolution={resolution}
          useMap
          map={bandTexture}
          repeat={repeat}
          lineWidth={0.95}
        />
      </mesh>
    </>
  );
});

const SceneEnvironment = memo(function SceneEnvironment() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer intensity={2.2} color="#e0f2fe" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
      <Lightformer intensity={2.8} color="#ffffff" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
      <Lightformer intensity={2.8} color="#ffffff" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
      <Lightformer intensity={5} color="#bae6fd" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
    </Environment>
  );
});

function CardFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-mono text-sky-700 animate-pulse tracking-wider font-semibold">
        Loading 3D ID Card...
      </span>
    </div>
  );
}

const IdCard = memo(function IdCard() {
  const cardPhysicsRef = useRef(null);

  const handleFlipSwing = () => {
    const body = cardPhysicsRef.current;
    if (!body) return;
    body.wakeUp?.();
    body.applyTorqueImpulse({ x: 0, y: 1.6, z: 0 }, true);
    body.applyImpulse({ x: 0.45, y: 0.25, z: 0 }, true);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center relative select-none">
      <div className="w-full h-[460px] sm:h-[520px] relative">
        <CanvasErrorBoundary>
          <Suspense fallback={<CardFallback />}>
            <Canvas
              camera={CAMERA_CONFIG}
              gl={GL_CONFIG}
              dpr={DPR_CONFIG}
              style={{ background: "transparent" }}
            >
              <ambientLight intensity={Math.PI * 0.9} />
              <directionalLight position={[4, 6, 8]} intensity={1.2} color="#ffffff" />
              <Physics interpolate gravity={GRAVITY} timeStep={1 / 60}>
                <Band cardRefExternal={cardPhysicsRef} />
              </Physics>
              <SceneEnvironment />
            </Canvas>
          </Suspense>
        </CanvasErrorBoundary>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5 relative z-30">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-sky-200/90 shadow-sm text-[11px] font-semibold text-slate-600">
          <Move className="w-3.5 h-3.5 text-sky-600" />
          <span>Tahan & geser kartu untuk mengayun</span>
        </div>
        <button
          type="button"
          onClick={handleFlipSwing}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#0284c7] to-[#0d9488] hover:opacity-95 text-white shadow-sm hover:shadow-md text-[11px] font-bold transition-all active:scale-95 cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Putar Kartu</span>
        </button>
      </div>
    </div>
  );
});

export default IdCard;
