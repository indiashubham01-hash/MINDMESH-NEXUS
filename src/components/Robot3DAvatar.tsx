import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type RobotState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface Robot3DAvatarProps {
  state?: RobotState;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showControls?: boolean;
  wireframeMode?: boolean;
  onToggleWireframe?: () => void;
  interactive?: boolean;
  className?: string;
}

export const Robot3DAvatar: React.FC<Robot3DAvatarProps> = ({
  state = 'idle',
  size = 'md',
  showControls = false,
  wireframeMode = false,
  onToggleWireframe,
  interactive = true,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const robotGroupRef = useRef<THREE.Group | null>(null);
  const headGroupRef = useRef<THREE.Group | null>(null);
  const antennaBulbRef = useRef<THREE.Mesh | null>(null);
  const leftEyeRef = useRef<THREE.Mesh | null>(null);
  const rightEyeRef = useRef<THREE.Mesh | null>(null);
  const mouthBarRefs = useRef<THREE.Mesh[]>([]);
  const coreReactorRef = useRef<THREE.Mesh | null>(null);
  const leftShoulderRef = useRef<THREE.Mesh | null>(null);
  const rightShoulderRef = useRef<THREE.Mesh | null>(null);
  const materialsRef = useRef<THREE.Material[]>([]);

  const mousePos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const manualRotation = useRef({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);

  // Dimensions based on size prop
  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return { width: 56, height: 56 };
      case 'md':
        return { width: 120, height: 120 };
      case 'lg':
        return { width: 180, height: 180 };
      case 'hero':
        return { width: 260, height: 260 };
      default:
        return { width: 120, height: 120 };
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const { width, height } = getDimensions();

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.25, 3.8);

    // 2. High Performance WebGL Renderer with Alpha Transparency
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Clean Studio Lighting Setup (Natural Warm Daylight - No Neon)
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const dirKeyLight = new THREE.DirectionalLight(0xfffbf2, 2.0);
    dirKeyLight.position.set(3, 4, 3);
    dirKeyLight.castShadow = true;
    scene.add(dirKeyLight);

    const dirFillLight = new THREE.DirectionalLight(0xf1f5f9, 1.4);
    dirFillLight.position.set(-3, -1, 2);
    scene.add(dirFillLight);

    const softTopLight = new THREE.DirectionalLight(0xffffff, 1.0);
    softTopLight.position.set(0, 4, 0);
    scene.add(softTopLight);

    // 4. Construct Robot Hierarchy (Light Ceramic & Satin Finish)
    const robotGroup = new THREE.Group();
    robotGroupRef.current = robotGroup;
    scene.add(robotGroup);

    const headGroup = new THREE.Group();
    headGroupRef.current = headGroup;
    robotGroup.add(headGroup);

    // Track materials for wireframe toggles
    const trackMaterial = <T extends THREE.Material>(mat: T): T => {
      materialsRef.current.push(mat);
      return mat;
    };

    // --- A. Robot Head Base Mesh (Soft Porcelain White) ---
    const headGeo = new THREE.SphereGeometry(0.72, 32, 28);
    headGeo.scale(1.0, 0.92, 0.94);
    const headMat = trackMaterial(new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.12,
      roughness: 0.35,
      wireframe: wireframeMode
    }));
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headGroup.add(headMesh);

    // --- B. Visor Face Display (Smoked Slate Crystal) ---
    const visorGeo = new THREE.CylinderGeometry(0.56, 0.54, 0.44, 32, 1, false, -Math.PI / 2.4, Math.PI / 1.2);
    visorGeo.rotateY(Math.PI / 2);
    const visorMat = trackMaterial(new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.3,
      roughness: 0.2,
      wireframe: wireframeMode
    }));
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 0.04, 0.26);
    headGroup.add(visorMesh);

    // --- C. Clean Digital Eyes (Gentle Soft Light - Non-Neon) ---
    const eyeGeo = new THREE.BoxGeometry(0.15, 0.07, 0.04);
    const eyeMat = trackMaterial(new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      emissive: 0xe2e8f0,
      emissiveIntensity: 0.55,
      roughness: 0.2,
      wireframe: wireframeMode
    }));

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.21, 0.07, 0.65);
    leftEyeRef.current = leftEye;
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat.clone());
    rightEye.position.set(0.21, 0.07, 0.65);
    rightEyeRef.current = rightEye;
    headGroup.add(rightEye);

    // --- D. Mouth Waveform Equalizer (Soft Slate Bars) ---
    const mouthBars: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const barGeo = new THREE.BoxGeometry(0.06, 0.03, 0.02);
      const barMat = trackMaterial(new THREE.MeshStandardMaterial({
        color: 0x64748b,
        emissive: 0x94a3b8,
        emissiveIntensity: 0.35,
        wireframe: wireframeMode
      }));
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set((i - 1) * 0.1, -0.09, 0.64);
      mouthBars.push(bar);
      headGroup.add(bar);
    }
    mouthBarRefs.current = mouthBars;

    // --- E. Sleek Antenna Stem & Light Beacon Bulb ---
    const stemGeo = new THREE.CylinderGeometry(0.025, 0.035, 0.32, 16);
    const stemMat = trackMaterial(new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.5,
      roughness: 0.3,
      wireframe: wireframeMode
    }));
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    stemMesh.position.set(0, 0.78, 0);
    headGroup.add(stemMesh);

    const bulbGeo = new THREE.SphereGeometry(0.09, 24, 24);
    const bulbMat = trackMaterial(new THREE.MeshStandardMaterial({
      color: 0xdbeafe,
      emissive: 0xbfdbfe,
      emissiveIntensity: 0.45,
      wireframe: wireframeMode
    }));
    const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
    bulbMesh.position.set(0, 0.94, 0);
    antennaBulbRef.current = bulbMesh;
    headGroup.add(bulbMesh);

    // --- F. High-Tech Ear Pods (Acoustic Sensors) ---
    const earGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.16, 24);
    earGeo.rotateZ(Math.PI / 2);
    const earMat = trackMaterial(new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.15,
      roughness: 0.4,
      wireframe: wireframeMode
    }));

    const leftEar = new THREE.Mesh(earGeo, earMat);
    leftEar.position.set(-0.74, 0.04, 0);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, earMat);
    rightEar.position.set(0.74, 0.04, 0);
    headGroup.add(rightEar);

    // Satin Titanium Ear Rings
    const ringGeo = new THREE.TorusGeometry(0.12, 0.02, 16, 32);
    ringGeo.rotateY(Math.PI / 2);
    const ringMat = trackMaterial(new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.6,
      roughness: 0.25,
      emissive: 0xcbd5e1,
      emissiveIntensity: 0.2,
      wireframe: wireframeMode
    }));
    const leftRing = new THREE.Mesh(ringGeo, ringMat);
    leftRing.position.set(-0.82, 0.04, 0);
    headGroup.add(leftRing);

    const rightRing = new THREE.Mesh(ringGeo, ringMat);
    rightRing.position.set(0.82, 0.04, 0);
    headGroup.add(rightRing);

    // --- G. Articulated Neck & Collar ---
    const neckGeo = new THREE.CylinderGeometry(0.24, 0.30, 0.22, 20);
    const neckMat = trackMaterial(new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.25,
      roughness: 0.45,
      wireframe: wireframeMode
    }));
    const neckMesh = new THREE.Mesh(neckGeo, neckMat);
    neckMesh.position.set(0, -0.74, 0);
    robotGroup.add(neckMesh);

    // --- H. Satin Porcelain Torso & Central Optical Core ---
    const chestGeo = new THREE.ConeGeometry(0.64, 0.65, 32);
    chestGeo.rotateX(Math.PI);
    chestGeo.scale(1.0, 0.8, 0.6);
    const chestMat = trackMaterial(new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.12,
      roughness: 0.35,
      wireframe: wireframeMode
    }));
    const chestMesh = new THREE.Mesh(chestGeo, chestMat);
    chestMesh.position.set(0, -1.05, 0);
    robotGroup.add(chestMesh);

    // Subtle Optical Core (Non-Neon)
    const reactorGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 24);
    reactorGeo.rotateX(Math.PI / 2);
    const reactorMat = trackMaterial(new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      emissive: 0xe2e8f0,
      emissiveIntensity: 0.45,
      wireframe: wireframeMode
    }));
    const reactorMesh = new THREE.Mesh(reactorGeo, reactorMat);
    reactorMesh.position.set(0, -0.98, 0.28);
    coreReactorRef.current = reactorMesh;
    robotGroup.add(reactorMesh);

    // --- I. Floating Magnetic Shoulder Pods ---
    const shoulderGeo = new THREE.SphereGeometry(0.22, 16, 16);
    shoulderGeo.scale(1.2, 0.6, 0.8);
    const shoulderMat = trackMaterial(new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.15,
      roughness: 0.35,
      wireframe: wireframeMode
    }));

    const leftShoulder = new THREE.Mesh(shoulderGeo, shoulderMat);
    leftShoulder.position.set(-0.76, -0.92, 0);
    leftShoulderRef.current = leftShoulder;
    robotGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderGeo, shoulderMat);
    rightShoulder.position.set(0.76, -0.92, 0);
    rightShoulderRef.current = rightShoulder;
    robotGroup.add(rightShoulder);

    // 5. Mouse & Touch Interaction Handlers
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDragging.current) {
        const deltaX = clientX - dragStart.current.x;
        const deltaY = clientY - dragStart.current.y;
        manualRotation.current.y += deltaX * 0.01;
        manualRotation.current.x += deltaY * 0.01;
        dragStart.current = { x: clientX, y: clientY };
      } else {
        const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);
        mousePos.current = { x: nx, y: ny };
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      isDragging.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      dragStart.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    if (interactive) {
      container.addEventListener('mousemove', handlePointerMove);
      container.addEventListener('mousedown', handlePointerDown);
      window.addEventListener('mouseup', handlePointerUp);
      container.addEventListener('touchmove', handlePointerMove, { passive: true });
      container.addEventListener('touchstart', handlePointerDown, { passive: true });
      window.addEventListener('touchend', handlePointerUp);
    }

    // 6. Animation Loop (Smooth 60 FPS Physical Simulation)
    const clock = new THREE.Clock();
    let blinkTimer = 0;
    let nextBlink = 3.5;

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Natural Calm Breathing & Floating
      const floatY = Math.sin(elapsedTime * 2.0) * 0.05;
      robotGroup.position.y = floatY + 0.15;

      // Magnetic Shoulder Counter-float
      if (leftShoulderRef.current && rightShoulderRef.current) {
        leftShoulderRef.current.position.y = -0.92 + Math.cos(elapsedTime * 1.8) * 0.02;
        rightShoulderRef.current.position.y = -0.92 + Math.cos(elapsedTime * 1.8) * 0.02;
      }

      // Smooth Head Tracking Interpolation toward Mouse
      const targetLookX = mousePos.current.y * 0.4 + manualRotation.current.x;
      const targetLookY = mousePos.current.x * 0.6 + manualRotation.current.y;

      if (headGroupRef.current) {
        headGroupRef.current.rotation.x += (targetLookX - headGroupRef.current.rotation.x) * 0.1;
        headGroupRef.current.rotation.y += (targetLookY - headGroupRef.current.rotation.y) * 0.1;
        headGroupRef.current.rotation.z = Math.sin(elapsedTime * 1.2) * 0.015;
      }

      // Eye Blinking Logic
      blinkTimer += 0.016;
      if (blinkTimer > nextBlink) {
        if (leftEyeRef.current && rightEyeRef.current) {
          leftEyeRef.current.scale.y = 0.1;
          rightEyeRef.current.scale.y = 0.1;
        }
        if (blinkTimer > nextBlink + 0.14) {
          blinkTimer = 0;
          nextBlink = 3.0 + Math.random() * 3.0;
          if (leftEyeRef.current && rightEyeRef.current) {
            leftEyeRef.current.scale.y = 1.0;
            rightEyeRef.current.scale.y = 1.0;
          }
        }
      }

      // State-Driven Reactive Dynamics (Soft Non-Neon Colors)
      if (antennaBulbRef.current && coreReactorRef.current) {
        const bulbMat = antennaBulbRef.current.material as THREE.MeshStandardMaterial;
        const reactorMat = coreReactorRef.current.material as THREE.MeshStandardMaterial;

        if (state === 'listening') {
          // Soft Coral/Rose for Listening
          const pulse = (Math.sin(elapsedTime * 6) + 1) * 0.5;
          bulbMat.color.setHex(0xfb7185);
          bulbMat.emissive.setHex(0xfecdd3);
          bulbMat.emissiveIntensity = 0.5 + pulse * 0.35;
          reactorMat.color.setHex(0xfb7185);
          reactorMat.emissive.setHex(0xfecdd3);
          reactorMat.emissiveIntensity = 0.45 + pulse * 0.3;

          // Sound reception subtle bar oscillation
          mouthBarRefs.current.forEach((bar, idx) => {
            bar.scale.y = 1.0 + Math.sin(elapsedTime * 10 + idx) * 0.8;
          });
        } else if (state === 'thinking') {
          // Warm Honey/Amber for Thinking
          const pulse = (Math.sin(elapsedTime * 4) + 1) * 0.5;
          bulbMat.color.setHex(0xf59e0b);
          bulbMat.emissive.setHex(0xfef08a);
          bulbMat.emissiveIntensity = 0.5 + pulse * 0.35;
          reactorMat.color.setHex(0xf59e0b);
          reactorMat.emissive.setHex(0xfef08a);
          reactorMat.emissiveIntensity = 0.45 + pulse * 0.3;

          if (headGroupRef.current) {
            headGroupRef.current.rotation.z += Math.sin(elapsedTime * 2.5) * 0.01;
          }
        } else if (state === 'speaking') {
          // Soft Periwinkle for Speaking
          const pulse = (Math.sin(elapsedTime * 8) + 1) * 0.5;
          bulbMat.color.setHex(0x818cf8);
          bulbMat.emissive.setHex(0xc7d2fe);
          bulbMat.emissiveIntensity = 0.55 + pulse * 0.3;
          reactorMat.color.setHex(0x818cf8);
          reactorMat.emissive.setHex(0xc7d2fe);
          reactorMat.emissiveIntensity = 0.5 + pulse * 0.3;

          mouthBarRefs.current.forEach((bar, idx) => {
            bar.scale.y = 1.0 + Math.abs(Math.sin(elapsedTime * 12 + idx * 1.5)) * 1.8;
          });
        } else {
          // Idle: Calm Soft Sky Pearl
          const pulse = (Math.sin(elapsedTime * 1.8) + 1) * 0.5;
          bulbMat.color.setHex(0xdbeafe);
          bulbMat.emissive.setHex(0xbfdbfe);
          bulbMat.emissiveIntensity = 0.4 + pulse * 0.2;
          reactorMat.color.setHex(0xcbd5e1);
          reactorMat.emissive.setHex(0xe2e8f0);
          reactorMat.emissiveIntensity = 0.35 + pulse * 0.15;

          mouthBarRefs.current.forEach((bar) => {
            bar.scale.y = 1.0;
          });
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup on Unmount
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (interactive) {
        container.removeEventListener('mousemove', handlePointerMove);
        container.removeEventListener('mousedown', handlePointerDown);
        window.removeEventListener('mouseup', handlePointerUp);
        container.removeEventListener('touchmove', handlePointerMove);
        container.removeEventListener('touchstart', handlePointerDown);
        window.removeEventListener('touchend', handlePointerUp);
      }
      renderer.dispose();
      materialsRef.current.forEach(m => m.dispose());
      container.innerHTML = '';
    };
  }, [size, interactive]);

  // Update Wireframe status dynamically
  useEffect(() => {
    materialsRef.current.forEach((mat) => {
      if ('wireframe' in mat) {
        (mat as any).wireframe = wireframeMode;
      }
    });
  }, [wireframeMode]);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* 3D Canvas Mounting Surface */}
      <div
        ref={mountRef}
        className="cursor-grab active:cursor-grabbing transition-transform duration-200"
        title="Interactive 3D Robot Co-Pilot: Move cursor to look, drag to rotate!"
      />

      {/* Subtle Natural Ambient Backdrop */}
      <div className="absolute inset-0 -z-10 rounded-full bg-slate-100/60 blur-xl pointer-events-none scale-90" />

      {/* Optional Interactive Wireframe / CAD Mode Controls */}
      {showControls && (
        <div className="flex items-center gap-1.5 mt-1">
          {onToggleWireframe && (
            <button
              type="button"
              onClick={onToggleWireframe}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all border cursor-pointer ${
                wireframeMode
                  ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
              }`}
              title="Toggle 3D CAD Wireframe View"
            >
              {wireframeMode ? '3D Solid' : 'CAD Mesh'}
            </button>
          )}
          <span className="text-[10px] font-mono text-slate-500 capitalize">
            {state}
          </span>
        </div>
      )}
    </div>
  );
};
