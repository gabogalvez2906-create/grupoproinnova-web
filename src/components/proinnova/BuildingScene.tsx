import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Group, Mesh, MeshStandardMaterial } from 'three'

import { BUILDING_FLOORS } from './site'

/* Proportions traced from the reference photograph: wide floor plates with a
   pronounced cantilever, chunky square columns, thin rebar cages on top. */
const FLOORS = BUILDING_FLOORS
const FLOOR_H = 2.15
const BAY = 2.7
const COLS_X = 4
const COLS_Z = 3
const COL_W = 0.44
const SLAB_T = 0.28
const OVERHANG = 0.5

const PLAN_X = (COLS_X - 1) * BAY
const PLAN_Z = (COLS_Z - 1) * BAY
const SLAB_X = PLAN_X + OVERHANG * 2
const SLAB_Z = PLAN_Z + OVERHANG * 2

const BUILD_START = 0.05
const BUILD_END = 0.8

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

const COLUMN_POS: [number, number][] = []
for (let i = 0; i < COLS_X; i++) {
  for (let j = 0; j < COLS_Z; j++) {
    COLUMN_POS.push([i * BAY - PLAN_X / 2, j * BAY - PLAN_Z / 2])
  }
}

/** Rebar cage offsets — a cluster of bars per column, as in the photo. */
const REBAR_OFFSETS: [number, number][] = [
  [-0.13, -0.13],
  [0, -0.14],
  [0.13, -0.13],
  [-0.14, 0],
  [0.14, 0],
  [-0.13, 0.13],
  [0, 0.14],
  [0.13, 0.13],
]

interface Progress {
  value: number
}

type ProgressRef = { current: Progress }

function useSharedAssets() {
  return useMemo(() => {
    const concrete = new THREE.MeshStandardMaterial({
      color: '#9a958c',
      roughness: 0.95,
      metalness: 0.02,
    })
    /* Slabs fade in individually, so each level clones this rather than sharing
       it — a shared instance would let the last level overwrite every opacity. */
    const slabProto = new THREE.MeshStandardMaterial({
      color: '#aaa49a',
      roughness: 0.92,
      metalness: 0.02,
      transparent: true,
      opacity: 0,
    })
    const steel = new THREE.MeshStandardMaterial({
      color: '#4a423a',
      roughness: 0.55,
      metalness: 0.65,
    })
    const rail = new THREE.MeshStandardMaterial({
      color: '#9c7a3c',
      roughness: 0.6,
      metalness: 0.3,
    })
    const timber = new THREE.MeshStandardMaterial({
      color: '#8a6134',
      roughness: 0.9,
    })

    return {
      mat: { concrete, slabProto, steel, rail, timber },
      geo: {
        column: new THREE.BoxGeometry(COL_W, FLOOR_H, COL_W),
        slab: new THREE.BoxGeometry(SLAB_X, SLAB_T, SLAB_Z),
        rebar: new THREE.CylinderGeometry(0.022, 0.022, 1, 5),
        railX: new THREE.BoxGeometry(SLAB_X, 0.05, 0.05),
        railZ: new THREE.BoxGeometry(0.05, 0.05, SLAB_Z),
        post: new THREE.BoxGeometry(0.05, 0.95, 0.05),
        beamX: new THREE.BoxGeometry(SLAB_X, 0.16, 0.16),
      },
    }
  }, [])
}

type Assets = ReturnType<typeof useSharedAssets>

