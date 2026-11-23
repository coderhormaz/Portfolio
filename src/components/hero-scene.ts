import {
  ACESFilmicToneMapping,
  BoxGeometry,
  CatmullRomCurve3,
  CanvasTexture,
  CylinderGeometry,
  DirectionalLight,
  Group,
  InstancedMesh,
  LatheGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NoColorSpace,
  Object3D,
  OrthographicCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
  type Matrix4,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

function texture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not draw the workshop details");
  draw(ctx);
  const map = new CanvasTexture(canvas);
  map.colorSpace = SRGBColorSpace;
  return map;
}

function drawWindow(ctx: CanvasRenderingContext2D) {
  const sky = ctx.createLinearGradient(0, 0, 0, 256);
  sky.addColorStop(0, "#121b35");
  sky.addColorStop(0.52, "#394e70");
  sky.addColorStop(0.78, "#836f89");
  sky.addColorStop(1, "#bb8887");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 512, 256);

  const halo = ctx.createRadialGradient(407, 56, 6, 407, 56, 26);
  halo.addColorStop(0, "#f9e6c094");
  halo.addColorStop(1, "#f9e6c000");
  ctx.fillStyle = halo;
  ctx.fillRect(381, 30, 52, 52);
  ctx.fillStyle = "#e7dfcf";
  ctx.beginPath();
  ctx.arc(407, 56, 8, 0, Math.PI * 2);
  ctx.fill();
  for (let star = 0; star < 24; star += 1) {
    ctx.fillStyle = star % 6 === 0 ? "#e4ebf2ac" : "#d5dfed48";
    ctx.fillRect((star * 143 + 19) % 503, (star * 61 + 13) % 126, 1, 1);
  }

  const distances = [
    { color: "#58617a", spacing: 16, base: 234, height: 29 },
    { color: "#373e57", spacing: 23, base: 246, height: 50 },
    { color: "#242c44", spacing: 31, base: 256, height: 65 },
  ];
  distances.forEach(({ color, spacing, base, height }, layer) => {
    for (let tower = 0; tower <= 512 / spacing; tower += 1) {
      const x = tower * spacing + (tower * 7) % 11 - layer * 10;
      const tall = 13 + ((tower * 31 + layer * 13) % height);
      const y = base - tall;
      const width = spacing - 4 - (tower % 4) * 2;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, 256 - y);
      if (tower % 4 === 0 && layer === 2) ctx.fillRect(x + width * 0.45, y - 8, 1, 8);

      for (let floor = y + 6; floor < 255; floor += 6) {
        for (let column = 4; column < width - 2; column += 5) {
          if ((tower * 13 + floor * 7 + column * 3) % 9 > 3) continue;
          ctx.fillStyle = (floor + column) % 5 === 0 ? "#f2caa996" : "#a1b6cf66";
          ctx.fillRect(x + column, floor, 1.5, 2);
        }
      }
    }
  });

  ctx.save();
  ctx.translate(215, 5);
  ctx.transform(1, 0, -0.7, 1, 0, 0);
  ctx.fillStyle = "#e8f5ff0d";
  ctx.fillRect(0, 0, 23, 256);
  ctx.fillRect(30, 0, 6, 256);
  ctx.fillRect(139, 0, 14, 256);
  ctx.restore();
}

