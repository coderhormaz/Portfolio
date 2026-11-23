import {
  ACESFilmicToneMapping,
  BoxGeometry,
  CatmullRomCurve3,
  CanvasTexture,
  CylinderGeometry,
  DirectionalLight,
  Group,
  InstancedMesh,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  OrthographicCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TubeGeometry,
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
  sky.addColorStop(0, "#26335b");
  sky.addColorStop(0.64, "#526d91");
  sky.addColorStop(1, "#ce998c");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = "#ffedce";
  ctx.beginPath();
  ctx.arc(407, 56, 15, 0, Math.PI * 2);
  ctx.fill();
  for (let star = 0; star < 32; star += 1) {
    ctx.fillStyle = star % 4 === 0 ? "#ffe8c9" : "#d5dfed68";
    ctx.fillRect((star * 143 + 19) % 503, (star * 61 + 13) % 126, 2, 2);
  }

  for (let tower = 0; tower < 22; tower += 1) {
    const x = tower * 24;
    const height = 20 + (tower * 19) % 66;
    const y = 256 - height;
    ctx.fillStyle = tower % 3 === 0 ? "#2c3853" : "#394665";
    ctx.fillRect(x, y, 21, height);
    ctx.fillStyle = "#f6bb80ad";
    for (let floor = 0; floor < (height - 9) / 10; floor += 1) {
      const offset = (tower + floor) % 2 ? 5 : 12;
      ctx.fillRect(x + offset, y + 8 + floor * 10, 3, 3);
    }
  }
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

function buildWorkshop() {
  const model = new Group();
  const blocks = new Map<Material, Matrix4[]>();
  const transform = new Object3D();
  const matte = (color: string, roughness = 0.72) => new MeshStandardMaterial({ color, roughness });
  const base = matte("#283348", 0.49);
  const ink = matte("#1c2938");
  const wall = matte("#496079");
  const frame = matte("#26364d", 0.5);
  const oak = matte("#b27f57");
  const walnut = matte("#694738");
  const paper = matte("#e6d3b7");
  const clay = matte("#bb6657");
  const seat = matte("#398a9c", 0.51);
  const teal = matte("#608b85");
  const green = matte("#628e70");
  const sage = matte("#96ac77");
  const brass = new MeshStandardMaterial({ color: "#e6b981", metalness: 0.38, roughness: 0.38 });
  const warmLight = new MeshStandardMaterial({
    color: "#ffd2a0",
    emissive: "#ffae59",
    emissiveIntensity: 1.5,
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

  const textures: CanvasTexture[] = [];
  function graphic(map: CanvasTexture, x: number, y: number, z: number, width: number, height: number) {
    textures.push(map);
    return place(new PlaneGeometry(width, height), new MeshBasicMaterial({ map, toneMapped: false }), x, y, z);
  }

  rounded(ink, 0, 0.08, 0, 5.46, 0.16, 3.90, 0.075);
  rounded(base, 0, 0.21, 0, 5.56, 0.20, 4.00, 0.085);
  block(brass, 0, 0.246, 2.004, 5.16, 0.018, 0.018);
  const woods = ["#b19377", "#bfa188", "#c7a78a", "#ac8e70"].map((color) => matte(color, 0.8));
  for (let plank = 0; plank < 15; plank += 1) {
    const grain = woods[(plank * 3 + Math.floor(plank / 3)) % woods.length];
    block(grain, -2.59 + plank * 0.37, 0.303, 0, 0.363, 0.058, 3.81);
  }

  const back = -1.70;
  block(wall, -1.54, 1.62, back, 1.69, 2.57, 0.18);
  block(wall, 2.17, 1.62, back, 0.44, 2.57, 0.18);
  block(wall, 0.52, 0.88, back, 2.54, 1.10, 0.18);
  block(wall, 0.52, 2.74, back, 2.54, 0.33, 0.18);
  block(wall, -2.33, 1.62, -0.50, 0.17, 2.57, 2.58);
  block(frame, -2.33, 2.92, -0.50, 0.23, 0.075, 2.64);
  block(frame, 0, 2.92, back, 4.90, 0.075, 0.24);
  block(frame, 0, 0.39, back + 0.105, 4.67, 0.105, 0.065);
  block(frame, -2.23, 0.39, -0.51, 0.063, 0.105, 2.42);

  graphic(texture(512, 256, drawWindow), 0.52, 2.01, back, 2.54, 1.22);
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
      block(covers[(book + shelf * 2) % covers.length], -1.96, surface + height / 2, -1.07 + book * 0.155,
        0.315, height, 0.122, book === 6 ? -0.14 : 0);
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
  graphic(texture(512, 288, drawMonitor), 0.56, 1.412, -1.063, 1.366, 0.77);
  block(frame, 0.56, 1.04, -1.09, 0.16, 0.21, 0.078);
  rounded(frame, 0.56, 1.038, -1.02, 0.56, 0.04, 0.30, 0.018);
  rounded(paper, 0.53, 1.037, -0.58, 0.66, 0.035, 0.24, 0.015);
  rounded(frame, 1.02, 1.044, -0.59, 0.14, 0.043, 0.19, 0.02);
  const sketch = graphic(texture(256, 192, drawSketch), -0.61, 1.032, -0.69, 0.66, 0.48);
  sketch.rotation.set(-Math.PI / 2, 0, -0.15);
  block(paper, -0.81, 1.047, -0.51, 0.27, 0.02, 0.018);

  place(new CylinderGeometry(0.155, 0.155, 0.038, 16), brass, 1.66, 1.048, -1.12);
  place(new CylinderGeometry(0.029, 0.029, 0.46, 12), brass, 1.66, 1.28, -1.12);
  place(new CylinderGeometry(0.101, 0.223, 0.20, 20), brass, 1.66, 1.56, -1.12);
  place(new CylinderGeometry(0.197, 0.197, 0.015, 20), warmLight, 1.66, 1.45, -1.12);
  place(new CylinderGeometry(0.087, 0.082, 0.15, 16), clay, 1.38, 1.10, -0.56);
  place(new CylinderGeometry(0.069, 0.069, 0.01, 16), walnut, 1.38, 1.178, -0.56);

  rounded(seat, 0.62, 0.68, 0.03, 0.66, 0.11, 0.58, 0.051);
  const chairBack = rounded(seat, 0.62, 0.955, 0.303, 0.64, 0.43, 0.12, 0.058);
  chairBack.rotation.x = -0.14;
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
  renderer.toneMappingExposure = 1.21;
  const scene = new Scene();
  const camera = new OrthographicCamera(-3.45, 3.45, 3.45, -3.45, 0.1, 30);

  const room = new RoomEnvironment();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, 0.05, 0.1, 100, { size: 64 });
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.70;
  room.dispose();
  pmrem.dispose();

  const key = new DirectionalLight("#ffd8ac", 2.85);
  key.position.set(2.0, 6.1, 4);
  const rim = new DirectionalLight("#adc9ff", 1.45);
  rim.position.set(-3, 5, -3);
  const lamp = new PointLight("#ffae58", 1.6, 1.8, 2);
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
