import {
  Color,
  MathUtils,
  Mesh,
  Object3D,
  PerspectiveCamera,
  Scene,
  Spherical,
  Texture,
  Vector3,
  WebGLRenderer,
} from "three";
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
  const orbitDistance = authoredCamera?.userData.orbitDistance;
  if (signal.aborted || !authoredCamera || typeof orbitDistance !== "number") {
    disposeModel(model);
    signal.throwIfAborted();
    throw new Error("Could not find the studio camera");
  }

  const renderer = new WebGLRenderer({ canvas, context });
  const scene = new Scene();
  scene.background = new Color("#101420");
  scene.add(model);

  model.updateMatrixWorld(true);
  const origin = authoredCamera.getWorldPosition(new Vector3());
  const target = authoredCamera.getWorldDirection(new Vector3()).multiplyScalar(orbitDistance).add(origin);
  const orbit = new Spherical().setFromVector3(origin.sub(target));
  const camera = authoredCamera.clone();
  const authoredAspect = authoredCamera.aspect;
  const halfFovTangent = Math.tan(MathUtils.degToRad(authoredCamera.fov) / 2);
  const initialAngle = orbit.theta;
  let pendingFrame = 0;

  function draw() {
    camera.position.setFromSpherical(orbit).add(target);
    camera.lookAt(target);
    renderer.render(scene, camera);
  }

  function resize() {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height;
    // Crop the authored view in the same way that object-fit: cover crops the poster.
    const crop = Math.min(1, authoredAspect / camera.aspect);
    camera.fov = MathUtils.radToDeg(2 * Math.atan(halfFovTangent * crop));
    camera.updateProjectionMatrix();
    renderer.setDrawingBufferSize(width, height, Math.min(window.devicePixelRatio, 2));
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
      renderer.dispose();
    },
  };
}
