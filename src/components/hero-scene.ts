import {
  ACESFilmicToneMapping,
  BufferGeometry,
  CanvasTexture,
  CylinderGeometry,
  DirectionalLight,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NoColorSpace,
  Object3D,
  OrthographicCamera,
  PlaneGeometry,
  PMREMGenerator,
  RepeatWrapping,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

function createKeycap() {
  const sections = [
    [0.56, 3.39, 2.48, 0.31],
    [0.59, 3.49, 2.58, 0.34],
    [0.65, 3.53, 2.62, 0.36],
    [0.73, 3.50, 2.60, 0.36],
    [1.26, 3.18, 2.28, 0.31],
    [1.37, 3.07, 2.18, 0.30],
    [1.43, 2.97, 2.08, 0.27],
    [1.46, 2.87, 1.98, 0.24],
    [1.45, 2.75, 1.86, 0.23],
    [1.425, 2.59, 1.71, 0.21],
  ];
  const pointsPerCorner = 9;
  const pointsPerRing = 4 * pointsPerCorner;
  const positions: number[] = [];
  const faces: number[] = [];

  sections.forEach(([y, width, depth, radius], ring) => {
    for (let corner = 0; corner < 4; corner += 1) {
      const middle = Math.PI * (0.5 * corner + 0.25);
      const centerX = Math.sign(Math.cos(middle)) * (width / 2 - radius);
      const centerZ = Math.sign(Math.sin(middle)) * (depth / 2 - radius);
      for (let point = 0; point < pointsPerCorner; point += 1) {
        const angle = Math.PI * (corner + point / (pointsPerCorner - 1)) / 2;
        positions.push(centerX + Math.cos(angle) * radius, y, centerZ + Math.sin(angle) * radius);
      }
    }

    if (ring === 0) return;
    for (let point = 0; point < pointsPerRing; point += 1) {
      const lower = (ring - 1) * pointsPerRing + point;
      const next = (ring - 1) * pointsPerRing + (point + 1) % pointsPerRing;
      faces.push(lower, lower + pointsPerRing, next, next, lower + pointsPerRing, next + pointsPerRing);
    }
  });

  const top = (sections.length - 1) * pointsPerRing;
  const topCenter = sections.length * pointsPerRing;
  const bottomCenter = topCenter + 1;
  positions.push(0, 1.425, 0, 0, 0.56, 0);
  for (let point = 0; point < pointsPerRing; point += 1) {
    const next = (point + 1) % pointsPerRing;
    faces.push(topCenter, top + next, top + point, bottomCenter, point, next);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  const uv = [];
  for (let index = 0; index < positions.length; index += 3) {
    uv.push(positions[index] / 3.54 + 0.5, positions[index + 2] / 2.64 + 0.5);
  }
  geometry.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  geometry.setIndex(faces);
  geometry.computeVertexNormals();
  return geometry;
}

function makeTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not draw the model details");
  draw(ctx);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function drawLegend(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#fff0d7";
  ctx.font = '600 125px "Segoe UI", sans-serif';
  ctx.fillText("enter", 48, 185);
  ctx.strokeStyle = "#fff0d7";
  ctx.lineWidth = 17;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(704, 95);
  ctx.lineTo(704, 205);
  ctx.lineTo(541, 205);
  ctx.moveTo(581, 162);
  ctx.lineTo(541, 205);
  ctx.lineTo(581, 246);
  ctx.stroke();
}

function drawShadow(ctx: CanvasRenderingContext2D) {
  const shadow = ctx.createRadialGradient(128, 128, 27, 128, 128, 127);
  shadow.addColorStop(0, "rgba(0,0,0,0.95)");
  shadow.addColorStop(0.46, "rgba(0,0,0,0.68)");
  shadow.addColorStop(0.74, "rgba(0,0,0,0.27)");
  shadow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = shadow;
  ctx.fillRect(0, 0, 256, 256);
}

function drawGrain(ctx: CanvasRenderingContext2D) {
  const image = ctx.createImageData(128, 128);
  let seed = 7249;
  for (let pixel = 0; pixel < 128 * 128; pixel += 1) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const row = Math.floor(pixel / 128);
    const value = 110 + 15 * Math.sin(row * 1.4) + (seed >>> 27);
    image.data.set([value, value, value, 255], pixel * 4);
  }
  ctx.putImageData(image, 0, 0);
}

function drawTraces(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "#ce9a626b";
  ctx.lineWidth = 1.7;
  for (const side of [-1, 1]) {
    for (let pin = 0; pin < 14; pin += 1) {
      const x = 96 + pin * 24.6;
      const y = 192 + side * 174.8;
      const bend = y - side * (11 + (pin % 3) * 4);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, bend);
      ctx.lineTo(x + 14, bend - side * 11);
      ctx.lineTo(x + 14, bend - side * 27);
      ctx.stroke();
    }
  }
}