function drawMonitor(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#12232e";
  ctx.fillRect(0, 0, 512, 288);
  ctx.fillStyle = "#223946";
  ctx.fillRect(0, 0, 512, 31);
  ctx.fillRect(0, 31, 42, 257);

  ["#fb8f83", "#edbf80", "#8cdaba"].forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(18 + index * 18, 16, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  const lines = [
    ["#dcafef", "export function build() {"],
    ["#92eacb", "  const idea = sketch();"],
    ["#a4c9f6", "  return make(idea);"],
    ["#dcafef", "}"],
  ];
  ctx.font = '20px "Consolas", monospace';
  lines.forEach(([color, text], index) => {
    ctx.fillStyle = "#7895a5";
    ctx.fillText(String(index + 1), 14, 68 + index * 31);
    ctx.fillStyle = color;
    ctx.fillText(text, 60, 68 + index * 31);
  });
  ctx.fillStyle = "#0c1a23";
  ctx.fillRect(42, 209, 470, 79);
  ctx.fillStyle = "#aee9c3";
  ctx.fillText("> npm run build", 62, 247);
}

function drawSketch(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#5e84a6";
  ctx.fillRect(0, 0, 256, 192);
  ctx.strokeStyle = "#aec7dc76";
  ctx.lineWidth = 1;
  for (let step = 16; step < 256; step += 16) {
    ctx.beginPath();
    ctx.moveTo(step, 0);
    ctx.lineTo(step, 192);
    ctx.moveTo(0, step);
    ctx.lineTo(256, step);
    ctx.stroke();
  }
  ctx.strokeStyle = "#eaf4f3";
  ctx.lineWidth = 3;
  ctx.strokeRect(25, 31, 200, 124);
  ctx.strokeRect(39, 54, 65, 86);
  ctx.strokeRect(119, 54, 91, 33);
  ctx.strokeRect(119, 100, 91, 40);
  ctx.beginPath();
  ctx.moveTo(40, 59);
  ctx.lineTo(104, 139);
  ctx.moveTo(104, 59);
  ctx.lineTo(40, 139);
  ctx.stroke();
}

function drawShadow(ctx: CanvasRenderingContext2D) {
  const shade = ctx.createRadialGradient(128, 128, 27, 128, 128, 127);
  shade.addColorStop(0, "rgba(0,0,0,0.84)");
  shade.addColorStop(0.53, "rgba(0,0,0,0.56)");
  shade.addColorStop(0.79, "rgba(0,0,0,0.2)");
  shade.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, 256, 256);
}

