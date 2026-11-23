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
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
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
  const response = await fetch("/hero-studio.glb", { signal });
  if (!response.ok) throw new Error("Could not load the studio model");
  const bytes = await response.arrayBuffer();
  signal.throwIfAborted();
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const { scene: model, cameras } = await loader.parseAsync(bytes, "");
  const authoredCamera = cameras.find((camera): camera is PerspectiveCamera => camera instanceof PerspectiveCamera);
  if (signal.aborted || !authoredCamera) {
    disposeModel(model);
    signal.throwIfAborted();
    throw new Error("Could not find the studio camera");
  }

  const renderer = new WebGLRenderer({ canvas, context });
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.84;
  const scene = new Scene();
  scene.background = new Color("#24292e");
  scene.add(model);

  const room = new RoomEnvironment();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, 0.06, 0.1, 100, { size: 64 });
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.42;
  room.dispose();
  pmrem.dispose();

  const key = new DirectionalLight("#ffe9da", 1.58);
  key.position.set(-0.45, 2.42, 1.85);
  const windowLight = new DirectionalLight("#a6c9ff", 1.16);
  windowLight.position.set(-1.46, 1.78, -0.76);
  const lamp = new PointLight("#ffc17d", 1.4, 0.9, 2);
  lamp.position.set(0.748, 1.19, -0.66);
  scene.add(key, windowLight, lamp, new HemisphereLight("#bbcde4", "#62554f", 0.58));

  model.updateMatrixWorld(true);
  const camera = authoredCamera.clone();
  // Match the framing authored in Blender and keep the view within the room.
  const target = new Vector3(0.015, 1.18, -0.555);
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