function buildEnterKey() {
  const model = new Group();
  const darkMetal = new MeshStandardMaterial({ color: "#292d31", metalness: 0.78, roughness: 0.33 });
  const shell = new MeshStandardMaterial({ color: "#404244", metalness: 0.85, roughness: 0.34 });
  const copper = new MeshStandardMaterial({ color: "#c07146", metalness: 0.84, roughness: 0.33 });
  const board = new MeshStandardMaterial({ color: "#243331", metalness: 0.38, roughness: 0.48 });
  const hardware = new MeshStandardMaterial({ color: "#9a8570", metalness: 0.76, roughness: 0.29 });
  const recess = new MeshStandardMaterial({ color: "#101415", metalness: 0.45, roughness: 0.56 });
  const amber = new MeshPhysicalMaterial({
    color: "#513a26",
    metalness: 0.35,
    roughness: 0.3,
    clearcoat: 0.7,
    clearcoatRoughness: 0.26,
  });
  const grain = makeTexture(128, 128, drawGrain);
  grain.colorSpace = NoColorSpace;
  grain.wrapS = RepeatWrapping;
  grain.wrapT = RepeatWrapping;
  grain.repeat.set(3, 3);
  const keyFinish = new MeshPhysicalMaterial({
    color: "#a13e24",
    metalness: 0.66,
    roughness: 0.38,
    clearcoat: 0.32,
    clearcoatRoughness: 0.31,
    bumpMap: grain,
    bumpScale: 0.012,
  });
  const light = new MeshStandardMaterial({
    color: "#ff9253",
    emissive: "#ff6a31",
    emissiveIntensity: 2,
    roughness: 0.33,
  });

  function slab(width: number, height: number, depth: number, radius: number, material: MeshStandardMaterial, y: number) {
    const mesh = new Mesh(new RoundedBoxGeometry(width, height, depth, 2, radius), material);
    mesh.position.y = y;
    model.add(mesh);
    return mesh;
  }

  slab(4.28, 0.22, 3.32, 0.10, darkMetal, 0.11);
  slab(4.33, 0.34, 3.37, 0.14, shell, 0.28);
  slab(4.23, 0.065, 3.27, 0.03, copper, 0.432);
  slab(4.08, 0.072, 3.12, 0.035, board, 0.465);
  slab(2.61, 0.13, 1.77, 0.05, amber, 0.561);
  slab(1.95, 0.12, 1.32, 0.055, darkMetal, 0.625);

  const traces = makeTexture(512, 384, drawTraces);
  const circuit = new Mesh(
    new PlaneGeometry(4.08, 3.12),
    new MeshBasicMaterial({ map: traces, transparent: true, depthWrite: false, toneMapped: false }),
  );
  circuit.rotation.x = -Math.PI / 2;
  circuit.position.y = 0.503;
  model.add(circuit);

  const foot = new RoundedBoxGeometry(0.76, 0.10, 0.62, 2, 0.045);
  const screw = new CylinderGeometry(0.118, 0.124, 0.033, 18);
  const socket = new CylinderGeometry(0.055, 0.055, 0.006, 6);
  for (const x of [-1.86, 1.86]) {
    for (const z of [-1.37, 1.37]) {
      const rubber = new Mesh(foot, recess);
      rubber.position.set(x * 0.76, -0.042, z * 0.68);
      const fastener = new Mesh(screw, hardware);
      fastener.position.set(x, 0.512, z);
      const inset = new Mesh(socket, recess);
      inset.position.set(x, 0.53, z);
      model.add(rubber, fastener, inset);
    }
  }

  const contacts = new InstancedMesh(new RoundedBoxGeometry(0.11, 0.012, 0.044, 1, 0.006), copper, 28);
  const transform = new Object3D();
  for (let pin = 0; pin < 28; pin += 1) {
    transform.position.set(-1.27 + (pin % 14) * 0.196, 0.507, pin < 14 ? 1.42 : -1.42);
    transform.updateMatrix();
    contacts.setMatrixAt(pin, transform.matrix);
  }
  model.add(contacts);

  const port = slab(0.56, 0.12, 0.045, 0.020, recess, 0.28);
  port.position.set(0, 0.28, -1.676);
  const indicator = slab(0.25, 0.035, 0.020, 0.01, light, 0.27);
  indicator.position.set(1.43, 0.269, 1.68);

  const cap = new Mesh(createKeycap(), keyFinish);
  cap.position.y = 0.14;
  model.add(cap);
  const legendTexture = makeTexture(768, 288, drawLegend);
  legendTexture.anisotropy = 4;
  const legend = new Mesh(
    new PlaneGeometry(2.35, 0.88),
    new MeshBasicMaterial({ map: legendTexture, transparent: true, depthWrite: false, toneMapped: false }),
  );
  legend.rotation.x = -Math.PI / 2;
  legend.position.set(0, 1.568, 0.08);
  model.add(legend);

  return { model, textures: [grain, traces, legendTexture] };
}