function drawWood(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas;
  const image = ctx.createImageData(width, height);
  let seed = 2017;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const bend = Math.sin(y * 0.015 + x * 0.051) * 3 + 1.4 * Math.sin(y * 0.037);
      const grain = x + bend;
      const vein = Math.pow(Math.abs(Math.sin(grain * 0.31 + Math.sin(grain * 0.09))), 8);
      const color = 225 + Math.sin(grain * 0.15) * 10 - vein * 33 + (seed >>> 28) * 0.7;
      const offset = (y * width + x) * 4;
      image.data[offset] = color;
      image.data[offset + 1] = color - 4;
      image.data[offset + 2] = color - 9;
      image.data[offset + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
}

function drawSurfaceGrain(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas;
  const image = ctx.createImageData(width, height);
  let seed = 97127;
  for (let offset = 0; offset < image.data.length; offset += 4) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const gray = 98 + (seed >>> 26);
    image.data[offset] = image.data[offset + 1] = image.data[offset + 2] = gray;
    image.data[offset + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
}

function buildWorkshop() {
  const model = new Group();
  const blocks = new Map<Material, Matrix4[]>();
  const transform = new Object3D();
  const wood = texture(128, 512, drawWood);
  const surfaceGrain = texture(128, 128, drawSurfaceGrain);
  surfaceGrain.colorSpace = NoColorSpace;
  const matte = (name: string, color: string, roughness = 0.72) => new MeshStandardMaterial({ name, color, roughness });
  const base = matte("Plinth", "#232935", 0.45);
  const ink = matte("Graphite", "#202527", 0.53);
  const wall = matte("Blue plaster", "#41546c", 0.87);
  wall.bumpMap = surfaceGrain;
  wall.bumpScale = 0.018;
  const frame = matte("Blackened frame", "#212a32", 0.34);
  frame.metalness = 0.46;
  const oak = matte("Oiled walnut", "#90593a", 0.43);
  const walnut = matte("Dark walnut", "#71432f", 0.47);
  oak.map = walnut.map = wood;
  const paper = matte("Paper and porcelain", "#e5d1b2");
  const clay = matte("Terracotta", "#944d42", 0.61);
  const ceramic = matte("Glazed stoneware", "#2b5659", 0.28);
  const seat = matte("Petrol upholstery", "#277479", 0.90);
  seat.bumpMap = surfaceGrain;
  seat.bumpScale = 0.013;
  const teal = matte("Cloth-bound books", "#496962");
  const green = matte("Forest leaves", "#406348", 0.62);
  const sage = matte("Young leaves", "#6d8554", 0.58);
  const linen = matte("Linen shade", "#d9bd94", 0.69);
  const coffee = matte("Coffee", "#372116", 0.23);
  const brass = new MeshStandardMaterial({ name: "Brushed brass", color: "#c89957", metalness: 0.78, roughness: 0.35 });
  const warmLight = new MeshStandardMaterial({
    name: "Lamp emitter",
    color: "#ffe0b7",
    emissive: "#ffbe75",
    emissiveIntensity: 1.4,
    roughness: 0.36,
  });

  function block(material: Material, x: number, y: number, z: number, width: number, height: number, depth: number, tilt = 0) {
    transform.position.set(x, y, z);
    transform.rotation.set(tilt, 0, 0);
    transform.scale.set(width, height, depth);
    transform.updateMatrix();
    const batch = blocks.get(material);
    if (batch) batch.push(transform.matrix.clone());
    else blocks.set(material, [transform.matrix.clone()]);
  }

  function place(geometry: BufferGeometry, material: Material, x: number, y: number, z: number) {
    const mesh = new Mesh(geometry, material);
    mesh.position.set(x, y, z);
    model.add(mesh);
    return mesh;
  }

  function rounded(material: Material, x: number, y: number, z: number, w: number, h: number, d: number, radius: number) {
    return place(new RoundedBoxGeometry(w, h, d, 2, radius), material, x, y, z);
  }

  const textures = [wood, surfaceGrain];
  function graphic(name: string, map: CanvasTexture, x: number, y: number, z: number, width: number, height: number) {
    textures.push(map);
    return place(new PlaneGeometry(width, height), new MeshBasicMaterial({ name, map, toneMapped: false }), x, y, z);
  }

  rounded(ink, 0, 0.08, 0, 5.46, 0.16, 3.90, 0.075);
  rounded(base, 0, 0.21, 0, 5.56, 0.20, 4.00, 0.085);
  block(brass, 0, 0.246, 2.004, 5.16, 0.018, 0.018);
  const woods = ["#af8a68", "#b19778", "#af8d70", "#9d795c"].map((color, index) => {
    const plank = matte(`Oak plank ${index + 1}`, color, 0.55);
    plank.map = wood;
    return plank;
  });
  for (let plank = 0; plank < 15; plank += 1) {
    const grain = woods[(plank * 3 + Math.floor(plank / 3)) % woods.length];
    block(grain, -2.59 + plank * 0.37, 0.303, 0, 0.363, 0.058, 3.81);
  }

  const back = -1.70;
  block(wall, -1.59, 1.62, back, 1.68, 2.57, 0.18);
  block(wall, 2.09, 1.62, back, 0.60, 2.57, 0.18);
  block(wall, 0.52, 0.88, back, 2.54, 1.10, 0.18);
  block(wall, 0.52, 2.74, back, 2.54, 0.33, 0.18);
  block(wall, -2.33, 1.62, -0.41, 0.17, 2.57, 2.40);
  block(frame, -2.33, 2.92, -0.38, 0.23, 0.075, 2.40);
  block(frame, 0, 2.92, back, 4.90, 0.075, 0.24);
  block(frame, 0, 0.39, back + 0.105, 4.67, 0.105, 0.065);
  block(frame, -2.23, 0.39, -0.51, 0.063, 0.105, 2.42);

  graphic("Dusk skyline", texture(512, 256, drawWindow), 0.52, 2.01, back, 2.54, 1.22);
  for (const x of [-0.78, 0.08, 0.95, 1.82]) {
    block(frame, x, 2.0, back + 0.055, 0.07, 1.23, 0.16);
  }
  for (const y of [1.40, 2.02, 2.60]) {
    block(frame, 0.52, y, back + 0.066, 2.64, 0.067, 0.18);
  }
  block(paper, 0.52, 1.37, back + 0.17, 2.66, 0.065, 0.28);

  // Open shelving shares the cutaway wall.
  for (const z of [-1.22, 0.18]) {
    block(walnut, -2.00, 1.32, z, 0.43, 1.72, 0.063);
  }
  for (const y of [0.47, 1.00, 1.52, 2.04]) {
    block(oak, -2.00, y, -0.52, 0.46, 0.075, 1.45);
  }
  const covers = [teal, clay, paper, ink, brass];
  for (let shelf = 0; shelf < 3; shelf += 1) {
    const surface = [0.508, 1.038, 1.558][shelf];
    for (let book = 0; book < 7; book += 1) {
      const height = 0.22 + ((book * 7 + shelf * 2) % 10) * 0.012;
      const z = -1.07 + book * 0.155;
      block(covers[(book + shelf * 2) % covers.length], -1.96, surface + height / 2, z, 0.315, height, 0.122);
      if (book % 3 !== 2) block(brass, -1.801, surface + height * 0.77, z, 0.006, 0.009, 0.073);
    }
  }
  block(teal, -1.99, 2.14, -0.95, 0.34, 0.15, 0.46);
  block(paper, -1.99, 2.23, -0.95, 0.36, 0.036, 0.48);

  rounded(oak, 0.47, 0.97, -0.91, 3.19, 0.114, 0.96, 0.054);
  for (const x of [-0.98, 1.88]) {
    for (const z of [-1.27, -0.55]) block(ink, x, 0.62, z, 0.09, 0.61, 0.09);
    block(ink, x, 0.50, -0.91, 0.076, 0.075, 0.78);
  }
  rounded(frame, 0.56, 1.40, -1.11, 1.455, 0.866, 0.087, 0.041);
  graphic("Code editor", texture(512, 288, drawMonitor), 0.56, 1.412, -1.063, 1.366, 0.77);
  block(frame, 0.56, 1.04, -1.09, 0.16, 0.21, 0.078);
  rounded(frame, 0.56, 1.038, -1.02, 0.56, 0.04, 0.30, 0.018);
  rounded(frame, 0.53, 1.037, -0.58, 0.66, 0.036, 0.25, 0.015);
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 12; column += 1) {
      if (row === 3 && column >= 4 && column <= 7) continue;
      block(paper, 0.236 + column * 0.0535, 1.059, -0.668 + row * 0.056, 0.042, 0.014, 0.041);
    }
  }
  block(paper, 0.53, 1.059, -0.50, 0.205, 0.014, 0.041);
  rounded(frame, 1.02, 1.044, -0.59, 0.14, 0.043, 0.19, 0.02);
  const sketch = graphic("Interface sketch", texture(256, 192, drawSketch), -0.61, 1.032, -0.69, 0.66, 0.48);
  sketch.rotation.set(-Math.PI / 2, 0, -0.15);
  block(brass, -0.81, 1.047, -0.51, 0.27, 0.015, 0.015);

  place(new CylinderGeometry(0.155, 0.155, 0.038, 16), brass, 1.66, 1.048, -1.12);
  place(new CylinderGeometry(0.029, 0.029, 0.46, 12), brass, 1.66, 1.28, -1.12);
  place(new CylinderGeometry(0.101, 0.223, 0.20, 32), linen, 1.66, 1.56, -1.12);
  place(new CylinderGeometry(0.197, 0.197, 0.015, 20), warmLight, 1.66, 1.45, -1.12);
  const cup = new LatheGeometry([
    [0, 0], [0.066, 0], [0.080, 0.018], [0.091, 0.12], [0.087, 0.15],
    [0.075, 0.15], [0.076, 0.116], [0.063, 0.026], [0, 0.026],
  ].map(([radius, height]) => new Vector2(radius, height)), 22);
  place(cup, ceramic, 1.38, 1.027, -0.56);
  place(new TorusGeometry(0.053, 0.012, 7, 16), ceramic, 1.466, 1.098, -0.56);
  place(new CylinderGeometry(0.072, 0.072, 0.006, 20), coffee, 1.38, 1.136, -0.56);

  rounded(seat, 0.62, 0.68, 0.03, 0.66, 0.11, 0.58, 0.051);
  const chairBack = rounded(seat, 0.62, 0.955, 0.303, 0.64, 0.43, 0.12, 0.058);
  chairBack.rotation.x = -0.14;
  const backShell = rounded(frame, 0.62, 0.948, 0.348, 0.60, 0.365, 0.04, 0.019);
  backShell.rotation.x = -0.14;
  for (const x of [0.265, 0.975]) {
    block(ink, x, 0.75, 0.075, 0.038, 0.165, 0.045);
    rounded(frame, x, 0.837, 0.045, 0.08, 0.043, 0.25, 0.02);
  }
  block(ink, 0.62, 0.78, 0.32, 0.085, 0.28, 0.063);
  place(new CylinderGeometry(0.042, 0.047, 0.29, 12), ink, 0.62, 0.49, 0.03);
  block(ink, 0.62, 0.36, 0.03, 0.62, 0.055, 0.081);
  block(ink, 0.62, 0.36, 0.03, 0.081, 0.055, 0.61);

  place(new CylinderGeometry(0.233, 0.162, 0.38, 24), clay, 1.88, 0.52, 0.93);
  place(new CylinderGeometry(0.213, 0.213, 0.018, 24), walnut, 1.88, 0.713, 0.93);
  const leafShape = new SphereGeometry(1, 12, 8);
  for (let index = 0; index < 9; index += 1) {
    const angle = index * 2.4;
    const radius = 0.13 + (index % 3) * 0.07;
    const leaf = place(leafShape, index % 3 === 0 ? sage : green,
      1.88 + Math.cos(angle) * radius, 0.78 + ((index * 7) % 5) * 0.082, 0.93 + Math.sin(angle) * radius);
    leaf.scale.set(0.12, 0.26, 0.045);
    leaf.rotation.set(Math.cos(angle) * 0.75, angle, Math.sin(angle) * 0.67);
  }

  const curl = [
    [0.26, 1.08], [0.06, 1.07], [-0.075, 0.9], [-0.075, 0.42],
    [-0.13, 0.18], [-0.31, 0], [-0.13, -0.18], [-0.075, -0.42],
    [-0.075, -0.9], [0.06, -1.07], [0.26, -1.08],
  ];
  for (const side of [-1, 1]) {
    const x = side * 2.37;
    const profile = new CatmullRomCurve3(curl.map(([offset, y]) => new Vector3(-side * offset, y, 0)));
    place(new TubeGeometry(profile, 42, 0.056, 8, false), brass, x, 1.48, 1.65);
    block(brass, x - side * 0.25, 0.371, 1.65, 0.33, 0.068, 0.28);
  }

  const cube = new BoxGeometry(1, 1, 1);
  for (const [material, matrices] of blocks) {
    const batch = new InstancedMesh(cube, material, matrices.length);
    matrices.forEach((matrix, index) => batch.setMatrixAt(index, matrix));
    model.add(batch);
  }

  return { model, textures };
}