function Level({
  index,
  progressRef,
  assets,
}: {
  index: number
  progressRef: ProgressRef
  assets: Assets
}) {
  const columnsRef = useRef<Group>(null)
  const rebarRef = useRef<Group>(null)
  const slabRef = useRef<Mesh>(null)
  const railRef = useRef<Group>(null)
  const formworkRef = useRef<Group>(null)

  const baseY = index * FLOOR_H
  const span = (BUILD_END - BUILD_START) / FLOORS
  const startAt = BUILD_START + index * span

  // Own material instance so this level's fade is independent of the others.
  const slabMat = useMemo(() => assets.mat.slabProto.clone(), [assets])

  useFrame(() => {
    const p = progressRef.current.value
    const t = clamp01((p - startAt) / (span * 1.45))

    const rebarT = clamp01(t / 0.3)
    const colT = clamp01((t - 0.18) / 0.4)
    const formT = clamp01((t - 0.44) / 0.24)
    const slabT = clamp01((t - 0.58) / 0.34)
    const railT = clamp01((t - 0.86) / 0.14)

    // Rebar cage rises first, then gets encased as the column is poured.
    if (rebarRef.current) {
      const fade = 1 - clamp01((colT - 0.35) / 0.65)
      const h = rebarT * (1 - 0.55 * (1 - fade))
      rebarRef.current.scale.y = Math.max(0.0001, h)
      rebarRef.current.visible = rebarT > 0.01 && h > 0.02
    }

    if (columnsRef.current) {
      columnsRef.current.scale.y = Math.max(0.0001, colT)
      columnsRef.current.visible = colT > 0.004
    }

    // Timber formwork appears, then the slab is poured on top of it.
    if (formworkRef.current) {
      const fade = 1 - clamp01((slabT - 0.55) / 0.45)
      formworkRef.current.visible = formT > 0.02 && fade > 0.05
      formworkRef.current.scale.x = Math.max(0.0001, formT)
    }

    if (slabRef.current) {
      slabRef.current.visible = slabT > 0.004
      slabRef.current.scale.x = Math.max(0.0001, slabT)
      const mat = slabRef.current.material as MeshStandardMaterial
      mat.opacity = clamp01(slabT * 1.6)
    }

    if (railRef.current) {
      railRef.current.visible = railT > 0.02
      railRef.current.scale.y = Math.max(0.0001, railT)
    }
  })

  const { mat, geo } = assets

  return (
    <group>
      {/* rebar cages, poking above the deck */}
      <group ref={rebarRef} position={[0, baseY, 0]}>
        {COLUMN_POS.map(([x, z], i) => (
          <group key={i} position={[x, 0, z]}>
            {REBAR_OFFSETS.map(([ox, oz], k) => (
              <mesh
                key={k}
                geometry={geo.rebar}
                material={mat.steel}
                position={[ox, FLOOR_H * 0.5, oz]}
                scale={[1, FLOOR_H + 0.55, 1]}
              />
            ))}
          </group>
        ))}
      </group>

      {/* poured columns */}
      <group ref={columnsRef} position={[0, baseY, 0]}>
        {COLUMN_POS.map(([x, z], i) => (
          <mesh
            key={i}
            geometry={geo.column}
            material={mat.concrete}
            position={[x, FLOOR_H / 2, z]}
          />
        ))}
      </group>

      {/* timber formwork carrying the deck before the pour */}
      <group ref={formworkRef} position={[0, baseY + FLOOR_H - 0.18, 0]}>
        {[-0.62, 0, 0.62].map((f, i) => (
          <mesh
            key={i}
            geometry={geo.beamX}
            material={mat.timber}
            position={[0, 0, f * PLAN_Z]}
          />
        ))}
      </group>

      {/* the floor plate, cantilevered past the columns */}
      <mesh
        ref={slabRef}
        geometry={geo.slab}
        material={slabMat}
        position={[0, baseY + FLOOR_H + SLAB_T / 2, 0]}
      />

      {/* tubular edge protection — a single top rail keeps the silhouette clean */}
      <group ref={railRef} position={[0, baseY + FLOOR_H + SLAB_T, 0]}>
        {[-1, 1].map((s) => (
          <mesh
            key={s}
            geometry={geo.railX}
            material={mat.rail}
            position={[0, 0.8, (s * SLAB_Z) / 2]}
          />
        ))}
        {[-1, 1].map((s) => (
          <mesh
            key={`z${s}`}
            geometry={geo.railZ}
            material={mat.rail}
            position={[(s * SLAB_X) / 2, 0.8, 0]}
          />
        ))}
        {COLUMN_POS.filter(([, z]) => z > PLAN_Z / 2 - 0.01).map(([x, z], i) => (
          <mesh
            key={`p${i}`}
            geometry={geo.post}
            material={mat.rail}
            position={[x, 0.42, z + OVERHANG]}
          />
        ))}
      </group>
    </group>
  )
}

