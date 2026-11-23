import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  HemisphereLight,
  MathUtils,
  Mesh,
  Object3D,
  PerspectiveCamera,
  PointLight,
  PMREMGenerator,
  Scene,
  Spherical,
  Texture,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

function disposeModel(model: Object3D) {
  const resources = new Set<{ dispose(): void }>();
  const images = new Set<ImageBitmap>();

  model.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    resources.add(object.geometry);
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) {
      resources.add(material);
      for (const value of Object.values(material)) {
        if (!(value instanceof Texture)) continue;
        resources.add(value);
        if (typeof ImageBitmap !== "undefined" && value.image instanceof ImageBitmap) {
          images.add(value.image);
        }
      }
    }
  });
  for (const resource of resources) resource.dispose();
  for (const image of images) image.close();
}

export async function createHeroScene(
  canvas: HTMLCanvasElement,
  context: WebGL2RenderingContext,
  signal: AbortSignal,
) {
  const response = await fetch("/hero-studio-night.glb", { signal });
  if (!response.ok) throw new Error("Could not load the studio model");
  const bytes = await response.arrayBuffer();
  signal.throwIfAborted();
  const { scene: model, cameras } = await new GLTFLoader().parseAsync(bytes, "");
  const authoredCamera = cameras.find((camera): camera is PerspectiveCamera => camera instanceof PerspectiveCamera);
  if (signal.aborted || !authoredCamera) {
    disposeModel(model);
    signal.throwIfAborted();
    throw new Error("Could not find the studio camera");
  }

  const renderer = new WebGLRenderer({ canvas, context });
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.93;
  const scene = new Scene();
  scene.background = new Color("#101420");
  scene.add(model);

  const room = new RoomEnvironment();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, 0.06, 0.1, 100, { size: 64 });
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.20;
  room.dispose();
  pmrem.dispose();

  const windowLight = new DirectionalLight("#86a9f5", 0.55);
  windowLight.position.set(-1.46, 1.78, -0.76);
  const lamp = new PointLight("#ffb376", 2.45, 1.2, 2);
  lamp.position.set(0.748, 1.174, -0.676);
  const blueShelfLight = new PointLight("#647eff", 0.74, 0.95, 2);
  blueShelfLight.position.set(0.108, 1.854, -0.772);
  const amberShelfLight = new PointLight("#ff9c60", 0.90, 0.92, 2);
  amberShelfLight.position.set(1.013, 1.854, -0.772);
  scene.add(windowLight, lamp, blueShelfLight, amberShelfLight, new HemisphereLight("#9bafdb", "#50403d", 0.40));

  model.updateMatrixWorld(true);
  const camera = authoredCamera.clone();
  // Match the framing authored in Blender and keep the view within the room.
  const target = new Vector3(0.025, 1.145, -0.55);
  const orbit = new Spherical().setFromVector3(authoredCamera.getWorldPosition(new Vector3()).sub(target));
  const initialAngle = orbit.theta;
  let pendingFrame = 0;

  function draw() {
    camera.position.setFromSpherical(orbit).add(target);
    camera.lookAt(target);
    renderer.render(scene, camera);
  }

  function resize() {
    const { clientWidth: width, clientHeight: height } = canvas;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setDrawingBufferSize(width, height, Math.min(window.devicePixelRatio, 1.5));
    draw();
  }

  resize();
  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(canvas);

  return {
    rotate(dx: number, dy: number) {
      orbit.theta = MathUtils.clamp(orbit.theta - dx * 0.004, initialAngle - 0.43, initialAngle + 0.31);
      orbit.phi = MathUtils.clamp(orbit.phi - dy * 0.003, 1.17, 1.60);
      if (pendingFrame) return;
      pendingFrame = requestAnimationFrame(() => {
        pendingFrame = 0;
        draw();
      });
    },
    dispose() {
      cancelAnimationFrame(pendingFrame);
      sizeObserver.disconnect();
      disposeModel(model);
      environment.dispose();
      renderer.dispose();
    },
  };
}