export function createHeroScene(canvas: HTMLCanvasElement, context: WebGL2RenderingContext) {
  const renderer = new WebGLRenderer({ canvas, context, alpha: true });
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.83;
  const scene = new Scene();
  const camera = new OrthographicCamera(-3.45, 3.45, 3.45, -3.45, 0.1, 30);

  const room = new RoomEnvironment();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, 0.05, 0.1, 100, { size: 64 });
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.52;
  room.dispose();
  pmrem.dispose();

  const key = new DirectionalLight("#ffdeb9", 1.75);
  key.position.set(2.0, 6.1, 4);
  const rim = new DirectionalLight("#a5c8fa", 1.46);
  rim.position.set(-3, 5, -3);
  const lamp = new PointLight("#ffb06b", 2.16, 1.8, 2);
  lamp.position.set(1.66, 1.36, -1.11);
  scene.add(key, rim, lamp);

  const { model, textures } = buildWorkshop();
  scene.add(model);
  const shadowTexture = texture(256, 256, drawShadow);
  const shadowPlane = new PlaneGeometry(1, 1);
  shadowPlane.rotateX(-Math.PI / 2);
  const groundShade = new MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false });
  const interiorShade = new MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.4 });
  for (const [x, y, z, width, depth] of [
    [-0.07, -0.025, 0.16, 8.1, 6.5],
    [0.49, 0.335, -0.90, 3.7, 1.67],
    [0.62, 0.336, 0.04, 1.13, 1.04],
    [-2.02, 0.337, -0.52, 0.98, 1.76],
    [1.88, 0.338, 0.93, 0.80, 0.77],
  ]) {
    const contact = new Mesh(shadowPlane, y < 0 ? groundShade : interiorShade);
    contact.position.set(x, y, z);
    contact.scale.set(width, 1, depth);
    scene.add(contact);
  }

  let azimuth = 0.54;
  let elevation = 0.53;
  let pendingFrame = 0;

  function draw() {
    const radius = 10;
    const targetY = 1.30;
    camera.position.set(
      Math.sin(azimuth) * Math.cos(elevation) * radius,
      targetY + Math.sin(elevation) * radius,
      Math.cos(azimuth) * Math.cos(elevation) * radius,
    );
    camera.lookAt(0, targetY, 0);
    renderer.render(scene, camera);
  }

  function resize() {
    const { clientWidth: width, clientHeight: height } = canvas;
    if (!width || !height) return;
    const extent = 3.65;
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
        if (object instanceof InstancedMesh) resources.add(object);
        for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
          resources.add(material);
        }
      });
      for (const resource of resources) resource.dispose();
      for (const map of textures) map.dispose();
      shadowTexture.dispose();
      environment.dispose();
      renderer.dispose();
    },
  };
}
