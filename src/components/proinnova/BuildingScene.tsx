import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";

import { BUILDING_FLOORS } from "./site";
import {
  clamp01,
  easeInOutCubic,
  easeOutCubic,
  facadeValue,
  floorPhase,
  lightsValue,
  range,
  structureValue,
} from "./buildTimeline";

type ProgressRef = { current: { value: number } };

/* ---------------------------------------------------------------- geometry */

const FLOORS = BUILDING_FLOORS;
const FLOOR_H = 1.9;
const BAY = 2.6;
const COLS_X = 4;
const COLS_Z = 3;
const COL_W = 0.42;
const SLAB_T = 0.26;
const OVERHANG = 0.45;
const PLAN_X = (COLS_X - 1) * BAY;
const PLAN_Z = (COLS_Z - 1) * BAY;
const SLAB_X = PLAN_X + COL_W + OVERHANG * 2;
const SLAB_Z = PLAN_Z + COL_W + OVERHANG * 2;
const FACADE_X = PLAN_X + COL_W + 0.06;
const FACADE_Z = PLAN_Z + COL_W + 0.06;
const TOP = FLOORS * FLOOR_H;

/** Low sun behind the structure, a few degrees above the horizon. */
const SUN_DIR = new THREE.Vector3(0.309, 0.1, -0.951).normalize();
const SUN_AZIMUTH = Math.atan2(SUN_DIR.z, SUN_DIR.x);
const HAZE = "#d4875f";

const COLUMNS: { x: number; z: number; delay: number }[] = [];
for (let i = 0; i < COLS_X; i++) {
  for (let j = 0; j < COLS_Z; j++) {
    const x = i * BAY - PLAN_X / 2;
    const z = j * BAY - PLAN_Z / 2;
    // Columns are poured in a sweep across the plan rather than all at once.
    COLUMNS.push({ x, z, delay: (i / (COLS_X - 1)) * 0.65 + (j / (COLS_Z - 1)) * 0.35 });
  }
}

const REBAR: [number, number][] = [
  [-0.12, -0.12],
  [0, -0.13],
  [0.12, -0.12],
  [-0.13, 0],
  [0.13, 0],
  [-0.12, 0.12],
  [0, 0.13],
  [0.12, 0.12],
];

/** Temporary shores under each slab, between the columns. */
const SHORES: [number, number][] = [];
for (const x of [-BAY, 0, BAY]) for (const z of [-BAY / 2, BAY / 2]) SHORES.push([x, z]);

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Descent of floor `i`'s slab: 0 = not yet lifted, 1 = set in place. */
function slabDrop(p: number, i: number) {
  return range(floorPhase(structureValue(p), i), 0.42, 0.82);
}

/* ---------------------------------------------------------------- sky */

