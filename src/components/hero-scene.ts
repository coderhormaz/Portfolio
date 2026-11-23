import {
  ACESFilmicToneMapping,
  BufferGeometry,
  CanvasTexture,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  Line,
  LineDashedMaterial,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  Shape,
  SphereGeometry,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";

export type DeploymentStep = "Commit" | "Build" | "Live";

const panelWidth = 3.72;
const panelHeight = 2.02;
const panelThickness = 0.075;
const faceWidth = 1024;
const faceHeight = 556;
const mono = '"Consolas", "Courier New", monospace';

function createPanelShape() {
  const x = panelWidth / 2;
  const y = panelHeight / 2;
  const radius = 0.1;
  const shape = new Shape();
  shape.moveTo(-x + radius, -y);
  shape.lineTo(x - radius, -y);
  shape.quadraticCurveTo(x, -y, x, -y + radius);
  shape.lineTo(x, y - radius);
  shape.quadraticCurveTo(x, y, x - radius, y);
  shape.lineTo(-x + radius, y);
  shape.quadraticCurveTo(-x, y, -x, y - radius);
  shape.lineTo(-x, -y + radius);
  shape.quadraticCurveTo(-x, -y, -x + radius, -y);
  return shape;
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius = 20) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

function drawInterface(ctx: CanvasRenderingContext2D, preview: HTMLImageElement) {
  ctx.save();
  roundedRect(ctx, 26, 92, 972, 438);
  ctx.clip();
  ctx.drawImage(preview, 26, 92, 972, 438);
  ctx.restore();
}

function drawApi(ctx: CanvasRenderingContext2D) {
  const boxes = [
    { x: 36, title: "REQUEST", detail: "Course enrollment", accent: "#ffb077" },
    { x: 565, title: "RESPONSE", detail: "200 OK", accent: "#ace2c6" },
  ];

  for (const { x, title, detail, accent } of boxes) {
    roundedRect(ctx, x, 124, 423, 361);
    ctx.fillStyle = "#241d1b";
    ctx.fill();
    ctx.strokeStyle = "#785644";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.font = `600 34px ${mono}`;
    ctx.fillStyle = accent;
    ctx.fillText(title, x + 32, 196);
    ctx.font = "500 37px system-ui, sans-serif";
    ctx.fillStyle = "#fff1e5";
    ctx.fillText(detail, x + 32, 263);

    ctx.fillStyle = "#996e586e";
    ctx.fillRect(x + 32, 329, 231, 11);
    ctx.fillRect(x + 32, 365, 149, 11);
    ctx.fillRect(x + 32, 401, 196, 11);
  }

  ctx.strokeStyle = "#ffb077";
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(478, 301);
  ctx.lineTo(543, 301);
  ctx.moveTo(524, 283);
  ctx.lineTo(543, 301);
  ctx.lineTo(524, 320);
  ctx.stroke();
}

function drawDatabase(ctx: CanvasRenderingContext2D) {
  const tables = ["Courses", "Enrollments", "Sessions"];

  tables.forEach((table, index) => {
    const y = 112 + index * 130;
    roundedRect(ctx, 36, y, 952, 108);
    ctx.fillStyle = index % 2 ? "#26322e" : "#202a27";
    ctx.fill();
    ctx.strokeStyle = "#456256";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#a4d9bd";
    ctx.beginPath();
    ctx.arc(90, y + 54, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "500 39px system-ui, sans-serif";
    ctx.fillStyle = "#f3f5e7";
    ctx.fillText(table, 126, y + 68);

    ctx.fillStyle = "#729887";
    ctx.fillRect(522, y + 47, 140, 12);
    ctx.fillRect(723, y + 47, 85, 12);
    ctx.fillRect(858, y + 47, 72, 12);
  });
}

function drawBuild(ctx: CanvasRenderingContext2D) {
  roundedRect(ctx, 36, 112, 952, 390);
  ctx.fillStyle = "#192420";
  ctx.fill();
  ctx.strokeStyle = "#537160";
  ctx.lineWidth = 3;
  ctx.stroke();

  ["Compile application", "Check types", "Generate output"].forEach((task, index) => {
    const y = 207 + index * 111;
    ctx.font = `600 39px ${mono}`;
    ctx.fillStyle = "#a4d9bd";
    ctx.fillText("✓", 82, y);
    ctx.fillStyle = "#ecf5e9";
    ctx.fillText(task, 147, y);
    if (index < 2) {
      ctx.fillStyle = "#53716080";
      ctx.fillRect(82, y + 39, 859, 3);
    }
  });
}

function createPanelTexture(title: string, detail: string, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = faceWidth;
  canvas.height = faceHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not draw the deployment preview");

  roundedRect(ctx, 1, 1, faceWidth - 2, faceHeight - 2, 29);
  ctx.clip();
  const color = ctx.createLinearGradient(0, 0, faceWidth, faceHeight);
  color.addColorStop(0, "#342921");
  color.addColorStop(0.45, "#211b19");
  color.addColorStop(1, "#171719");
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, faceWidth, faceHeight);
  ctx.strokeStyle = "#db9d737d";
  ctx.lineWidth = 7;
  ctx.stroke();

  ctx.font = `600 38px ${mono}`;
  ctx.fillStyle = "#ffe1c8";
  ctx.fillText(title, 36, 60);
  ctx.font = `500 29px ${mono}`;
  ctx.textAlign = "right";
  ctx.fillStyle = "#d5bdac";
  ctx.fillText(detail, 988, 60);
  ctx.textAlign = "left";

  ctx.fillStyle = "#ba886a4d";
  ctx.fillRect(26, 76, 972, 3);
  draw(ctx);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function createHeroScene(
  stage: HTMLElement,
  canvas: HTMLCanvasElement,
  context: WebGL2RenderingContext,
  preview: HTMLImageElement,
  onStepChange: (step: DeploymentStep) => void,
) {
  const textures = [
    createPanelTexture("INTERFACE", "AISkool.com", (ctx) => drawInterface(ctx, preview)),
    createPanelTexture("API", "HTTP", drawApi),
    createPanelTexture("DATABASE", "PostgreSQL", drawDatabase),
  ];
  const buildTexture = createPanelTexture("BUILD", "PASSED", drawBuild);

  const renderer = new WebGLRenderer({ canvas, context, alpha: true });
  renderer.toneMapping = ACESFilmicToneMapping;
  const scene = new Scene();
  const camera = new OrthographicCamera(-2, 2, 2, -2, 0.1, 20);
  camera.position.z = 8;

  const stack = new Group();
  scene.add(stack);
  const body = new ExtrudeGeometry(createPanelShape(), {
    depth: panelThickness,
    bevelSegments: 2,
    bevelSize: 0.032,
    bevelThickness: 0.024,
    curveSegments: 5,
  });
  const face = new PlaneGeometry(panelWidth, panelHeight);
  const bodyMaterials = [
    new MeshStandardMaterial({ color: "#ac6846", roughness: 0.43, metalness: 0.5 }),
    new MeshStandardMaterial({ color: "#5b362a", roughness: 0.54, metalness: 0.4 }),
  ];
  const faceMaterials = textures.map((map) =>
    new MeshBasicMaterial({ map, alphaTest: 0.5, toneMapped: false }),
  );
  const panels = faceMaterials.map((material) => {
    const panel = new Group();
    const panelFace = new Mesh(face, material);
    panelFace.position.z = panelThickness + 0.026;
    panel.add(new Mesh(body, bodyMaterials), panelFace);
    stack.add(panel);
    return panel;
  });

  const key = new DirectionalLight("#ffceaa", 4);
  key.position.set(-3, 5, 6);
  const rim = new DirectionalLight("#ffa263", 2.4);
  rim.position.set(3, -2, 1);
  scene.add(key, rim, new HemisphereLight("#fff1d5", "#3f373b", 1.35));

  const guideMaterial = new LineDashedMaterial({
    color: "#ec9867",
    dashSize: 0.075,
    gapSize: 0.062,
    transparent: true,
  });
  const guides = [-1.54, 1.54].map((x) => {
    const guide = new Line(
      new BufferGeometry().setFromPoints([new Vector3(x, 1.18, -0.15), new Vector3(x, -1.25, -0.15)]),
      guideMaterial,
    );
    guide.computeLineDistances();
    stack.add(guide);
    return guide;
  });
  const signalShape = new SphereGeometry(0.04, 12, 8);
  const signalMaterial = new MeshBasicMaterial({ color: "#ffd39a", toneMapped: false });
  const signal = new Mesh(signalShape, signalMaterial);
  stack.add(signal);

  let playing = false;
  let lastFrame: number | undefined;
  let elapsed = 0;
  let pointerX = 0;
  let pointerY = 0;
  let step: DeploymentStep = "Commit";

  function pose(time: number, delta: number) {
    const assembled = MathUtils.smoothstep(time, 3.65, 5.65) * (1 - MathUtils.smoothstep(time, 8.1, 10));
    const nextStep: DeploymentStep = time < 2.9 || time >= 8.55 ? "Commit" : time < 5.65 ? "Build" : "Live";
    if (step !== nextStep) {
      step = nextStep;
      faceMaterials[1].map = step === "Commit" ? textures[1] : buildTexture;
      onStepChange(step);
    }

    stack.scale.setScalar(MathUtils.lerp(0.88, 1, assembled));
    stack.rotation.x = MathUtils.damp(stack.rotation.x, pointerY * 0.14, 4, delta);
    stack.rotation.y = MathUtils.damp(stack.rotation.y, pointerX * 0.22, 4, delta);
    panels.forEach((panel, index) => {
      panel.position.set(
        MathUtils.lerp(0.06 * (index - 1), 0.09 * index, assembled),
        MathUtils.lerp(1.10 - 1.1 * index, 0.13 - 0.17 * index, assembled),
        MathUtils.lerp(0.05 - 0.18 * index, 0.45 - 0.33 * index, assembled),
      );
      panel.rotation.set(
        MathUtils.lerp(-1.07, -0.12, assembled),
        MathUtils.lerp(-0.24, -0.09, assembled),
        MathUtils.lerp(0.04, 0.015, assembled),
      );
    });

    guideMaterial.opacity = (1 - assembled) * 0.65;
    for (const guide of guides) guide.visible = assembled < 0.97;
    const traveling = (time % 1.45) / 1.45;
    signal.visible = assembled < 0.7;
    signal.position.set(1.54, MathUtils.lerp(1.18, -1.25, traveling), -0.13);
    signal.scale.setScalar(Math.sin(traveling * Math.PI) * (1 - assembled));
  }

  function resize() {
    const { clientWidth: width, clientHeight: height } = canvas;
    if (width === 0 || height === 0) return;

    const extent = 2.18;
    const aspect = width / height;
    const horizontal = extent * Math.max(aspect, 1);
    const vertical = extent * Math.max(1 / aspect, 1);
    camera.left = -horizontal;
    camera.right = horizontal;
    camera.top = vertical;
    camera.bottom = -vertical;
    camera.updateProjectionMatrix();
    renderer.setDrawingBufferSize(width, height, Math.min(window.devicePixelRatio, 1.5));
    renderer.render(scene, camera);
  }

  function onPointerMove(event: PointerEvent) {
    if (event.pointerType === "touch") return;
    const bounds = stage.getBoundingClientRect();
    pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
    pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
  }

  function resetPointer() {
    pointerX = 0;
    pointerY = 0;
  }

  function animate(time: number) {
    const delta = lastFrame === undefined ? 0 : Math.min((time - lastFrame) / 1000, 0.05);
    lastFrame = time;
    elapsed = (elapsed + delta) % 10;
    pose(elapsed, delta);
    renderer.render(scene, camera);
  }

  pose(0, 0);
  resize();
  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(stage);
  stage.addEventListener("pointermove", onPointerMove, { passive: true });
  stage.addEventListener("pointerleave", resetPointer);

  return {
    setPlaying(next: boolean) {
      if (playing === next) return;
      playing = next;
      lastFrame = undefined;
      renderer.setAnimationLoop(next ? animate : null);
    },
    dispose() {
      renderer.setAnimationLoop(null);
      sizeObserver.disconnect();
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", resetPointer);
      for (const guide of guides) guide.geometry.dispose();
      for (const material of [...bodyMaterials, ...faceMaterials, guideMaterial, signalMaterial]) material.dispose();
      for (const texture of textures) texture.dispose();
      buildTexture.dispose();
      body.dispose();
      face.dispose();
      signalShape.dispose();
      renderer.dispose();
    },
  };
}
