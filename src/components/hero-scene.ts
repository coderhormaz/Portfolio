import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  Float32BufferAttribute,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  OrthographicCamera,
  Scene,
  TorusKnotGeometry,
  WebGLRenderer,
} from "three";

const ribCount = 86;
const samplesPerRib = 8;
const tubeSegments = 24;
const grooveProfile = [-0.026, -0.021, 0.017, 0.032, 0.034, 0.031, 0.015, -0.019];
const ribColor = [0, 0.12, 0.69, 0.93, 1, 0.94, 0.63, 0.12];

function createKnotGeometry() {
  const geometry = new TorusKnotGeometry(1.12, 0.27, ribCount * samplesPerRib, tubeSegments, 2, 3);
  const { position, normal } = geometry.attributes;
  const colors = new Float32Array(position.count * 3);
  const copper = new Color("#e56a33");
  const groove = new Color("#5a2014");
  const color = new Color();

  // Each ring of vertices is a cross-section of the tube. Offset its radius to cut the grooves.
  for (let vertex = 0; vertex < position.count; vertex += 1) {
    const ring = Math.floor(vertex / (tubeSegments + 1));
    const sample = ring % samplesPerRib;
    const depth = grooveProfile[sample];
    position.setXYZ(
      vertex,
      position.getX(vertex) + normal.getX(vertex) * depth,
      position.getY(vertex) + normal.getY(vertex) * depth,
      position.getZ(vertex) + normal.getZ(vertex) * depth,
    );

    color.copy(groove).lerp(copper, ribColor[sample]).toArray(colors, vertex * 3);
  }

  geometry.computeVertexNormals();
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  return geometry;
}

export function createHeroScene(stage: HTMLElement, canvas: HTMLCanvasElement, context: WebGL2RenderingContext) {
  const renderer = new WebGLRenderer({ canvas, context, alpha: true });
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;

  const scene = new Scene();
  const camera = new OrthographicCamera(-2.14, 2.14, 2.14, -2.14, 0.1, 20);
  camera.position.z = 7;

  const geometry = createKnotGeometry();
  const material = new MeshStandardMaterial({ vertexColors: true, metalness: 0.36, roughness: 0.39 });
  const knot = new Mesh(geometry, material);
  knot.rotation.set(0.46, -0.37, -0.31);
  scene.add(knot);

  const key = new DirectionalLight("#ffdcc1", 3.7);
  key.position.set(-3, 5, 4);
  const rim = new DirectionalLight("#ff7343", 4.8);
  rim.position.set(4, 0, -3);
  const fill = new DirectionalLight("#ffe1bb", 1.3);
  fill.position.set(3, -4, 3);
  scene.add(key, rim, fill, new HemisphereLight("#fbd1ab", "#5b2430", 1.15));

  let playing = false;
  let lastFrame: number | undefined;
  let elapsed = 0;
  let pointerX = 0;
  let pointerY = 0;

  function resize() {
    const { clientWidth: width, clientHeight: height } = canvas;
    if (width === 0 || height === 0) return;

    const extent = 2.14;
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
    elapsed += delta;

    knot.rotation.x = MathUtils.damp(knot.rotation.x, 0.46 + pointerY * 0.48, 4, delta);
    knot.rotation.y = MathUtils.damp(knot.rotation.y, -0.37 + Math.sin(elapsed * 0.38) * 0.32 + pointerX * 0.72, 4, delta);
    knot.rotation.z = -0.31 + Math.sin(elapsed * 0.31) * 0.18;
    renderer.render(scene, camera);
  }

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
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
