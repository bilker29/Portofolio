import * as THREE from 'three';
import React, { Component, useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

extend({ MeshLineGeometry, MeshLineMaterial });

const GLTF_PATH = '/assets/kartu.glb';
const TEXTURE_PATH = '/assets/bandd.png';
const CARD_TEXTURE_PATH = '/assets/card_custom.png';

useGLTF.preload(GLTF_PATH);
useTexture.preload(TEXTURE_PATH);
useTexture.preload(CARD_TEXTURE_PATH);

  // ─── Error Boundary for 3D Canvas ───────────────────────────────────────────
  class CanvasErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      console.error('3D Card Error:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-sky-950/20 backdrop-blur-md rounded-2xl border border-sky-400/30">
            <div className="w-48 h-72 rounded-xl border-2 border-sky-400/60 bg-gradient-to-br from-slate-900 to-sky-950 flex flex-col items-center justify-center p-4 text-white shadow-xl">
              <div className="w-20 h-20 rounded-full border-2 border-sky-400 overflow-hidden mb-3">
                <img src="/Photo.jpg" alt="Billy Wicaksono" className="w-full h-full object-cover" />
              </div>
              <h4 className="font-bold text-sm">Billy Wicaksono</h4>
              <p className="text-xs text-sky-400">Teknik Informatika</p>
              <p className="text-[11px] text-emerald-400 mt-1 font-mono">IPK 3.76 • BNSP IT</p>
            </div>
            <p className="text-xs text-slate-500 mt-3 font-mono">3D canvas preview mode</p>
          </div>
        );
      }
      return this.props.children;
    }
  }

  // ─── Band (Lanyard rope + 3D card physics) ──────────────────────────────────
  function Band({ maxSpeed = 50, minSpeed = 10 }) {
    const band = useRef();
    const fixed = useRef();
    const j1 = useRef();
    const j2 = useRef();
    const j3 = useRef();
    const card = useRef();

    const vec = new THREE.Vector3();
    const ang = new THREE.Vector3();
    const rot = new THREE.Vector3();
    const dir = new THREE.Vector3();

    const segmentProps = {
      type: 'dynamic',
      canSleep: true,
      colliders: false,
      angularDamping: 4,
      linearDamping: 4,
    };

    const { nodes, materials } = useGLTF(GLTF_PATH);
    const bandTexture = useTexture(TEXTURE_PATH);
    const cardTexture = useTexture(CARD_TEXTURE_PATH);
    const { width, height } = useThree((state) => state.size);

    const [curve] = useState(
      () =>
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3(),
        ])
    );
    const [dragged, drag] = useState(false);
    const [hovered, hover] = useState(false);

    useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
    useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

    useEffect(() => {
      if (hovered) {
        document.body.style.cursor = dragged ? 'grabbing' : 'grab';
        return () => void (document.body.style.cursor = 'auto');
      }
    }, [hovered, dragged]);

    useFrame((state, delta) => {
      if (dragged) {
        vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
        dir.copy(vec).sub(state.camera.position).normalize();
        vec.add(dir.multiplyScalar(state.camera.position.length()));
        [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
        card.current?.setNextKinematicTranslation({
          x: vec.x - dragged.x,
          y: vec.y - dragged.y,
          z: vec.z - dragged.z,
        });
      }
      if (fixed.current) {
        [j1, j2].forEach((ref) => {
          if (!ref.current.lerped)
            ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
          const clampedDistance = Math.max(
            0.1,
            Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
          );
          ref.current.lerped.lerp(
            ref.current.translation(),
            delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
          );
        });
        curve.points[0].copy(j3.current.translation());
        curve.points[1].copy(j2.current.lerped);
        curve.points[2].copy(j1.current.lerped);
        curve.points[3].copy(fixed.current.translation());
        band.current.geometry.setPoints(curve.getPoints(32));
        ang.copy(card.current.angvel());
        rot.copy(card.current.rotation());
        card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
      }
    });

    curve.curveType = 'chordal';
    bandTexture.wrapS = bandTexture.wrapT = THREE.RepeatWrapping;

    return (
      <>
        <group position={[0, 4, 0]}>
          <RigidBody ref={fixed} {...segmentProps} type="fixed" />
          <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
            <BallCollider args={[0.1]} />
          </RigidBody>
          <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
            <BallCollider args={[0.1]} />
          </RigidBody>
          <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
            <BallCollider args={[0.1]} />
          </RigidBody>
          <RigidBody
            position={[2, 0, 0]}
            ref={card}
            {...segmentProps}
            type={dragged ? 'kinematicPosition' : 'dynamic'}
          >
            <CuboidCollider args={[0.8, 1.125, 0.01]} />
            <group
              scale={2.25}
              position={[0, -1.2, -0.05]}
              onPointerOver={() => hover(true)}
              onPointerOut={() => hover(false)}
              onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
              onPointerDown={(e) => (
                e.target.setPointerCapture(e.pointerId),
                drag(
                  new THREE.Vector3()
                    .copy(e.point)
                    .sub(vec.copy(card.current.translation()))
                )
              )}
            >
              <mesh geometry={nodes.card.geometry}>
                <meshPhysicalMaterial
                  map={cardTexture || materials.base.map}
                  map-anisotropy={16}
                  clearcoat={1}
                  clearcoatRoughness={0.15}
                  roughness={0.3}
                  metalness={0.5}
                />
              </mesh>
              <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
              <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
            </group>
          </RigidBody>
        </group>

        {/* Lanyard Rope band */}
        <mesh ref={band}>
          <meshLineGeometry />
          <meshLineMaterial
            color="white"
            depthTest={false}
            resolution={[width, height]}
            useMap
            map={bandTexture}
            repeat={[-4, 1]}
            lineWidth={1}
          />
        </mesh>
      </>
    );
  }

  // ─── Loading Fallback Placeholder ───────────────────────────────────────────
  function CardFallback() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-sky-600 animate-pulse tracking-wider">
            Loading 3D Card...
          </span>
        </div>
        );
}

        // ─── Main Export ────────────────────────────────────────────────────────────
        export default function IdCard() {
  return (
          <div className="w-full h-[520px] sm:h-[600px] flex flex-col items-center justify-center relative select-none">
            <CanvasErrorBoundary>
              <Suspense fallback={<CardFallback />}>
                <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
                  <ambientLight intensity={Math.PI} />
                  <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
                    <Band />
                  </Physics>
                  <Environment background blur={0.75}>
                    <color attach="background" args={['#e0f2fe']} />
                    <Lightformer intensity={2} color="#bae6fd" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                    <Lightformer intensity={3} color="#7dd3fc" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                    <Lightformer intensity={3} color="#38bdf8" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                    <Lightformer intensity={6} color="#0284c7" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
                  </Environment>
                </Canvas>
              </Suspense>
            </CanvasErrorBoundary>
            <div className="mt-1 text-center">
              <p className="text-[11px] font-mono text-slate-500 tracking-wide select-none">
                🖱️ <span className="font-semibold text-sky-700">Tahan & geser kartu</span> untuk mengayunkannya
              </p>
            </div>
          </div>
          );
}