const SKY_VERT = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SKY_FRAG = /* glsl */ `
  uniform vec3 uSunDir;
  uniform float uDusk;
  uniform float uTime;
  varying vec3 vDir;

  vec3 lin(vec3 c) { return pow(c, vec3(2.2)); }
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }

  void main() {
    vec3 d = normalize(vDir);
    float h = d.y;
    float sd = max(dot(d, normalize(uSunDir)), 0.0);

    vec3 zenith  = lin(mix(vec3(0.27, 0.30, 0.48), vec3(0.12, 0.13, 0.27), uDusk));
    vec3 upper   = lin(mix(vec3(0.86, 0.55, 0.46), vec3(0.58, 0.33, 0.36), uDusk));
    vec3 low     = lin(mix(vec3(1.00, 0.66, 0.38), vec3(0.95, 0.47, 0.27), uDusk));
    vec3 horizon = lin(mix(vec3(1.00, 0.80, 0.52), vec3(1.00, 0.62, 0.38), uDusk));

    vec3 col = mix(horizon, low, smoothstep(0.0, 0.06, h));
    col = mix(col, upper, smoothstep(0.05, 0.24, h));
    col = mix(col, zenith, smoothstep(0.2, 0.75, h));
    col = mix(col, lin(vec3(0.24, 0.17, 0.15)), smoothstep(0.0, -0.1, h));

    // Glow around the sun, strongest along the horizon.
    float band = 1.0 - smoothstep(0.0, 0.35, abs(h - uSunDir.y));
    col += lin(vec3(1.0, 0.66, 0.36)) * pow(sd, 6.0) * 0.55 * band;
    col += lin(vec3(1.0, 0.78, 0.5)) * pow(sd, 48.0) * 0.9;

    // Stretched sunset clouds, lit from underneath near the sun.
    if (h > 0.0) {
      vec2 uv = d.xz / (h + 0.09);
      float c = fbm(uv * vec2(0.55, 1.9) + vec2(uTime * 0.004, 0.0));
      c = smoothstep(0.5, 0.78, c) * smoothstep(0.015, 0.09, h) * (1.0 - smoothstep(0.3, 0.62, h));
      vec3 cloud = mix(lin(vec3(0.42, 0.26, 0.30)), lin(vec3(1.0, 0.64, 0.4)), 0.25 + 0.75 * pow(sd, 3.0));
      col = mix(col, cloud, c * 0.8);
    }

    // Sun disc — well above 1.0 so the bloom pass picks it up.
    col += lin(vec3(1.0, 0.7, 0.38)) * pow(sd, 900.0) * 2.2;
    col += lin(vec3(1.0, 0.86, 0.62)) * smoothstep(0.99955, 0.9998, sd) * 6.0;

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

function makeSkyMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: SKY_VERT,
    fragmentShader: SKY_FRAG,
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uSunDir: { value: SUN_DIR.clone() },
      uDusk: { value: 0 },
      uTime: { value: 0 },
    },
  });
}

function Sky({ progressRef }: { progressRef: ProgressRef }) {
  const ref = useRef<THREE.Mesh>(null);
  const material = useMemo(makeSkyMaterial, []);

  useFrame(({ camera, clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.position.copy(camera.position);
    const p = progressRef.current.value;
    material.uniforms["uDusk"]!.value = easeInOutCubic(range(p, 0.3, 1));
    material.uniforms["uTime"]!.value = clock.elapsedTime;
    (material.uniforms["uSunDir"]!.value as THREE.Vector3)
      .copy(SUN_DIR)
      .setY(SUN_DIR.y - 0.035 * range(p, 0.3, 1))
      .normalize();
  });

  return (
    <mesh ref={ref} material={material} frustumCulled={false} renderOrder={-1}>
      <sphereGeometry args={[900, 48, 24]} />
    </mesh>
  );
}

/** Captures the sunset sky once as an environment map, so glass and steel reflect it. */
function SkyEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envScene = new THREE.Scene();
    const material = makeSkyMaterial();
    material.uniforms["uDusk"]!.value = 0.35;
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), material);
    envScene.add(sphere);
    const target = pmrem.fromScene(envScene, 0.02, 0.1, 100);
    scene.environment = target.texture;
    scene.environmentIntensity = 0.75;

    return () => {
      scene.environment = null;
      target.dispose();
      pmrem.dispose();
      sphere.geometry.dispose();
      material.dispose();
    };
  }, [gl, scene]);

  return null;
}

/* ---------------------------------------------------------------- city */

function City({ progressRef }: { progressRef: ProgressRef }) {
  const towersRef = useRef<THREE.InstancedMesh>(null);
  const windowsRef = useRef<THREE.InstancedMesh>(null);
  const mountainsRef = useRef<THREE.InstancedMesh>(null);

  const layout = useMemo(() => {
    const rand = mulberry32(1987);
    const towers: THREE.Matrix4[] = [];
    const tints: THREE.Color[] = [];
    const lights: THREE.Matrix4[] = [];
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();

    for (let n = 0; n < 420 && towers.length < 230; n++) {
      const a = rand() * Math.PI * 2;
      const dist = 58 + Math.pow(rand(), 0.8) * 165;
      const x = Math.sin(a) * dist;
      const z = -Math.cos(a) * dist;
      // Keep the foreground between the camera and the site clear.
      if (z > -8 && dist < 120) continue;
      const w = 3 + rand() * 6;
      const dp = 3 + rand() * 6;
      let h = dist < 95 ? 3 + rand() * 7 : 6 + Math.pow(rand(), 2) * 30;
      // Towers in front of the setting sun stay below it.
      const off = Math.abs(Math.atan2(Math.sin(Math.atan2(z, x) - SUN_AZIMUTH), Math.cos(Math.atan2(z, x) - SUN_AZIMUTH)));
      if (off < 0.26) h = Math.min(h, dist * 0.04);
      towers.push(new THREE.Matrix4().compose(new THREE.Vector3(x, h / 2, z), q, new THREE.Vector3(w, h, dp)));
      tints.push(new THREE.Color().setHSL(0.02 + rand() * 0.05, 0.12, 0.17 + rand() * 0.06));

      // Lit windows on the face that looks back toward the site.
      if (dist > 160) continue;
      const faceZ = z < 0 ? z + dp / 2 + 0.05 : z - dp / 2 - 0.05;
      const cols = Math.max(1, Math.floor(w / 1.3));
      const rows = Math.max(1, Math.floor(h / 1.9));
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (rand() > 0.22) continue;
          const lx = x - w / 2 + (c + 0.5) * (w / cols);
          const ly = 1 + r * 1.9;
          if (ly > h - 0.6) continue;
          m.compose(new THREE.Vector3(lx, ly, faceZ), q, new THREE.Vector3(0.42, 0.58, 0.08));
          lights.push(m.clone());
          if (lights.length > 1400) break;
        }
      }
    }

    // Distant volcano silhouettes (Agua, Fuego, Acatenango) in the haze.
    const mountains: THREE.Matrix4[] = [];
    for (const [offset, dist, h, r] of [
      [-0.62, 420, 58, 330],
      [-0.3, 470, 50, 300],
      [0.42, 440, 44, 280],
    ] as const) {
      const a = SUN_AZIMUTH + offset;
      mountains.push(
        new THREE.Matrix4().compose(
          new THREE.Vector3(Math.cos(a) * dist, h / 2 - 3, Math.sin(a) * dist),
          new THREE.Quaternion(),
          new THREE.Vector3(r, h, r),
        ),
      );
    }
    return { towers, tints, lights, mountains };
  }, []);

  const windowMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffb46a"), toneMapped: false }),
    [],
  );

  useLayoutEffect(() => {
    const towers = towersRef.current;
    const windows = windowsRef.current;
    const mountains = mountainsRef.current;
    if (!towers || !windows || !mountains) return;
    layout.towers.forEach((mat, i) => {
      towers.setMatrixAt(i, mat);
      const tint = layout.tints[i];
      if (tint) towers.setColorAt(i, tint);
    });
    towers.instanceMatrix.needsUpdate = true;
    if (towers.instanceColor) towers.instanceColor.needsUpdate = true;
    layout.lights.forEach((mat, i) => windows.setMatrixAt(i, mat));
    windows.instanceMatrix.needsUpdate = true;
    layout.mountains.forEach((mat, i) => mountains.setMatrixAt(i, mat));
    mountains.instanceMatrix.needsUpdate = true;
  }, [layout]);

  useFrame(() => {
    const glow = 0.06 + 2.6 * easeInOutCubic(range(progressRef.current.value, 0.45, 0.95));
    windowMaterial.color.setRGB(1 * glow, 0.62 * glow, 0.3 * glow);
  });

  return (
    <group>
      <instancedMesh
        ref={towersRef}
        args={[undefined, undefined, layout.towers.length]}
        frustumCulled={false}
      >
        <boxGeometry />
        <meshStandardMaterial color="#ffffff" roughness={0.95} metalness={0.05} />
      </instancedMesh>
      <instancedMesh
        ref={windowsRef}
        args={[undefined, windowMaterial, layout.lights.length]}
        frustumCulled={false}
      >
        <boxGeometry />
      </instancedMesh>
      <instancedMesh
        ref={mountainsRef}
        args={[undefined, undefined, layout.mountains.length]}
        frustumCulled={false}
      >
        <cylinderGeometry args={[0.035, 0.5, 1, 40, 1, true]} />
        <meshBasicMaterial color="#b0705a" fog={false} />
      </instancedMesh>
    </group>
  );
}

/* ---------------------------------------------------------------- building */

function makeFacadeTextures(cols: number, seed: number) {
  const rand = mulberry32(seed);
  const cw = 28;
  const w = cols * cw;
  const h = 72;
  const glass = document.createElement("canvas");
  const glow = document.createElement("canvas");
  glass.width = glow.width = w;
  glass.height = glow.height = h;
  const g = glass.getContext("2d");
  const e = glow.getContext("2d");
  if (!g || !e) return null;

  const grad = g.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#3a4656");
  grad.addColorStop(1, "#1d2530");
  g.fillStyle = grad;
  g.fillRect(0, 0, w, h);
  e.fillStyle = "#000";
  e.fillRect(0, 0, w, h);

  for (let c = 0; c < cols; c++) {
    const x = c * cw;
    if (rand() < 0.74) {
      const warm = 30 + rand() * 14;
      const light = 52 + rand() * 22;
      e.fillStyle = `hsl(${warm}, 85%, ${light}%)`;
      // Some rooms have the blinds half down.
      const top = rand() < 0.3 ? h * (0.15 + rand() * 0.4) : 3;
      e.fillRect(x + 2, top, cw - 4, h - top - 3);
    }
  }
  // Mullions and transom.
  for (const ctx of [g, e]) {
    ctx.fillStyle = ctx === g ? "#0e0f12" : "#000";
    for (let c = 0; c <= cols; c++) ctx.fillRect(c * cw - 1.5, 0, 3, h);
    ctx.fillRect(0, h * 0.72, w, 3);
    ctx.fillRect(0, 0, w, 3);
    ctx.fillRect(0, h - 3, w, 3);
  }

  const map = new THREE.CanvasTexture(glass);
  const emissiveMap = new THREE.CanvasTexture(glow);
  map.colorSpace = emissiveMap.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = emissiveMap.anisotropy = 4;
  return { map, emissiveMap };
}

function useSharedAssets() {
  const assets = useMemo(() => {
    const column = new THREE.BoxGeometry(COL_W, 1, COL_W).translate(0, 0.5, 0);
    const rebar = new THREE.CylinderGeometry(0.018, 0.018, 1, 5).translate(0, 0.5, 0);
    const shore = new THREE.CylinderGeometry(0.035, 0.035, 1, 6).translate(0, 0.5, 0);
    const slab = new THREE.BoxGeometry(SLAB_X, SLAB_T, SLAB_Z);
    const facade = new THREE.BoxGeometry(FACADE_X, FLOOR_H - SLAB_T, FACADE_Z).translate(
      0,
      (FLOOR_H - SLAB_T) / 2,
      0,
    );
    const unit = new THREE.BoxGeometry(1, 1, 1);

    return {
      geo: { column, rebar, shore, slab, facade, unit },
      mat: {
        concrete: new THREE.MeshStandardMaterial({ color: "#b3aca2", roughness: 0.92 }),
        slab: new THREE.MeshStandardMaterial({ color: "#bdb6ab", roughness: 0.9 }),
        steel: new THREE.MeshStandardMaterial({ color: "#3d352f", roughness: 0.5, metalness: 0.7 }),
        rail: new THREE.MeshStandardMaterial({ color: "#c9a373", roughness: 0.5, metalness: 0.3 }),
      },
    };
  }, []);

  useEffect(
    () => () => {
      Object.values(assets.geo).forEach((g) => g.dispose());
      Object.values(assets.mat).forEach((m) => m.dispose());
    },
    [assets],
  );

  return assets;
}

type Assets = ReturnType<typeof useSharedAssets>;

function Level({ index, progressRef, assets }: { index: number; progressRef: ProgressRef; assets: Assets }) {
  const baseY = index * FLOOR_H;
  const columnsRef = useRef<THREE.InstancedMesh>(null);
  const rebarGroupRef = useRef<THREE.Group>(null);
  const rebarRef = useRef<THREE.InstancedMesh>(null);
  const shoresRef = useRef<THREE.InstancedMesh>(null);
  const slabRef = useRef<THREE.Mesh>(null);
  const railRef = useRef<THREE.Group>(null);
  const facadeRef = useRef<THREE.Mesh>(null);
  const lastColumnPhase = useRef(-1);

  const slabMaterial = useMemo(() => assets.mat.slab.clone(), [assets]);

  const facadeMaterials = useMemo(() => {
    const front = makeFacadeTextures(10, 101 + index * 17);
    const side = makeFacadeTextures(7, 303 + index * 23);
    const make = (tex: ReturnType<typeof makeFacadeTextures>) =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        map: tex?.map ?? null,
        emissive: new THREE.Color("#ffffff"),
        emissiveMap: tex?.emissiveMap ?? null,
        emissiveIntensity: 0,
        metalness: 0.6,
        roughness: 0.16,
        envMapIntensity: 1.4,
      });
    const cap = new THREE.MeshStandardMaterial({ color: "#2a2724", roughness: 0.9 });
    const sideMat = make(side);
    const frontMat = make(front);
    return [sideMat, sideMat, cap, cap, frontMat, frontMat];
  }, [index]);

  useEffect(
    () => () => {
      slabMaterial.dispose();
      new Set(facadeMaterials).forEach((m) => {
        m.map?.dispose();
        m.emissiveMap?.dispose();
        m.dispose();
      });
    },
    [slabMaterial, facadeMaterials],
  );

  useLayoutEffect(() => {
    const rebar = rebarRef.current;
    const shores = shoresRef.current;
    if (!rebar || !shores) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    let k = 0;
    for (const col of COLUMNS) {
      for (const [ox, oz] of REBAR) {
        m.compose(new THREE.Vector3(col.x + ox, 0, col.z + oz), q, new THREE.Vector3(1, FLOOR_H + 0.7, 1));
        rebar.setMatrixAt(k++, m);
      }
    }
    rebar.instanceMatrix.needsUpdate = true;
    SHORES.forEach(([x, z], i) => {
      m.compose(new THREE.Vector3(x, SLAB_T, z), q, new THREE.Vector3(1, FLOOR_H - SLAB_T - 0.14, 1));
      shores.setMatrixAt(i, m);
    });
    shores.instanceMatrix.needsUpdate = true;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const p = progressRef.current.value;
    const sv = structureValue(p);
    const lt = floorPhase(sv, index);
    const nextLt = index + 1 < FLOORS ? floorPhase(sv, index + 1) : 0;
    const ft = easeInOutCubic(floorPhase(facadeValue(p), index, 1.4));
    const gt = floorPhase(lightsValue(p), index, 2.2);

    // Rebar cages rise first; the top floor's stubs go once the curtain wall starts.
    const rebarGroup = rebarGroupRef.current;
    if (rebarGroup) {
      const r = easeOutCubic(range(lt, 0, 0.22)) * (index === FLOORS - 1 ? 1 - range(ft, 0, 0.4) : 1);
      rebarGroup.visible = r > 0.001;
      rebarGroup.scale.y = Math.max(r, 0.0001);
    }

    // Columns poured in a sweep across the plan.
    const columns = columnsRef.current;
    if (columns && Math.abs(lt - lastColumnPhase.current) > 1e-4) {
      lastColumnPhase.current = lt;
      COLUMNS.forEach((col, k) => {
        const start = 0.12 + col.delay * 0.22;
        const t = easeOutCubic(range(lt, start, start + 0.18));
        dummy.position.set(col.x, 0, col.z);
        dummy.scale.set(t > 0 ? 1 : 0.0001, Math.max(t * FLOOR_H, 0.0001), t > 0 ? 1 : 0.0001);
        dummy.updateMatrix();
        columns.setMatrixAt(k, dummy.matrix);
      });
      columns.instanceMatrix.needsUpdate = true;
    }

    // Shores and formwork go up before the pour and come out once the next floor is rising.
    const formT = easeOutCubic(range(lt, 0.36, 0.5)) * (1 - range(nextLt, 0.2, 0.45)) * (1 - range(ft, 0, 0.3));
    const shores = shoresRef.current;
    if (shores) {
      shores.visible = formT > 0.001;
      shores.scale.y = Math.max(formT, 0.0001);
    }

    // The crane lowers the slab into place.
    const slab = slabRef.current;
    if (slab) {
      const drop = slabDrop(p, index);
      slab.visible = drop > 0;
      slab.position.y = baseY + FLOOR_H + SLAB_T / 2 + (1 - easeOutCubic(drop)) * 6;
      const opacity = range(drop, 0, 0.15);
      const transparent = opacity < 0.999;
      if (slabMaterial.transparent !== transparent) {
        slabMaterial.transparent = transparent;
        slabMaterial.needsUpdate = true;
      }
      slabMaterial.opacity = opacity;
    }

    // Edge protection goes on after the pour and comes off when the glass arrives.
    const rail = railRef.current;
    if (rail) {
      const r = range(lt, 0.84, 1) * (1 - range(ft, 0.15, 0.45));
      rail.visible = r > 0.001;
      rail.scale.y = Math.max(r, 0.0001);
    }

    const facade = facadeRef.current;
    if (facade) {
      facade.visible = ft > 0.001;
      facade.scale.y = Math.max(ft, 0.0001);
      const glow = gt * 2.4;
      const front = facadeMaterials[4];
      const side = facadeMaterials[0];
      if (front) front.emissiveIntensity = glow;
      if (side) side.emissiveIntensity = glow;
    }
  });

  const { geo, mat } = assets;
  const railY = 0.95;

  return (
    <group>
      <group ref={rebarGroupRef} position={[0, baseY, 0]}>
        <instancedMesh
          ref={rebarRef}
          args={[geo.rebar, mat.steel, COLUMNS.length * REBAR.length]}
          frustumCulled={false}
          castShadow
        />
      </group>

      <instancedMesh
        ref={columnsRef}
        args={[geo.column, mat.concrete, COLUMNS.length]}
        position={[0, baseY, 0]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />

      <instancedMesh
        ref={shoresRef}
        args={[geo.shore, mat.steel, SHORES.length]}
        position={[0, baseY, 0]}
        frustumCulled={false}
        castShadow
      />

      <mesh ref={slabRef} geometry={geo.slab} material={slabMaterial} castShadow receiveShadow />

      <group ref={railRef} position={[0, baseY + FLOOR_H + SLAB_T, 0]}>
        {[-1, 1].map((s) => (
          <mesh
            key={`x${s}`}
            geometry={geo.unit}
            material={mat.rail}
            position={[0, railY, (s * SLAB_Z) / 2]}
            scale={[SLAB_X, 0.05, 0.05]}
          />
        ))}
        {[-1, 1].map((s) => (
          <mesh
            key={`z${s}`}
            geometry={geo.unit}
            material={mat.rail}
            position={[(s * SLAB_X) / 2, railY, 0]}
            scale={[0.05, 0.05, SLAB_Z]}
          />
        ))}
        {[-SLAB_X / 2, -SLAB_X / 6, SLAB_X / 6, SLAB_X / 2].map((x) => (
          <mesh
            key={`p${x}`}
            geometry={geo.unit}
            material={mat.rail}
            position={[x, railY / 2, SLAB_Z / 2]}
            scale={[0.05, railY, 0.05]}
          />
        ))}
      </group>

      <mesh
        ref={facadeRef}
        geometry={geo.facade}
        material={facadeMaterials}
        position={[0, baseY + (index === 0 ? 0.02 : SLAB_T), 0]}
        castShadow
      />
    </group>
  );
}

function RoofCrown({ progressRef }: { progressRef: ProgressRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const glowMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: new THREE.Color("#cfc0a4"), toneMapped: false }),
    [],
  );
  const parapet = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#2b2825", roughness: 0.8, metalness: 0.2 }),
    [],
  );

  useFrame(() => {
    const p = progressRef.current.value;
    const up = range(floorPhase(facadeValue(p), FLOORS - 1, 1.4), 0.4, 1);
    const group = groupRef.current;
    if (group) {
      group.visible = up > 0.001;
      group.scale.y = Math.max(easeOutCubic(up), 0.0001);
    }
    const g = 0.4 + 3.2 * easeInOutCubic(range(lightsValue(p), 0.55, 1));
    glowMaterial.color.setRGB(0.79 * g, 0.66 * g, 0.38 * g);
  });

  const y = TOP + SLAB_T;
  const h = 0.55;
  return (
    <group ref={groupRef} position={[0, y, 0]}>
      {[
        { pos: [0, h / 2, SLAB_Z / 2] as const, scale: [SLAB_X, h, 0.12] as const },
        { pos: [0, h / 2, -SLAB_Z / 2] as const, scale: [SLAB_X, h, 0.12] as const },
        { pos: [SLAB_X / 2, h / 2, 0] as const, scale: [0.12, h, SLAB_Z] as const },
        { pos: [-SLAB_X / 2, h / 2, 0] as const, scale: [0.12, h, SLAB_Z] as const },
      ].map(({ pos, scale }, i) => (
        <group key={i}>
          <mesh position={[...pos]} scale={[...scale]} material={parapet} castShadow>
            <boxGeometry />
          </mesh>
          <mesh
            position={[pos[0], h + 0.03, pos[2]]}
            scale={[scale[0] + 0.02, 0.06, scale[2] + 0.02]}
            material={glowMaterial}
          >
            <boxGeometry />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------------------------------------------------------------- crane */

const MAST_POS = new THREE.Vector3(PLAN_X / 2 + 3.4, 0, -PLAN_Z / 2 - 2.6);
const MAST_H = TOP + 5.5;
const JIB_ANGLE = Math.atan2(MAST_POS.z, -MAST_POS.x); // local +x toward the building centre
const TROLLEY_X = Math.hypot(MAST_POS.x, MAST_POS.z);

function latticeMatrices() {
  const members: THREE.Matrix4[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  const add = (a: THREE.Vector3, b: THREE.Vector3, thick: number, frame?: THREE.Matrix4) => {
    const from = frame ? a.clone().applyMatrix4(frame) : a;
    const to = frame ? b.clone().applyMatrix4(frame) : b;
    const dir = to.clone().sub(from);
    const len = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(up, dir.normalize());
    members.push(
      new THREE.Matrix4().compose(from.clone().add(to).multiplyScalar(0.5), q, new THREE.Vector3(thick, len, thick)),
    );
  };
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

  // Mast: square lattice tower.
  const s = 0.3;
  const seg = 1;
  const segs = Math.ceil(MAST_H / seg);
  const corners = [V(-s, 0, -s), V(s, 0, -s), V(s, 0, s), V(-s, 0, s)];
  corners.forEach((c) => add(c, V(c.x, MAST_H, c.z), 0.07));
  for (let k = 0; k < segs; k++) {
    const y0 = k * seg;
    const y1 = Math.min(MAST_H, y0 + seg);
    for (let f = 0; f < 4; f++) {
      const a = corners[f]!;
      const b = corners[(f + 1) % 4]!;
      add(V(a.x, y1, a.z), V(b.x, y1, b.z), 0.04);
      if (k % 2 === 0) add(V(a.x, y0, a.z), V(b.x, y1, b.z), 0.03);
      else add(V(b.x, y0, b.z), V(a.x, y1, a.z), 0.03);
    }
  }

  // Jib, counter-jib and cat head, built in the jib's rotating frame.
  const frame = new THREE.Matrix4().compose(
    V(0, MAST_H, 0),
    new THREE.Quaternion().setFromAxisAngle(up, JIB_ANGLE),
    V(1, 1, 1),
  );
  const front = TROLLEY_X + 3;
  const back = -5;
  const w = 0.28;
  const top = 0.6;
  add(V(back, 0, -w), V(front, 0, -w), 0.06, frame);
  add(V(back, 0, w), V(front, 0, w), 0.06, frame);
  add(V(back, top, 0), V(front - 1, top * 0.35, 0), 0.05, frame);
  for (let x = back; x < front - 0.9; x += 0.9) {
    add(V(x, 0, -w), V(x + 0.9, top * 0.8, 0), 0.025, frame);
    add(V(x, 0, w), V(x + 0.9, top * 0.8, 0), 0.025, frame);
    add(V(x, 0, -w), V(x, 0, w), 0.025, frame);
  }
  add(V(-s, 0, 0), V(0, 3, 0), 0.06, frame);
  add(V(s, 0, 0), V(0, 3, 0), 0.06, frame);
  add(V(0, 3, 0), V(front * 0.62, top, 0), 0.025, frame);
  add(V(0, 3, 0), V(back, top, 0), 0.025, frame);

  return members;
}

function Crane({ progressRef }: { progressRef: ProgressRef }) {
  const latticeRef = useRef<THREE.InstancedMesh>(null);
  const hookRef = useRef<THREE.Group>(null);
  const cableRef = useRef<THREE.Mesh>(null);
  const members = useMemo(latticeMatrices, []);
  const hookY = useRef(MAST_H - 4);

  useLayoutEffect(() => {
    const lattice = latticeRef.current;
    if (!lattice) return;
    members.forEach((m, i) => lattice.setMatrixAt(i, m));
    lattice.instanceMatrix.needsUpdate = true;
  }, [members]);

  useFrame((_, dt) => {
    const p = progressRef.current.value;
    // Follow whichever slab is currently being lowered.
    let target = MAST_H - 4;
    for (let i = FLOORS - 1; i >= 0; i--) {
      const drop = slabDrop(p, i);
      if (drop > 0 && drop < 1) {
        target = i * FLOOR_H + FLOOR_H + SLAB_T / 2 + (1 - easeOutCubic(drop)) * 6 + 0.35;
        break;
      }
    }
    hookY.current += (target - hookY.current) * (1 - Math.exp(-dt * 6));
    const drop = MAST_H - hookY.current;
    const hook = hookRef.current;
    if (hook) hook.position.y = -drop;
    const cable = cableRef.current;
    if (cable) {
      cable.scale.y = Math.max(drop - 0.2, 0.01);
      cable.position.y = -(drop - 0.2) / 2;
    }
  });

  return (
    <group position={MAST_POS}>
      <instancedMesh ref={latticeRef} args={[undefined, undefined, members.length]} frustumCulled={false} castShadow>
        <boxGeometry />
        <meshStandardMaterial color="#a98b62" roughness={0.55} metalness={0.35} />
      </instancedMesh>

      <group position={[0, MAST_H, 0]} rotation={[0, JIB_ANGLE, 0]}>
        {/* counterweight and operator cab */}
        <mesh position={[-4.2, -0.35, 0]} castShadow>
          <boxGeometry args={[1.3, 0.9, 0.9]} />
          <meshStandardMaterial color="#3a332d" roughness={0.8} />
        </mesh>
        <mesh position={[0.75, -0.55, 0.45]} castShadow>
          <boxGeometry args={[0.8, 0.75, 0.7]} />
          <meshStandardMaterial color="#d9d2c4" roughness={0.4} metalness={0.2} />
        </mesh>
        <group position={[TROLLEY_X, 0, 0]}>
          <mesh ref={cableRef}>
            <cylinderGeometry args={[0.012, 0.012, 1, 5]} />
            <meshStandardMaterial color="#1c1a18" roughness={0.5} metalness={0.6} />
          </mesh>
          <group ref={hookRef}>
            <mesh castShadow>
              <boxGeometry args={[0.28, 0.4, 0.2]} />
              <meshStandardMaterial color="#e0a431" roughness={0.5} metalness={0.3} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

/* ---------------------------------------------------------------- site */

function Site() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1200, 48]} />
        <meshStandardMaterial color="#3a2f2a" roughness={1} />
      </mesh>
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[SLAB_X + 5, 0.04, SLAB_Z + 5]} />
        <meshStandardMaterial color="#6a6158" roughness={0.95} />
      </mesh>
      {/* site office containers */}
      <mesh position={[PLAN_X / 2 + 7, 0.65, -PLAN_Z / 2 - 5.5]} rotation={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 1.3, 1.3]} />
        <meshStandardMaterial color="#8a6a34" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[PLAN_X / 2 + 7.3, 1.95, -PLAN_Z / 2 - 5.7]} rotation={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[3, 1.3, 1.3]} />
        <meshStandardMaterial color="#d9d2c4" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* material stacks */}
      {[
        [PLAN_X / 2 + 2.6, 2.2],
        [PLAN_X / 2 + 3.4, 3.4],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x!, 0.25, z!]} rotation={[0, i * 0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.5, 1]} />
          <meshStandardMaterial color="#9a938a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const { geometry, base } = useMemo(() => {
    const rand = mulberry32(7);
    const count = 420;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 34;
      positions[i * 3 + 1] = rand() * 20;
      positions[i * 3 + 2] = (rand() - 0.5) * 34;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry: g, base: positions.slice() };
  }, []);

  const material = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 32;
    const ctx = c.getContext("2d");
    if (ctx) {
      const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 32, 32);
    }
    return new THREE.PointsMaterial({
      size: 0.09,
      map: new THREE.CanvasTexture(c),
      color: new THREE.Color("#ffd29a"),
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      arr[i] = base[i]! + Math.sin(t * 0.13 + i) * 0.6;
      arr[i + 1] = (base[i + 1]! + t * 0.12) % 20;
      arr[i + 2] = base[i + 2]! + Math.cos(t * 0.11 + i * 0.7) * 0.6;
    }
    attr.needsUpdate = true;
  });

  return <points ref={ref} geometry={geometry} material={material} frustumCulled={false} />;
}

/* ---------------------------------------------------------------- lights & camera */

function Lighting({ progressRef, shadows }: { progressRef: ProgressRef; shadows: boolean }) {
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    const sun = sunRef.current;
    if (!sun) return;
    target.position.set(0, 5, 0);
    sun.target = target;
    const cam = sun.shadow.camera;
    cam.left = -26;
    cam.right = 26;
    cam.top = 26;
    cam.bottom = -26;
    cam.near = 1;
    cam.far = 220;
    cam.updateProjectionMatrix();
  }, [target]);

  useFrame(() => {
    const sun = sunRef.current;
    if (!sun) return;
    sun.intensity = 3.4 - 1.6 * range(progressRef.current.value, 0.4, 1);
  });

  return (
    <>
      <primitive object={target} />
      <directionalLight
        ref={sunRef}
        position={SUN_DIR.clone().multiplyScalar(90).add(new THREE.Vector3(0, 5, 0))}
        color="#ffab66"
        intensity={3.4}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
      <hemisphereLight args={["#9fb1d6", "#3a2a22", 0.55]} />
      <directionalLight position={[-40, 25, 45]} color="#8ea6d4" intensity={0.45} />
    </>
  );
}

function CameraRig({ progressRef, onReady }: { progressRef: ProgressRef; onReady?: (() => void) | undefined }) {
  const { camera, size } = useThree();
  const look = useMemo(() => new THREE.Vector3(0, 3, 0), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  const posTarget = useMemo(() => new THREE.Vector3(), []);
  const pointer = useRef({ x: 0, y: 0 });
  const startedAt = useRef<number | null>(null);
  const readyFired = useRef(false);
  const lastSize = useRef("");

  useFrame((state, dt) => {
    const cam = camera as THREE.PerspectiveCamera;
    const portrait = size.width / size.height < 0.9;

    // Frame the tower off-centre: right of the headline on wide screens, above it on tall ones.
    const key = `${size.width}x${size.height}`;
    if (key !== lastSize.current) {
      lastSize.current = key;
      const fullW = portrait ? size.width : size.width * 1.5;
      const fullH = portrait ? size.height * 1.62 : size.height;
      cam.fov = portrait ? 50 : 36;
      cam.aspect = fullW / fullH;
      cam.setViewOffset(fullW, fullH, 0, portrait ? size.height * 0.56 : 0, size.width, size.height);
      cam.updateProjectionMatrix();
    }

    if (startedAt.current === null) startedAt.current = state.clock.elapsedTime;
    const intro = easeOutCubic(clamp01((state.clock.elapsedTime - startedAt.current) / 3.2));
    const p = progressRef.current.value;
    const cp = easeInOutCubic(p);

    pointer.current.x += (state.pointer.x - pointer.current.x) * (1 - Math.exp(-dt * 2));
    pointer.current.y += (state.pointer.y - pointer.current.y) * (1 - Math.exp(-dt * 2));

    const built = Math.min(TOP, structureValue(p) * TOP);
    const settle = range(p, 0.78, 1);
    const orbit = -0.62 + 0.2 * cp + (1 - intro) * -0.1 + pointer.current.x * 0.03;
    const radius = (18 + built * 1.2 + 3 * settle + (1 - intro) * 8) * (portrait ? 2.75 : 1);
    const height = 1.2 + built * 0.5 + 2 * settle + pointer.current.y * 0.4;

    posTarget.set(Math.sin(orbit) * radius, height, Math.cos(orbit) * radius);
    lookTarget.set(0, 1.5 + built * 0.5, 0);

    const k = 1 - Math.exp(-dt * 3.5);
    camera.position.lerp(posTarget, readyFired.current ? k : 1);
    look.lerp(lookTarget, readyFired.current ? k : 1);
    camera.lookAt(look);

    if (!readyFired.current) {
      readyFired.current = true;
      onReady?.();
    }
  });

  return null;
}

/* ---------------------------------------------------------------- canvas */

export default function BuildingScene({
  progressRef,
  active = true,
  onReady,
}: {
  progressRef: ProgressRef;
  active?: boolean | undefined;
  onReady?: (() => void) | undefined;
}) {
  const coarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, coarse ? 1.5 : 1.75]}
      shadows={!coarse}
      camera={{ fov: 36, near: 0.5, far: 2000, position: [-18, 2, 26] }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#2a1d1b"]} />
      <fogExp2 attach="fog" args={[HAZE, 0.0058]} />

      <SkyEnvironment />
      <Sky progressRef={progressRef} />
      <Lighting progressRef={progressRef} shadows={!coarse} />
      <CameraRig progressRef={progressRef} onReady={onReady} />

      <City progressRef={progressRef} />
      <Site />
      <Building progressRef={progressRef} />
      <Crane progressRef={progressRef} />
      <Dust />

      <EffectComposer multisampling={coarse ? 0 : 4}>
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.92} luminanceSmoothing={0.25} radius={0.72} />
        <Vignette offset={0.28} darkness={0.6} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </Canvas>
  );
}

function Building({ progressRef }: { progressRef: ProgressRef }) {
  const assets = useSharedAssets();
  return (
    <group>
      {Array.from({ length: FLOORS }, (_, i) => (
        <Level key={i} index={i} progressRef={progressRef} assets={assets} />
      ))}
      <RoofCrown progressRef={progressRef} />
    </group>
  );
}
