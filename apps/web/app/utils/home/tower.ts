// The spinnable tower of the home page's hero, with plain three.js. It's the
// same scene react.email builds with @react-three/fiber: a camera, a group of
// open cylinders mapped with a collage of the components' screenshots, which
// can be dragged around and keep spinning with momentum.
import * as THREE from 'three';

export interface TowerCollageImage {
  url: string;
}

export interface TowerTextureDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export interface TowerCollageTexture {
  texture: THREE.CanvasTexture;
  dimensions: TowerTextureDimensions;
}

interface CollageOptions {
  gap?: number;
  canvasHeight?: number;
  canvasWidth?: number;
  axis?: 'x' | 'y';
}

interface LoadedImage {
  img: HTMLImageElement;
  width: number;
  height: number;
}

/** Preloads an image and calculates its dimensions in the collage */
async function preloadImage(
  imageUrl: string,
  axis: 'x' | 'y',
  canvasHeight: number,
  canvasWidth: number,
): Promise<LoadedImage> {
  const img = new Image();
  img.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${imageUrl}`));
    img.src = imageUrl;
  });

  const aspectRatio = img.naturalWidth / img.naturalHeight;

  // Horizontal layouts scale images to fit the height of the canvas, vertical
  // ones to fit its width
  return axis === 'x'
    ? { img, width: canvasHeight * aspectRatio, height: canvasHeight }
    : { img, width: canvasWidth, height: canvasWidth / aspectRatio };
}

/**
 * Draws the images one after the other on a canvas, and makes a texture of
 * it that repeats horizontally.
 */
export async function getCanvasTexture(
  images: TowerCollageImage[],
  {
    gap = 0,
    canvasHeight = 512,
    canvasWidth = 512,
    axis = 'x',
  }: CollageOptions = {},
): Promise<TowerCollageTexture> {
  if (!images.length) throw new Error('No images');

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('No context');

  const imageData = await Promise.all(
    images.map((image) =>
      preloadImage(image.url, axis, canvasHeight, canvasWidth),
    ),
  );

  const totalWidth =
    axis === 'x'
      ? imageData.reduce(
          (sum, data, index) => sum + data.width + (index > 0 ? gap : 0),
          0,
        )
      : canvasWidth;
  const totalHeight =
    axis === 'x'
      ? canvasHeight
      : imageData.reduce(
          (sum, data, index) => sum + data.height + (index > 0 ? gap : 0),
          0,
        );

  const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = totalWidth * devicePixelRatio;
  canvas.height = totalHeight * devicePixelRatio;
  if (devicePixelRatio !== 1) context.scale(devicePixelRatio, devicePixelRatio);

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, totalWidth, totalHeight);

  let currentX = 0;
  let currentY = 0;
  context.save();
  for (const data of imageData) {
    context.drawImage(data.img, currentX, currentY, data.width, data.height);
    if (axis === 'x') currentX += data.width + gap;
    else currentY += data.height + gap;
  }
  context.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  // @react-three/fiber does this to the `map` of built-in materials
  texture.colorSpace = THREE.SRGBColorSpace;

  return {
    texture,
    dimensions: {
      width: totalWidth,
      height: totalHeight,
      aspectRatio: totalWidth / totalHeight,
    },
  };
}

/** A basic material that darkens the faces seen from behind */
export class MeshImageMaterial extends THREE.MeshBasicMaterial {
  override onBeforeCompile(shader: THREE.WebGLProgramParametersWithUniforms) {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      /* glsl */ `#include <color_fragment>
                if (!gl_FrontFacing) {
                    vec3 blackCol = vec3(0.0);
                    diffuseColor.rgb = mix(diffuseColor.rgb, blackCol, 0.86);
                }
            `,
    );
  }
}

/** Fits the texture around a cylinder, keeping its proportions */
export function setupCylinderTextureMapping(
  texture: THREE.Texture,
  dimensions: TowerTextureDimensions,
  radius: number,
  height: number,
) {
  const cylinderCircumference = 2 * Math.PI * radius;
  const cylinderAspectRatio = cylinderCircumference / height;

  if (dimensions.aspectRatio > cylinderAspectRatio) {
    // The canvas is wider than the cylinder, proportionally
    texture.repeat.x = cylinderAspectRatio / dimensions.aspectRatio;
    texture.repeat.y = 1;
    texture.offset.x = (1 - texture.repeat.x) / 2;
  } else {
    // The canvas is taller than the cylinder, proportionally
    texture.repeat.x = 1;
    texture.repeat.y = dimensions.aspectRatio / cylinderAspectRatio;
  }

  // Centers the texture
  texture.offset.y = (1 - texture.repeat.y) / 2;
}

const COUNT = 12;
const GAP = 3.5;
const RADIUS = 4;
const BILLBOARD_HEIGHT = 2;

/**
 * Renders the tower into `container`, until the returned function is called
 * to dispose of it.
 */
export function createTowerScene(
  container: HTMLElement,
  { texture, dimensions }: TowerCollageTexture,
): () => void {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(Math.max(1, window.devicePixelRatio), 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.domElement.style.display = 'block';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(7, 1, 0.01, 100000);
  camera.position.set(0, 0, 70);

  const group = new THREE.Group();
  group.rotation.set(-0.2, 0.5, 0.2);
  group.position.set(5, 0, 0);
  scene.add(group);

  setupCylinderTextureMapping(texture, dimensions, RADIUS, BILLBOARD_HEIGHT);

  const geometry = new THREE.CylinderGeometry(
    RADIUS,
    RADIUS,
    BILLBOARD_HEIGHT,
    100,
    1,
    true,
  );
  const material = new MeshImageMaterial({
    map: texture,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  for (let index = 0; index < COUNT; index++) {
    const billboard = new THREE.Mesh(geometry, material);
    billboard.rotation.set(0, index * Math.PI * 0.5, 0.25);
    billboard.position.set(0, (index - (Math.ceil(COUNT / 2) - 1)) * GAP, 0);
    group.add(billboard);
  }

  const size = { width: 0, height: 0 };
  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    size.width = width;
    size.height = height;
    if (width === 0 || height === 0) return;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  // Dragging, with momentum when released
  let isDragging = false;
  let isHovered = false;
  let velocity = 0;
  let lastX = 0;
  let rotationY = 0.5;

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const hitsTower = (event: PointerEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(group.children, true).length > 0;
  };

  const handlePointerEnter = () => {
    if (!isDragging) document.body.style.cursor = 'grab';
  };
  const handlePointerLeave = () => {
    if (!isDragging) document.body.style.cursor = '';
  };
  const setHovered = (hovered: boolean) => {
    if (hovered === isHovered) return;
    isHovered = hovered;
    if (hovered) handlePointerEnter();
    else handlePointerLeave();
  };

  const handleWindowPointerMove = (event: PointerEvent) => {
    const deltaX = event.clientX - lastX;
    const rotationDelta = (deltaX / size.width) * Math.PI * 2;

    rotationY += rotationDelta;
    // Kept for the momentum
    velocity = rotationDelta * 60;

    lastX = event.clientX;
  };
  const handleWindowPointerUp = () => {
    isDragging = false;
    document.body.style.cursor = '';
    window.removeEventListener('pointermove', handleWindowPointerMove);
    window.removeEventListener('pointerup', handleWindowPointerUp);
  };

  const handlePointerDown = (event: PointerEvent) => {
    if (!hitsTower(event)) return;
    isDragging = true;
    lastX = event.clientX;
    velocity = 0;
    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
  };
  const handlePointerMove = (event: PointerEvent) => {
    setHovered(hitsTower(event));
  };
  const handleContainerPointerLeave = () => {
    setHovered(false);
  };

  container.addEventListener('pointerdown', handlePointerDown);
  container.addEventListener('pointermove', handlePointerMove);
  container.addEventListener('pointerleave', handleContainerPointerLeave);

  let lastTime = performance.now();
  renderer.setAnimationLoop(() => {
    const now = performance.now();
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    if (!isDragging) {
      rotationY += velocity * delta;
      // Damping
      velocity *= 0.95;
    }
    group.rotation.y = rotationY;

    // Each of the billboards, which share the texture, scrolled it a bit
    texture.offset.x += delta * 0.001 * COUNT;

    if (size.width > 0 && size.height > 0) renderer.render(scene, camera);
  });

  return () => {
    renderer.setAnimationLoop(null);
    resizeObserver.disconnect();
    container.removeEventListener('pointerdown', handlePointerDown);
    container.removeEventListener('pointermove', handlePointerMove);
    container.removeEventListener('pointerleave', handleContainerPointerLeave);
    window.removeEventListener('pointermove', handleWindowPointerMove);
    window.removeEventListener('pointerup', handleWindowPointerUp);
    document.body.style.cursor = '';
    geometry.dispose();
    material.dispose();
    texture.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  };
}