function Crane({ progressRef }: { progressRef: ProgressRef }) {
  const jibRef = useRef<Group>(null)
  const hookRef = useRef<Group>(null)
  const cableRef = useRef<Mesh>(null)
  const mastRef = useRef<Group>(null)

  const mastH = FLOORS * FLOOR_H + 1.9

  useFrame(() => {
    const p = progressRef.current.value
    const buildT = clamp01((p - BUILD_START) / (BUILD_END - BUILD_START))

    if (mastRef.current) {
      mastRef.current.scale.y = Math.max(0.0001, clamp01(p / 0.1))
    }
    if (jibRef.current) {
      jibRef.current.rotation.y = Math.sin(buildT * Math.PI * FLOORS) * 0.5 - 0.25
    }

    const cycle = (buildT * FLOORS) % 1
    const drop = Math.sin(cycle * Math.PI) * 3.4
    if (hookRef.current) hookRef.current.position.y = -0.5 - drop
    if (cableRef.current) {
      cableRef.current.scale.y = Math.max(0.05, 0.5 + drop)
      cableRef.current.position.y = -(0.5 + drop) / 2
    }
  })

  return (
    <group position={[PLAN_X * 0.5, 0, -PLAN_Z * 2.1]}>
      <group ref={mastRef}>
        <mesh position={[0, mastH / 2, 0]}>
          <boxGeometry args={[0.26, mastH, 0.26]} />
          <meshStandardMaterial color="#6f5a33" roughness={0.65} metalness={0.4} />
        </mesh>
      </group>

      <group ref={jibRef} position={[0, mastH, 0]}>
        <mesh position={[-4.2, 0, 0]}>
          <boxGeometry args={[8.8, 0.14, 0.14]} />
          <meshStandardMaterial color="#6f5a33" roughness={0.65} metalness={0.4} />
        </mesh>
        <mesh position={[1.5, 0, 0]}>
          <boxGeometry args={[2.6, 0.12, 0.12]} />
          <meshStandardMaterial color="#6f5a33" roughness={0.65} metalness={0.4} />
        </mesh>
        <mesh position={[2.5, -0.13, 0]}>
          <boxGeometry args={[0.6, 0.32, 0.32]} />
          <meshStandardMaterial color="#3f3a33" roughness={0.75} />
        </mesh>

        <group position={[-5.2, 0, 0]}>
          <mesh ref={cableRef} position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.014, 0.014, 1, 5]} />
            <meshStandardMaterial color="#3f3a33" roughness={0.5} metalness={0.6} />
          </mesh>
          <group ref={hookRef} position={[0, -0.5, 0]}>
            <mesh>
              <boxGeometry args={[0.2, 0.28, 0.2]} />
              <meshStandardMaterial color="#3f3a33" roughness={0.5} metalness={0.7} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  )
}

function Site({ progressRef }: { progressRef: ProgressRef }) {
  const assets = useSharedAssets()
  const target = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ camera }) => {
    const p = progressRef.current.value
    const topY = FLOORS * FLOOR_H
    // Portrait screens have no room beside the headline, so centre the
    // structure and pull back far enough to keep it whole. Uses the window,
    // not the canvas, because CSS shrinks the canvas on those screens.
    const portrait = window.innerWidth / window.innerHeight < 0.9

    /* Camera framing follows the reference photo: a corner view that keeps the
       whole structure in frame, rising and easing back as it grows. */
    const orbit = -0.58 + p * 0.4
    const radius = (portrait ? 34 : 30) + p * (portrait ? 12 : 10)
    const camY = 3.5 + p * topY * 0.72

    camera.position.set(
      Math.sin(orbit) * radius,
      camY,
      Math.cos(orbit) * radius,
    )
    // On landscape screens aim well left of centre so the structure sits on the right.
    // On portrait, aim a little low so the structure clears the headline below it.
    target.set(
      portrait ? 0 : -PLAN_X * 1.15,
      topY * 0.5 * clamp01(p / 0.8) + (portrait ? -1.2 : 1.4),
      0,
    )
    camera.lookAt(target)
  })

  return (
    <group position={[0, -3.4, 0]}>
      {/* ground slab — dark and tight so it reads as site, not a display plinth */}
      <mesh position={[0, -0.14, 0]} receiveShadow>
        <boxGeometry args={[SLAB_X + 3.5, 0.28, SLAB_Z + 3.5]} />
        <meshStandardMaterial color="#241f1a" roughness={1} />
      </mesh>

      {Array.from({ length: FLOORS }, (_, i) => (
        <Level key={i} index={i} progressRef={progressRef} assets={assets} />
      ))}

      <Crane progressRef={progressRef} />
    </group>
  )
}

export default function BuildingScene({
  progressRef,
}: {
  progressRef: ProgressRef
}) {
  return (
    <Canvas
      camera={{ position: [10, 1.4, 12], fov: 42 }}
      dpr={[1, 1.75]}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Low sun sits behind the structure, so it reads as a warm-rimmed
          silhouette like the reference photograph rather than a lit model. */}
      <ambientLight intensity={0.32} />
      <directionalLight position={[-24, 9, -14]} intensity={2.4} color="#ffb066" />
      <directionalLight position={[14, 7, 10]} intensity={0.28} color="#7d9fc4" />
      <hemisphereLight args={['#ffcb92', '#2b2620', 0.4]} />
      <Site progressRef={progressRef} />
    </Canvas>
  )
}