export function createHeroScene(canvas: HTMLCanvasElement, context: WebGL2RenderingContext) {
  const renderer = new WebGLRenderer({ canvas, context, alpha: true });
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  const scene = new Scene();
  const camera = new OrthographicCamera(-2.7, 2.7, 2.7, -2.7, 0.1, 30);

  const room = new RoomEnvironment();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, 0.05, 0.1, 100, { size: 128 });
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.95;
  room.dispose();
  pmrem.dispose();

  const keyLight = new DirectionalLight("#fff0da", 2.35);
  keyLight.position.set(-3, 7, 5);
  const rim = new DirectionalLight("#ffac70", 2.4);
  rim.position.set(3, 2, -4);
  const fill = new DirectionalLight("#aabcca", 0.6);
  fill.position.set(5, 2, 5);
  scene.add(keyLight, rim, fill);

  const { model, textures } = buildEnterKey();
  scene.add(model);
  const shadowTexture = makeTexture(256, 256, drawShadow);
  const shadow = new Mesh(
    new PlaneGeometry(6.6, 5.5),
    new MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(-0.12, -0.1, 0.14);
  scene.add(shadow);

  let azimuth = 0.55;
  let elevation = 0.56;
  let pendingFrame = 0;

  function draw() {
    const radius = 8;
    camera.position.set(
      Math.sin(azimuth) * Math.cos(elevation) * radius,
      0.59 + Math.sin(elevation) * radius,
      Math.cos(azimuth) * Math.cos(elevation) * radius,
    );
    camera.lookAt(0, 0.59, 0);
    renderer.render(scene, camera);
  }

  function resize() {
    const { clientWidth: width, clientHeight: height } = canvas;
    if (!width || !height) return;
    const extent = 2.98;
    const aspect = width / height;
    const horizontal = extent * Math.max(aspect, 1);
    const vertical = extent * Math.max(1 / aspect, 1);
    camera.left = -horizontal;
    camera.right = horizontal;
    camera.top = vertical;
    camera.bottom = -vertical;
    camera.updateProjectionMatrix();
    renderer.setDrawingBufferSize(width, height, Math.min(window.devicePixelRatio, 1.5));
    draw();
  }

  resize();
  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(canvas);

  return {
    rotate(dx: number, dy: number) {
      azimuth = (azimuth - dx * 0.012) % (Math.PI * 2);
      elevation = MathUtils.clamp(elevation + dy * 0.009, 0.14, 1.13);
      if (pendingFrame) return;
      pendingFrame = requestAnimationFrame(() => {
        pendingFrame = 0;
        draw();
      });
    },
    dispose() {
      cancelAnimationFrame(pendingFrame);
      sizeObserver.disconnect();
      const resources = new Set<{ dispose(): void }>();
      scene.traverse((object) => {
        if (!(object instanceof Mesh)) return;
        resources.add(object.geometry);
        for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
          resources.add(material);
        }
      });
      for (const resource of resources) resource.dispose();
      for (const texture of textures) texture.dispose();
      shadowTexture.dispose();
      environment.dispose();
      renderer.dispose();
    },
  };
}
