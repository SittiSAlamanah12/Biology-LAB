import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { BioModelInfo, HotspotPart } from '../types/biology';
import { sound } from '../utils/audio';
import {
  RotateCcw,
  Play,
  Pause,
  Eye,
  Layers,
  Sparkles,
  Maximize2,
  Volume2,
  VolumeX,
  Zap,
  Info,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

interface ThreeViewerProps {
  model: BioModelInfo;
  selectedPart: HotspotPart | null;
  onSelectPart: (part: HotspotPart | null) => void;
}

export const ThreeViewer: React.FC<ThreeViewerProps> = ({
  model,
  selectedPart,
  onSelectPart,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Dynamic interactive states
  const [autoRotate, setAutoRotate] = useState(true);
  const [isExploded, setIsExploded] = useState(false);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isPlayingAnim, setIsPlayingAnim] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'parts' | 'facts'>('info');

  // Interactive mouse drag control refs
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraDistanceRef = useRef(4.8);
  const rotationVelocityRef = useRef({ x: 0, y: 0 });

  // References for model-specific animations
  const animatedPartsRef = useRef<{
    heartGroup?: THREE.Group;
    lungGroup?: THREE.Group;
    neuronSignal?: THREE.Mesh[];
    flagellum?: THREE.Mesh;
    chloroplasts?: THREE.Mesh[];
    explodables?: { mesh: THREE.Object3D; originalPos: THREE.Vector3; explodeDir: THREE.Vector3 }[];
  }>({});

  // Heartbeat sound interval reference
  const heartbeatTimerRef = useRef<number | null>(null);

  // Initialize and rebuild Three.js scene when model changes
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 520;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x070b14);

    // Subtle atmospheric space grid & stars
    const gridHelper = new THREE.GridHelper(10, 20, 0x1e293b, 0x0f172a);
    gridHelper.position.y = -2.2;
    scene.add(gridHelper);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.0, cameraDistanceRef.current);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    // Clear previous children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(5, 8, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight2.position.set(-5, -2, -4);
    scene.add(dirLight2);

    const rimLight = new THREE.PointLight(0x10b981, 2.0, 10);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // 5. Build procedural 3D model
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    animatedPartsRef.current = { explodables: [] };

    buildBiologicalModel(model.id, modelGroup, animatedPartsRef.current);

    // 6. Resize handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight || 520;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // 7. Render Loop
    let clock = new THREE.Clock();
    let animTime = 0;

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      animTime += delta;

      if (modelGroupRef.current) {
        // Auto-rotation inertia
        if (autoRotate && !isDraggingRef.current) {
          modelGroupRef.current.rotation.y += 0.007;
        }

        // Apply drag damping
        if (!isDraggingRef.current) {
          modelGroupRef.current.rotation.y += rotationVelocityRef.current.y;
          modelGroupRef.current.rotation.x += rotationVelocityRef.current.x;
          rotationVelocityRef.current.x *= 0.92;
          rotationVelocityRef.current.y *= 0.92;
        }

        // Specific biological animations
        if (isPlayingAnim) {
          // Heart pulsatile beat
          if (animatedPartsRef.current.heartGroup) {
            const beatPhase = (animTime * 4.5) % Math.PI;
            const pulse = 1 + Math.sin(beatPhase * 2) * 0.05 * Math.max(0, Math.sin(beatPhase));
            animatedPartsRef.current.heartGroup.scale.set(pulse, pulse, pulse);
          }

          // Lung breathing rhythm
          if (animatedPartsRef.current.lungGroup) {
            const breath = 1 + Math.sin(animTime * 1.8) * 0.07;
            animatedPartsRef.current.lungGroup.scale.set(breath, breath * 1.03, breath);
          }

          // Neuron Action Potential pulses traveling
          if (animatedPartsRef.current.neuronSignal) {
            animatedPartsRef.current.neuronSignal.forEach((mesh, index) => {
              const offset = (animTime * 2.5 + index * 0.8) % 3.0;
              mesh.position.x = -1.2 + offset;
              const mat = mesh.material as THREE.MeshBasicMaterial;
              mat.opacity = Math.sin((offset / 3.0) * Math.PI) * 0.9;
            });
          }

          // Flagellum undulating wave
          if (animatedPartsRef.current.flagellum) {
            animatedPartsRef.current.flagellum.rotation.z = Math.sin(animTime * 8) * 0.3;
          }

          // Chloroplast gentle glow pulsation
          if (animatedPartsRef.current.chloroplasts) {
            animatedPartsRef.current.chloroplasts.forEach((chloro, idx) => {
              chloro.rotation.y += 0.01 * (idx % 2 === 0 ? 1 : -1);
            });
          }
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
      }
    };
  }, [model.id, autoRotate, isPlayingAnim]);

  // Heartbeat sound loop for Heart model
  useEffect(() => {
    if (model.id === 'jantung' && soundEnabled && isPlayingAnim) {
      heartbeatTimerRef.current = window.setInterval(() => {
        sound.playHeartbeat();
      }, 1400);
    } else {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
      }
    }
    return () => {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
      }
    };
  }, [model.id, soundEnabled, isPlayingAnim]);

  // Handle Explode / Dissect view
  useEffect(() => {
    const explodables = animatedPartsRef.current.explodables;
    if (!explodables) return;

    explodables.forEach(({ mesh, originalPos, explodeDir }) => {
      if (isExploded) {
        mesh.position.copy(originalPos).add(explodeDir.clone().multiplyScalar(0.7));
      } else {
        mesh.position.copy(originalPos);
      }
    });
  }, [isExploded]);

  // Handle Wireframe mode toggle
  useEffect(() => {
    if (!modelGroupRef.current) return;
    modelGroupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => {
            if ('wireframe' in m) m.wireframe = isWireframe;
          });
        } else if ('wireframe' in mesh.material) {
          (mesh.material as THREE.MeshStandardMaterial).wireframe = isWireframe;
        }
      }
    });
  }, [isWireframe]);

  // Focus on Selected Part with smooth highlight
  useEffect(() => {
    if (!modelGroupRef.current) return;

    modelGroupRef.current.traverse((child) => {
      if (child.userData && child.userData.partId) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat && mat.emissive) {
          if (selectedPart && child.userData.partId === selectedPart.id) {
            mat.emissive.setHex(0x10b981);
            mat.emissiveIntensity = 0.85;
          } else {
            mat.emissive.setHex(0x000000);
            mat.emissiveIntensity = 0;
          }
        }
      }
    });
  }, [selectedPart]);

  // Interactive mouse/touch handlers for orbiting
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !modelGroupRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    rotationVelocityRef.current = {
      x: deltaY * 0.006,
      y: deltaX * 0.006,
    };

    modelGroupRef.current.rotation.y += deltaX * 0.008;
    modelGroupRef.current.rotation.x += deltaY * 0.008;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!cameraRef.current) return;
    const newDist = Math.max(2.2, Math.min(8.0, cameraDistanceRef.current + e.deltaY * 0.004));
    cameraDistanceRef.current = newDist;
    cameraRef.current.position.z = newDist;
  };

  // Touch handlers for mobile/tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !modelGroupRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
    const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

    modelGroupRef.current.rotation.y += deltaX * 0.01;
    modelGroupRef.current.rotation.x += deltaY * 0.01;

    previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Reset Camera View
  const handleResetCamera = () => {
    sound.playClick();
    if (modelGroupRef.current && cameraRef.current) {
      modelGroupRef.current.rotation.set(0, 0, 0);
      cameraDistanceRef.current = 4.8;
      cameraRef.current.position.set(0, 1.0, 4.8);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  // Trigger pulse or neuron synapse zap
  const handleTriggerImpulse = () => {
    if (model.id === 'sel-neuron') {
      sound.playSynapseZap();
    } else {
      sound.playHeartbeat();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* 3D Canvas Box */}
      <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl relative">
        {/* Top Floating Badge & Navigation */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
          <span className="bg-slate-950/80 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-medium tracking-wide flex items-center gap-1.5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            3D Interactive Viewer
          </span>
          <span className="bg-slate-950/80 text-slate-300 border border-slate-700/50 text-xs px-2.5 py-1 rounded-full backdrop-blur-md">
            Kelas {model.grade} SMA
          </span>
          <span className="bg-slate-950/80 text-slate-300 border border-slate-700/50 text-xs px-2.5 py-1 rounded-full backdrop-blur-md">
            {model.category === 'organ' ? 'Organ Tubuh' : 'Biologi Seluler'}
          </span>
        </div>

        {/* 3D Viewport Controls (Top Right) */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-lg">
          <button
            onClick={() => {
              sound.playClick();
              setAutoRotate(!autoRotate);
            }}
            title={autoRotate ? 'Hentikan Putaran Otomatis' : 'Mulai Putaran Otomatis'}
            className={`p-2 rounded-lg text-xs flex items-center gap-1 transition ${
              autoRotate ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <RotateCcw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setIsPlayingAnim(!isPlayingAnim);
            }}
            title={isPlayingAnim ? 'Jeda Animasi Fisiologis' : 'Putar Animasi Fisiologis'}
            className={`p-2 rounded-lg text-xs transition ${
              isPlayingAnim ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isPlayingAnim ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setIsWireframe(!isWireframe);
            }}
            title={isWireframe ? 'Mode Solid' : 'Mode Rangka / Wireframe'}
            className={`p-2 rounded-lg text-xs transition ${
              isWireframe ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          {model.interactiveControls?.hasExplodeView && (
            <button
              onClick={() => {
                sound.playClick();
                setIsExploded(!isExploded);
              }}
              title={isExploded ? 'Satukan Struktur' : 'Urai Struktur (Explode/Dissect View)'}
              className={`p-2 rounded-lg text-xs transition ${
                isExploded ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              const muted = sound.toggleMute();
              setSoundEnabled(!muted);
            }}
            title={soundEnabled ? 'Matikan Suara Fisiologis' : 'Aktifkan Suara Fisiologis'}
            className="p-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={handleResetCamera}
            title="Reset Sudut Pandang"
            className="p-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Action Trigger Button for specific models */}
        {(model.id === 'jantung' || model.id === 'sel-neuron') && (
          <div className="absolute bottom-4 left-4 z-10">
            <button
              onClick={handleTriggerImpulse}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-emerald-950/40 flex items-center gap-2 border border-emerald-400/30 transition transform hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 text-yellow-300" />
              {model.id === 'sel-neuron' ? 'Uji Rambatan Impuls Listrik' : 'Dengarkan Pompa Jantung (Lub-Dub)'}
            </button>
          </div>
        )}

        {/* Hotspot Floating Chips on Bottom Right of Canvas */}
        <div className="absolute bottom-4 right-4 z-10 max-w-[280px] bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300">
          <p className="font-semibold text-slate-100 mb-1 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-emerald-400" /> Navigasi Hotspot 3D
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Klik dan geser mouse/layar sentuh untuk memutar model 360°. Scroll untuk perbesar/perkecil.
          </p>
        </div>

        {/* Canvas DOM Element Container */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full h-[520px] cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* Side Pedagogical Anatomical Panel */}
      <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800/80 p-5 shadow-2xl flex flex-col space-y-4">
        {/* Title & Topic Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            {model.curriculumTopic}
          </div>
          <h2 className="text-xl font-bold text-slate-50 tracking-tight">{model.name}</h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{model.summary}</p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-1.5 px-2 rounded-lg font-medium transition ${
              activeTab === 'info' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Deskripsi
          </button>
          <button
            onClick={() => setActiveTab('parts')}
            className={`py-1.5 px-2 rounded-lg font-medium transition ${
              activeTab === 'parts' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bagian ({model.parts.length})
          </button>
          <button
            onClick={() => setActiveTab('facts')}
            className={`py-1.5 px-2 rounded-lg font-medium transition ${
              activeTab === 'facts' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Fakta & Ujian
          </button>
        </div>

        {/* Tab Content 1: Main Info */}
        {activeTab === 'info' && (
          <div className="space-y-3.5 text-xs text-slate-300">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <h4 className="font-semibold text-slate-100 mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-400" />
                Mekanisme Biologis SMA
              </h4>
              <p className="text-slate-300 leading-relaxed">{model.description}</p>
            </div>

            {model.keyMolecules && (
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <p className="font-semibold text-slate-200 mb-2">Molekul & Zat Kunci:</p>
                <div className="flex flex-wrap gap-1.5">
                  {model.keyMolecules.map((mol, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-800/90 text-slate-200 px-2.5 py-1 rounded-md text-[11px] font-mono border border-slate-700/60"
                    >
                      {mol}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 2: Parts / Organelles Hotspots */}
        {activeTab === 'parts' && (
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            <p className="text-[11px] text-slate-400 mb-1">
              Pilih bagian untuk menyorot lokasinya pada model 3D:
            </p>
            {model.parts.map((part) => {
              const isSelected = selectedPart?.id === part.id;
              return (
                <div
                  key={part.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectPart(isSelected ? null : part);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition text-xs ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500/70 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-100 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: part.color || '#10b981' }}
                      />
                      {part.name}
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 text-slate-400 transition transform ${
                        isSelected ? 'rotate-90 text-emerald-400' : ''
                      }`}
                    />
                  </div>
                  {part.latinName && (
                    <p className="text-[11px] text-emerald-400/90 italic font-mono mt-0.5">
                      {part.latinName}
                    </p>
                  )}
                  <p className="text-slate-300 mt-1.5 leading-relaxed text-[11.5px]">{part.functionDesc}</p>

                  {/* Expanded Detail when active */}
                  {isSelected && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-800 space-y-2">
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        <strong className="text-slate-200">Detail Struktur:</strong> {part.detail}
                      </p>
                      {part.clinicalNote && (
                        <div className="p-2 bg-rose-950/30 border border-rose-900/40 rounded-lg text-rose-200 text-[11px]">
                          <strong>Korelasi Medis/Kelainan SMA:</strong> {part.clinicalNote}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab Content 3: Quick Facts & Exam Hints */}
        {activeTab === 'facts' && (
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 text-xs">
            {model.facts.map((fact, idx) => (
              <div
                key={idx}
                className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5"
              >
                <span className="bg-emerald-500/20 text-emerald-400 font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">
                  {idx + 1}
                </span>
                <p className="text-slate-300 leading-relaxed text-[11.5px]">{fact}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// PROCEDURAL THREE.JS BIOLOGICAL BUILDERS
// Creates intricate, high-aesthetic 3D anatomical and cellular models
// =========================================================================
function buildBiologicalModel(
  modelId: string,
  parentGroup: THREE.Group,
  animRef: {
    heartGroup?: THREE.Group;
    lungGroup?: THREE.Group;
    neuronSignal?: THREE.Mesh[];
    flagellum?: THREE.Mesh;
    chloroplasts?: THREE.Mesh[];
    explodables?: { mesh: THREE.Object3D; originalPos: THREE.Vector3; explodeDir: THREE.Vector3 }[];
  }
) {
  switch (modelId) {
    case 'jantung':
      buildHeartModel(parentGroup, animRef);
      break;
    case 'otak':
      buildBrainModel(parentGroup, animRef);
      break;
    case 'paru-paru':
      buildLungsModel(parentGroup, animRef);
      break;
    case 'ginjal':
      buildKidneyModel(parentGroup, animRef);
      break;
    case 'sel-hewan':
      buildAnimalCellModel(parentGroup, animRef);
      break;
    case 'sel-tumbuhan':
      buildPlantCellModel(parentGroup, animRef);
      break;
    case 'sel-neuron':
      buildNeuronModel(parentGroup, animRef);
      break;
    case 'sel-bakteri':
      buildBacterialModel(parentGroup, animRef);
      break;
    default:
      buildHeartModel(parentGroup, animRef);
  }
}

// 1. JANTUNG (Human Heart 3D)
function buildHeartModel(
  parentGroup: THREE.Group,
  animRef: {
    heartGroup?: THREE.Group;
    explodables?: { mesh: THREE.Object3D; originalPos: THREE.Vector3; explodeDir: THREE.Vector3 }[];
  }
) {
  const heartGroup = new THREE.Group();
  parentGroup.add(heartGroup);
  animRef.heartGroup = heartGroup;

  // Ventricle main muscular mass (Left and Right ventricles)
  const leftVentricleGeo = new THREE.SphereGeometry(1.05, 32, 24);
  leftVentricleGeo.scale(0.85, 1.25, 0.9);
  const leftVentricleMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    roughness: 0.35,
    metalness: 0.1,
  });
  const leftVent = new THREE.Mesh(leftVentricleGeo, leftVentricleMat);
  leftVent.position.set(0.35, -0.4, 0);
  leftVent.rotation.z = -0.25;
  leftVent.userData = { partId: 'ventrikel-sinister' };
  heartGroup.add(leftVent);

  const rightVentGeo = new THREE.SphereGeometry(0.88, 32, 24);
  rightVentGeo.scale(0.8, 1.15, 0.85);
  const rightVentMat = new THREE.MeshStandardMaterial({
    color: 0x2563eb,
    roughness: 0.4,
    metalness: 0.1,
  });
  const rightVent = new THREE.Mesh(rightVentGeo, rightVentMat);
  rightVent.position.set(-0.45, -0.35, 0.2);
  rightVent.rotation.z = 0.15;
  rightVent.userData = { partId: 'ventrikel-dexter' };
  heartGroup.add(rightVent);

  // Right Atrium
  const rightAtriumGeo = new THREE.SphereGeometry(0.75, 28, 20);
  const rightAtriumMat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    roughness: 0.4,
  });
  const rightAtrium = new THREE.Mesh(rightAtriumGeo, rightAtriumMat);
  rightAtrium.position.set(-0.95, 0.55, 0.1);
  rightAtrium.userData = { partId: 'atrium-dexter' };
  heartGroup.add(rightAtrium);

  // Aorta Arch (Arcus Aortae)
  const aortaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.1, 0.2, 0.1),
    new THREE.Vector3(0.15, 1.2, 0.2),
    new THREE.Vector3(-0.1, 1.75, 0.1),
    new THREE.Vector3(-0.6, 1.5, -0.3),
    new THREE.Vector3(-0.7, 0.4, -0.5),
  ]);
  const aortaGeo = new THREE.TubeGeometry(aortaCurve, 40, 0.32, 16, false);
  const aortaMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.28,
  });
  const aortaMesh = new THREE.Mesh(aortaGeo, aortaMat);
  aortaMesh.userData = { partId: 'aorta' };
  heartGroup.add(aortaMesh);

  // 3 Aortic branch pipes (Brachiocephalic, Carotid, Subclavian)
  const branchCoords = [
    { pos: new THREE.Vector3(0.05, 1.7, 0.15), rot: 0.15 },
    { pos: new THREE.Vector3(-0.18, 1.75, 0.05), rot: -0.1 },
    { pos: new THREE.Vector3(-0.38, 1.68, -0.1), rot: -0.25 },
  ];
  branchCoords.forEach((b) => {
    const branchGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.5, 12);
    const branchMesh = new THREE.Mesh(branchGeo, aortaMat);
    branchMesh.position.copy(b.pos);
    branchMesh.rotation.z = b.rot;
    heartGroup.add(branchMesh);
  });

  // Pulmonary Artery (Truncus Pulmonalis)
  const pulmoCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.25, 0.2, 0.35),
    new THREE.Vector3(-0.2, 0.9, 0.4),
    new THREE.Vector3(0.2, 1.25, 0.1),
    new THREE.Vector3(0.9, 1.2, -0.2),
  ]);
  const pulmoGeo = new THREE.TubeGeometry(pulmoCurve, 32, 0.26, 16, false);
  const pulmoMat = new THREE.MeshStandardMaterial({
    color: 0x60a5fa,
    roughness: 0.35,
  });
  const pulmoMesh = new THREE.Mesh(pulmoGeo, pulmoMat);
  pulmoMesh.userData = { partId: 'arteri-pulmonalis' };
  heartGroup.add(pulmoMesh);

  // Vena Cava Superior and Inferior
  const venaGeo = new THREE.CylinderGeometry(0.22, 0.22, 1.8, 16);
  const venaMat = new THREE.MeshStandardMaterial({
    color: 0x1d4ed8,
    roughness: 0.35,
  });
  const venaMesh = new THREE.Mesh(venaGeo, venaMat);
  venaMesh.position.set(-1.15, 0.6, -0.4);
  venaMesh.userData = { partId: 'vena-cava' };
  heartGroup.add(venaMesh);

  // Register explodables
  if (animRef.explodables) {
    animRef.explodables.push(
      { mesh: leftVent, originalPos: leftVent.position.clone(), explodeDir: new THREE.Vector3(0.8, -0.4, 0.2) },
      { mesh: rightVent, originalPos: rightVent.position.clone(), explodeDir: new THREE.Vector3(-0.8, -0.4, 0.2) },
      { mesh: rightAtrium, originalPos: rightAtrium.position.clone(), explodeDir: new THREE.Vector3(-0.9, 0.6, 0) },
      { mesh: aortaMesh, originalPos: aortaMesh.position.clone(), explodeDir: new THREE.Vector3(0, 0.9, 0) }
    );
  }
}

// 2. OTAK (Human Brain 3D)
function buildBrainModel(
  parentGroup: THREE.Group,
  animRef: {
    explodables?: { mesh: THREE.Object3D; originalPos: THREE.Vector3; explodeDir: THREE.Vector3 }[];
  }
) {
  const brainGroup = new THREE.Group();
  parentGroup.add(brainGroup);

  // Frontal Lobe (Yellow / Amber)
  const frontalGeo = new THREE.SphereGeometry(1.0, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
  frontalGeo.scale(1.1, 0.9, 0.95);
  const frontalMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.45,
    bumpScale: 0.05,
  });
  const frontalMesh = new THREE.Mesh(frontalGeo, frontalMat);
  frontalMesh.position.set(0, 0.5, 0.5);
  frontalMesh.userData = { partId: 'lobus-frontalis' };
  brainGroup.add(frontalMesh);

  // Parietal Lobe (Purple)
  const parietalGeo = new THREE.SphereGeometry(0.95, 32, 24);
  parietalGeo.scale(1.05, 0.85, 0.9);
  const parietalMat = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    roughness: 0.45,
  });
  const parietalMesh = new THREE.Mesh(parietalGeo, parietalMat);
  parietalMesh.position.set(0, 0.8, -0.4);
  parietalMesh.userData = { partId: 'lobus-parietalis' };
  brainGroup.add(parietalMesh);

  // Occipital Lobe (Pink / Red)
  const occipitalGeo = new THREE.SphereGeometry(0.75, 28, 20);
  occipitalGeo.scale(0.9, 0.75, 0.85);
  const occipitalMat = new THREE.MeshStandardMaterial({
    color: 0xec4899,
    roughness: 0.45,
  });
  const occipitalMesh = new THREE.Mesh(occipitalGeo, occipitalMat);
  occipitalMesh.position.set(0, 0.2, -1.2);
  occipitalMesh.userData = { partId: 'lobus-occipitalis' };
  brainGroup.add(occipitalMesh);

  // Temporal Lobes (Green - Left & Right)
  const tempMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    roughness: 0.45,
  });
  [-0.95, 0.95].forEach((xSide) => {
    const tempGeo = new THREE.SphereGeometry(0.65, 24, 18);
    tempGeo.scale(0.7, 0.8, 1.1);
    const tempMesh = new THREE.Mesh(tempGeo, tempMat);
    tempMesh.position.set(xSide, -0.05, 0.1);
    tempMesh.userData = { partId: 'lobus-temporalis' };
    brainGroup.add(tempMesh);
  });

  // Cerebellum (Cyan / Horizontally striate)
  const cereGeo = new THREE.SphereGeometry(0.7, 28, 20);
  cereGeo.scale(1.2, 0.65, 0.8);
  const cereMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    roughness: 0.5,
  });
  const cereMesh = new THREE.Mesh(cereGeo, cereMat);
  cereMesh.position.set(0, -0.7, -0.85);
  cereMesh.userData = { partId: 'cerebellum' };
  brainGroup.add(cereMesh);

  // Brainstem (Pons & Medulla Oblongata)
  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -0.3, -0.2),
    new THREE.Vector3(0, -0.8, -0.15),
    new THREE.Vector3(0, -1.6, -0.1),
  ]);
  const stemGeo = new THREE.TubeGeometry(stemCurve, 20, 0.32, 16, false);
  const stemMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.4,
  });
  const stemMesh = new THREE.Mesh(stemGeo, stemMat);
  stemMesh.userData = { partId: 'batang-otak' };
  brainGroup.add(stemMesh);

  // Register explodables
  if (animRef.explodables) {
    animRef.explodables.push(
      { mesh: frontalMesh, originalPos: frontalMesh.position.clone(), explodeDir: new THREE.Vector3(0, 0.6, 0.8) },
      { mesh: parietalMesh, originalPos: parietalMesh.position.clone(), explodeDir: new THREE.Vector3(0, 0.8, -0.4) },
      { mesh: occipitalMesh, originalPos: occipitalMesh.position.clone(), explodeDir: new THREE.Vector3(0, 0.1, -1.0) },
      { mesh: cereMesh, originalPos: cereMesh.position.clone(), explodeDir: new THREE.Vector3(0, -0.8, -0.7) },
      { mesh: stemMesh, originalPos: stemMesh.position.clone(), explodeDir: new THREE.Vector3(0, -0.9, 0) }
    );
  }
}

// 3. PARU-PARU (Lungs & Respiratory Tree)
function buildLungsModel(
  parentGroup: THREE.Group,
  animRef: {
    lungGroup?: THREE.Group;
    explodables?: { mesh: THREE.Object3D; originalPos: THREE.Vector3; explodeDir: THREE.Vector3 }[];
  }
) {
  const lungGroup = new THREE.Group();
  parentGroup.add(lungGroup);
  animRef.lungGroup = lungGroup;

  // Trachea with cartilage rings
  const tracheaGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.4, 20);
  const tracheaMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.4,
  });
  const trachea = new THREE.Mesh(tracheaGeo, tracheaMat);
  trachea.position.set(0, 1.4, 0);
  trachea.userData = { partId: 'trakea' };
  lungGroup.add(trachea);

  // Bronchus Left & Right
  const bronkR_curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.7, 0),
    new THREE.Vector3(-0.45, 0.4, 0.1),
    new THREE.Vector3(-0.95, 0.0, 0.15),
  ]);
  const bronkR_geo = new THREE.TubeGeometry(bronkR_curve, 16, 0.15, 12, false);
  const bronkMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4 });
  const bronkR = new THREE.Mesh(bronkR_geo, bronkMat);
  bronkR.userData = { partId: 'bronkus-dekstra' };
  lungGroup.add(bronkR);

  const bronkL_curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.7, 0),
    new THREE.Vector3(0.5, 0.35, 0.1),
    new THREE.Vector3(1.0, -0.05, 0.15),
  ]);
  const bronkL_geo = new THREE.TubeGeometry(bronkL_curve, 16, 0.14, 12, false);
  const bronkL = new THREE.Mesh(bronkL_geo, bronkMat);
  lungGroup.add(bronkL);

  // Right Lung (3 lobes, larger)
  const lungR_geo = new THREE.SphereGeometry(1.2, 32, 24);
  lungR_geo.scale(0.85, 1.35, 0.85);
  const lungR_mat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    roughness: 0.4,
    transparent: true,
    opacity: 0.88,
  });
  const lungR = new THREE.Mesh(lungR_geo, lungR_mat);
  lungR.position.set(-1.15, -0.2, 0.1);
  lungR.userData = { partId: 'pulmo-dexter' };
  lungGroup.add(lungR);

  // Left Lung (2 lobes, notch for heart)
  const lungL_geo = new THREE.SphereGeometry(1.15, 32, 24);
  lungL_geo.scale(0.8, 1.3, 0.8);
  const lungL_mat = new THREE.MeshStandardMaterial({
    color: 0xfb7185,
    roughness: 0.4,
    transparent: true,
    opacity: 0.88,
  });
  const lungL = new THREE.Mesh(lungL_geo, lungL_mat);
  lungL.position.set(1.15, -0.2, 0.1);
  lungL.userData = { partId: 'pulmo-sinister' };
  lungGroup.add(lungL);

  // Alveoli grape-like clusters
  const alveoliGroup = new THREE.Group();
  for (let i = 0; i < 9; i++) {
    const alvGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const alvMat = new THREE.MeshStandardMaterial({ color: 0xfda4af });
    const alv = new THREE.Mesh(alvGeo, alvMat);
    alv.position.set(
      (Math.random() - 0.5) * 0.4,
      (Math.random() - 0.5) * 0.4,
      (Math.random() - 0.5) * 0.4
    );
    alveoliGroup.add(alv);
  }
  alveoliGroup.position.set(0.7, -0.8, 0.5);
  alveoliGroup.userData = { partId: 'alveolus-cluster' };
  lungGroup.add(alveoliGroup);

  if (animRef.explodables) {
    animRef.explodables.push(
      { mesh: lungR, originalPos: lungR.position.clone(), explodeDir: new THREE.Vector3(-0.9, 0, 0) },
      { mesh: lungL, originalPos: lungL.position.clone(), explodeDir: new THREE.Vector3(0.9, 0, 0) },
      { mesh: trachea, originalPos: trachea.position.clone(), explodeDir: new THREE.Vector3(0, 0.6, 0) }
    );
  }
}

// 4. GINJAL (Kidney Cutaway & Nephron Structure)
function buildKidneyModel(
  parentGroup: THREE.Group,
  animRef: {
    explodables?: { mesh: THREE.Object3D; originalPos: THREE.Vector3; explodeDir: THREE.Vector3 }[];
  }
) {
  const kidneyGroup = new THREE.Group();
  parentGroup.add(kidneyGroup);

  // Outer bean cortex shell (semi-cutaway)
  const cortexGeo = new THREE.SphereGeometry(1.3, 32, 24, 0, Math.PI * 1.6);
  cortexGeo.scale(0.85, 1.4, 0.95);
  const cortexMat = new THREE.MeshStandardMaterial({
    color: 0xb91c1c,
    roughness: 0.35,
    side: THREE.DoubleSide,
  });
  const cortex = new THREE.Mesh(cortexGeo, cortexMat);
  cortex.position.set(0.1, 0, 0);
  cortex.userData = { partId: 'korteks-renalis' };
  kidneyGroup.add(cortex);

  // Medullary Pyramids (Cone pyramids radiating inward)
  const pyramidMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.45 });
  const pyramidAngles = [-0.6, -0.3, 0, 0.3, 0.6];
  pyramidAngles.forEach((angle, idx) => {
    const pyrGeo = new THREE.ConeGeometry(0.35, 0.75, 16);
    const pyr = new THREE.Mesh(pyrGeo, pyramidMat);
    pyr.position.set(0.4 * Math.cos(angle) + 0.1, 0.9 * Math.sin(angle), 0.1);
    pyr.rotation.z = angle - Math.PI / 2;
    if (idx === 2) pyr.userData = { partId: 'medula-piramid' };
    kidneyGroup.add(pyr);
  });

  // Renal Pelvis funnel
  const pelvisGeo = new THREE.CylinderGeometry(0.18, 0.45, 0.85, 16);
  const pelvisMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.4 });
  const pelvis = new THREE.Mesh(pelvisGeo, pelvisMat);
  pelvis.position.set(-0.55, -0.2, 0.1);
  pelvis.rotation.z = 0.55;
  pelvis.userData = { partId: 'pelvis-renalis' };
  kidneyGroup.add(pelvis);

  // Ureter exiting downward
  const ureterCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.7, -0.5, 0.1),
    new THREE.Vector3(-0.8, -1.2, 0.05),
    new THREE.Vector3(-0.85, -1.9, 0),
  ]);
  const ureterGeo = new THREE.TubeGeometry(ureterCurve, 20, 0.14, 12, false);
  const ureterMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
  const ureter = new THREE.Mesh(ureterGeo, ureterMat);
  ureter.userData = { partId: 'ureter' };
  kidneyGroup.add(ureter);

  // Renal Artery (Red) & Vein (Blue)
  const arteryGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.1, 16);
  const arteryMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
  const artery = new THREE.Mesh(arteryGeo, arteryMat);
  artery.position.set(-0.95, 0.25, 0.2);
  artery.rotation.z = Math.PI / 2 - 0.2;
  artery.userData = { partId: 'arteri-vena-renalis' };
  kidneyGroup.add(artery);

  const veinGeo = new THREE.CylinderGeometry(0.14, 0.14, 1.1, 16);
  const veinMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
  const vein = new THREE.Mesh(veinGeo, veinMat);
  vein.position.set(-0.95, 0.45, -0.15);
  vein.rotation.z = Math.PI / 2 - 0.2;
  kidneyGroup.add(vein);
}

// 5. SEL HEWAN (Eukaryotic Animal Cell 3D Cutaway)
function buildAnimalCellModel(
  parentGroup: THREE.Group,
  animRef: {
    explodables?: { mesh: THREE.Object3D; originalPos: THREE.Vector3; explodeDir: THREE.Vector3 }[];
  }
) {
  const cellGroup = new THREE.Group();
  parentGroup.add(cellGroup);

  // Translucent Cell Membrane Cutaway Sphere
  const membraneGeo = new THREE.SphereGeometry(1.65, 36, 28, 0, Math.PI * 1.5, 0, Math.PI);
  const membraneMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    roughness: 0.2,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide,
  });
  const membrane = new THREE.Mesh(membraneGeo, membraneMat);
  membrane.userData = { partId: 'membran-sel-hewan' };
  cellGroup.add(membrane);

  // Nucleus Sphere with cutaway
  const nucleusGeo = new THREE.SphereGeometry(0.65, 28, 20);
  const nucleusMat = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    roughness: 0.35,
    metalness: 0.1,
  });
  const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
  nucleus.position.set(0, 0, 0);
  nucleus.userData = { partId: 'nukleus-hewan' };
  cellGroup.add(nucleus);

  // Dense Nucleolus core
  const nucleolusGeo = new THREE.SphereGeometry(0.24, 20, 16);
  const nucleolusMat = new THREE.MeshStandardMaterial({ color: 0x581c87, roughness: 0.3 });
  const nucleolus = new THREE.Mesh(nucleolusGeo, nucleolusMat);
  nucleolus.position.set(0.12, 0.1, 0.1);
  cellGroup.add(nucleolus);

  // Mitochondria (Oval capsules with cristae ridges)
  const mitoPositions = [
    new THREE.Vector3(0.95, 0.45, 0.4),
    new THREE.Vector3(-0.95, -0.5, 0.3),
    new THREE.Vector3(0.3, -0.9, -0.6),
  ];
  const mitoMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.35 });
  mitoPositions.forEach((pos, idx) => {
    const mitoGeo = new THREE.CapsuleGeometry(0.18, 0.4, 12, 16);
    const mito = new THREE.Mesh(mitoGeo, mitoMat);
    mito.position.copy(pos);
    mito.rotation.set(0.4 * idx, 0.8 * idx, 0.5 * idx);
    if (idx === 0) mito.userData = { partId: 'mitokondria-hewan' };
    cellGroup.add(mito);
  });

  // Rough Endoplasmic Reticulum (Curved ribbon folds around nucleus)
  const erMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.4, side: THREE.DoubleSide });
  for (let r = 0; r < 3; r++) {
    const erCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.75 - r * 0.12, 0.3 + r * 0.1, 0.1),
      new THREE.Vector3(-0.65 - r * 0.15, 0.6 + r * 0.1, 0.3),
      new THREE.Vector3(-0.4 - r * 0.1, 0.85 + r * 0.08, 0.1),
    ]);
    const erGeo = new THREE.TubeGeometry(erCurve, 20, 0.08, 8, false);
    const erMesh = new THREE.Mesh(erGeo, erMat);
    if (r === 0) erMesh.userData = { partId: 'retikulum-endoplasma-kasar' };
    cellGroup.add(erMesh);
  }

  // Golgi Apparatus (Flat stacked green cisternae)
  const golgiMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.35 });
  for (let g = 0; g < 4; g++) {
    const golgiGeo = new THREE.TorusGeometry(0.38 + g * 0.05, 0.045, 12, 24, Math.PI * 0.8);
    const golgiMesh = new THREE.Mesh(golgiGeo, golgiMat);
    golgiMesh.position.set(0.7, -0.55 + g * 0.08, 0.3);
    golgiMesh.rotation.set(0.3, 0.4, 0.5);
    if (g === 1) golgiMesh.userData = { partId: 'badan-golgi' };
    cellGroup.add(golgiMesh);
  }

  // Lysosomes (Pink vesicles)
  const lysoMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.3 });
  const lysoPositions = [
    new THREE.Vector3(-0.7, -0.55, 0.6),
    new THREE.Vector3(0.5, 0.85, 0.5),
    new THREE.Vector3(-0.3, 0.9, -0.5),
  ];
  lysoPositions.forEach((pos, idx) => {
    const lysoGeo = new THREE.SphereGeometry(0.14, 16, 14);
    const lyso = new THREE.Mesh(lysoGeo, lysoMat);
    lyso.position.copy(pos);
    if (idx === 0) lyso.userData = { partId: 'lisosom' };
    cellGroup.add(lyso);
  });

  if (animRef.explodables) {
    animRef.explodables.push(
      { mesh: nucleus, originalPos: nucleus.position.clone(), explodeDir: new THREE.Vector3(0, 0, 0.9) },
      { mesh: membrane, originalPos: membrane.position.clone(), explodeDir: new THREE.Vector3(0, 0, -0.8) }
    );
  }
}

// 6. SEL TUMBUHAN (Plant Cell 3D Cutaway with Chloroplasts)
function buildPlantCellModel(
  parentGroup: THREE.Group,
  animRef: {
    chloroplasts?: THREE.Mesh[];
    explodables?: { mesh: THREE.Object3D; originalPos: THREE.Vector3; explodeDir: THREE.Vector3 }[];
  }
) {
  const plantGroup = new THREE.Group();
  parentGroup.add(plantGroup);

  // Rigid Box Cell Wall
  const wallGeo = new THREE.BoxGeometry(2.5, 2.0, 1.8);
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x15803d,
    roughness: 0.4,
    wireframe: false,
    transparent: true,
    opacity: 0.35,
  });
  const cellWall = new THREE.Mesh(wallGeo, wallMat);
  cellWall.userData = { partId: 'dinding-sel' };
  plantGroup.add(cellWall);

  // Thick Green Border edges for rigid plant cell wall structure
  const edgesGeo = new THREE.EdgesGeometry(wallGeo);
  const lineMat = new THREE.LineBasicMaterial({ color: 0x22c55e, linewidth: 2 });
  const wallLines = new THREE.LineSegments(edgesGeo, lineMat);
  plantGroup.add(wallLines);

  // Large Central Vacuole (Cyan translucent fluid bladder)
  const vacGeo = new THREE.SphereGeometry(0.78, 28, 20);
  vacGeo.scale(1.2, 0.9, 0.95);
  const vacMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    roughness: 0.15,
    transparent: true,
    opacity: 0.72,
  });
  const vacuole = new THREE.Mesh(vacGeo, vacMat);
  vacuole.position.set(0.1, -0.05, 0);
  vacuole.userData = { partId: 'vakuola-sentral' };
  plantGroup.add(vacuole);

  // Nucleus pushed to the side/periphery
  const nucGeo = new THREE.SphereGeometry(0.42, 24, 18);
  const nucMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.35 });
  const nucleus = new THREE.Mesh(nucGeo, nucMat);
  nucleus.position.set(-0.85, -0.4, 0.35);
  nucleus.userData = { partId: 'nukleus-tumbuhan' };
  plantGroup.add(nucleus);

  // Chloroplasts with glowing grana discs
  animRef.chloroplasts = [];
  const chloroMat = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    emissive: 0x15803d,
    emissiveIntensity: 0.35,
    roughness: 0.3,
  });
  const chloroPositions = [
    new THREE.Vector3(-0.85, 0.65, 0.45),
    new THREE.Vector3(-0.35, 0.75, -0.4),
    new THREE.Vector3(0.55, 0.68, 0.4),
    new THREE.Vector3(0.85, -0.55, 0.4),
  ];
  chloroPositions.forEach((pos, idx) => {
    const chloroGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.12, 16);
    const chloro = new THREE.Mesh(chloroGeo, chloroMat);
    chloro.position.copy(pos);
    chloro.rotation.set(0.4, 0.3 * idx, 0.5);
    if (idx === 0) chloro.userData = { partId: 'kloroplas' };
    plantGroup.add(chloro);
    animRef.chloroplasts?.push(chloro);
  });

  // Mitochondria
  const mitoGeo = new THREE.CapsuleGeometry(0.14, 0.3, 10, 14);
  const mitoMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.35 });
  const mito = new THREE.Mesh(mitoGeo, mitoMat);
  mito.position.set(0.85, -0.5, -0.35);
  mito.userData = { partId: 'mitokondria-tumbuhan' };
  plantGroup.add(mito);

  if (animRef.explodables) {
    animRef.explodables.push(
      { mesh: vacuole, originalPos: vacuole.position.clone(), explodeDir: new THREE.Vector3(0, 0, 0.8) },
      { mesh: cellWall, originalPos: cellWall.position.clone(), explodeDir: new THREE.Vector3(0, 0, -0.8) }
    );
  }
}

// 7. SEL NEURON (Nerve Cell with Dendrites, Myelin & Animated Action Potential)
function buildNeuronModel(
  parentGroup: THREE.Group,
  animRef: {
    neuronSignal?: THREE.Mesh[];
  }
) {
  const neuronGroup = new THREE.Group();
  parentGroup.add(neuronGroup);

  // Soma (Cell Body) - star-like polyhedron
  const somaGeo = new THREE.DodecahedronGeometry(0.65, 1);
  const somaMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.35 });
  const soma = new THREE.Mesh(somaGeo, somaMat);
  soma.position.set(-1.4, 0.3, 0);
  soma.userData = { partId: 'soma-dendrit' };
  neuronGroup.add(soma);

  // Dendrites branching from soma
  const dendriteMat = new THREE.MeshStandardMaterial({ color: 0x60a5fa, roughness: 0.4 });
  const dendAngles = [Math.PI * 0.7, Math.PI * 0.9, Math.PI * 1.1, Math.PI * 1.3];
  dendAngles.forEach((ang) => {
    const dendCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.4 + 0.5 * Math.cos(ang), 0.3 + 0.5 * Math.sin(ang), 0),
      new THREE.Vector3(-1.4 + 1.1 * Math.cos(ang), 0.3 + 1.1 * Math.sin(ang), 0.2),
      new THREE.Vector3(-1.4 + 1.6 * Math.cos(ang), 0.3 + 1.6 * Math.sin(ang), -0.1),
    ]);
    const dendGeo = new THREE.TubeGeometry(dendCurve, 16, 0.05, 8, false);
    const dendMesh = new THREE.Mesh(dendGeo, dendriteMat);
    neuronGroup.add(dendMesh);
  });

  // Long Axon Cylinder
  const axonCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.9, 0.2, 0),
    new THREE.Vector3(0, 0, 0.05),
    new THREE.Vector3(1.1, -0.2, 0),
  ]);
  const axonGeo = new THREE.TubeGeometry(axonCurve, 32, 0.07, 12, false);
  const axonMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.35 });
  const axon = new THREE.Mesh(axonGeo, axonMat);
  axon.userData = { partId: 'akson-silinder' };
  neuronGroup.add(axon);

  // Myelin Sheath segments & Nodes of Ranvier
  const myelinMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3 });
  const myelinSegments = [-0.6, -0.1, 0.4, 0.85];
  myelinSegments.forEach((x, idx) => {
    const segGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.36, 16);
    const seg = new THREE.Mesh(segGeo, myelinMat);
    seg.position.set(x, 0.08 - idx * 0.08, 0.02);
    seg.rotation.z = Math.PI / 2 - 0.15;
    if (idx === 1) seg.userData = { partId: 'selubung-mielin' };
    neuronGroup.add(seg);
  });

  // Node of Ranvier indicator marker
  const ranvierMarker = new THREE.Mesh(
    new THREE.RingGeometry(0.08, 0.12, 16),
    new THREE.MeshBasicMaterial({ color: 0xf97316, side: THREE.DoubleSide })
  );
  ranvierMarker.position.set(-0.35, 0.05, 0.1);
  ranvierMarker.userData = { partId: 'nodus-ranvier' };
  neuronGroup.add(ranvierMarker);

  // Terminal Axon Buttons & Synapse
  const termMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.35 });
  for (let t = 0; t < 3; t++) {
    const termCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.1, -0.2, 0),
      new THREE.Vector3(1.4, -0.15 + (t - 1) * 0.35, (t - 1) * 0.2),
      new THREE.Vector3(1.7, -0.15 + (t - 1) * 0.45, (t - 1) * 0.3),
    ]);
    const termGeo = new THREE.TubeGeometry(termCurve, 12, 0.045, 8, false);
    const termMesh = new THREE.Mesh(termGeo, termMat);
    neuronGroup.add(termMesh);

    // Synaptic bulb
    const bulbGeo = new THREE.SphereGeometry(0.12, 14, 12);
    const bulb = new THREE.Mesh(bulbGeo, termMat);
    bulb.position.set(1.7, -0.15 + (t - 1) * 0.45, (t - 1) * 0.3);
    if (t === 1) bulb.userData = { partId: 'terminal-sinapsis' };
    neuronGroup.add(bulb);
  }

  // Animated Action Potential Light Particles
  animRef.neuronSignal = [];
  for (let s = 0; s < 3; s++) {
    const sigGeo = new THREE.SphereGeometry(0.12, 14, 12);
    const sigMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
    });
    const sig = new THREE.Mesh(sigGeo, sigMat);
    sig.position.set(-1.0 + s * 0.8, 0.1, 0.05);
    neuronGroup.add(sig);
    animRef.neuronSignal.push(sig);
  }
}

// 8. SEL BAKTERI (Prokaryotic Cell 3D)
function buildBacterialModel(
  parentGroup: THREE.Group,
  animRef: {
    flagellum?: THREE.Mesh;
    explodables?: { mesh: THREE.Object3D; originalPos: THREE.Vector3; explodeDir: THREE.Vector3 }[];
  }
) {
  const bactGroup = new THREE.Group();
  parentGroup.add(bactGroup);

  // Outer Capsule Capsule shape (Cyan)
  const capsuleGeo = new THREE.CapsuleGeometry(0.85, 1.6, 20, 24);
  const capsuleMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    roughness: 0.3,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
  });
  const capsule = new THREE.Mesh(capsuleGeo, capsuleMat);
  capsule.rotation.z = Math.PI / 2;
  capsule.userData = { partId: 'kapsul-glikokaliks' };
  bactGroup.add(capsule);

  // Peptidoglycan Cell Wall (Yellowish)
  const wallGeo = new THREE.CapsuleGeometry(0.78, 1.5, 16, 20);
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xeab308,
    roughness: 0.4,
    transparent: true,
    opacity: 0.5,
  });
  const wall = new THREE.Mesh(wallGeo, wallMat);
  wall.rotation.z = Math.PI / 2;
  wall.userData = { partId: 'dinding-sel-peptidoglikan' };
  bactGroup.add(wall);

  // Tangled Nucleoid Circular DNA (Purple coiled loop in center)
  const dnaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.4, 0.15, 0.1),
    new THREE.Vector3(-0.1, 0.3, -0.15),
    new THREE.Vector3(0.3, 0.1, 0.2),
    new THREE.Vector3(0.4, -0.2, -0.1),
    new THREE.Vector3(-0.1, -0.25, 0.15),
    new THREE.Vector3(-0.4, 0.15, 0.1),
  ]);
  const dnaGeo = new THREE.TubeGeometry(dnaCurve, 40, 0.08, 8, true);
  const dnaMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.3 });
  const dnaMesh = new THREE.Mesh(dnaGeo, dnaMat);
  dnaMesh.userData = { partId: 'nukleoid-bakteri' };
  bactGroup.add(dnaMesh);

  // Ribosomes 70S (Small red dots)
  const riboMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
  for (let r = 0; r < 24; r++) {
    const riboGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const ribo = new THREE.Mesh(riboGeo, riboMat);
    ribo.position.set(
      (Math.random() - 0.5) * 1.4,
      (Math.random() - 0.5) * 0.7,
      (Math.random() - 0.5) * 0.7
    );
    if (r === 0) ribo.userData = { partId: 'ribosom-70s' };
    bactGroup.add(ribo);
  }

  // Wavy Flagellum Whip
  const flagCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.6, 0, 0),
    new THREE.Vector3(-2.1, 0.25, 0.2),
    new THREE.Vector3(-2.6, -0.25, -0.2),
    new THREE.Vector3(-3.2, 0.3, 0.1),
  ]);
  const flagGeo = new THREE.TubeGeometry(flagCurve, 32, 0.05, 8, false);
  const flagMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.35 });
  const flagMesh = new THREE.Mesh(flagGeo, flagMat);
  flagMesh.userData = { partId: 'flagela-bakteri' };
  bactGroup.add(flagMesh);
  animRef.flagellum = flagMesh;

  // Surface Pili / Fimbriae hair-like bristles
  const piliMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
  for (let p = 0; p < 16; p++) {
    const angle = (p / 16) * Math.PI * 2;
    const pCurve = new THREE.LineCurve3(
      new THREE.Vector3(0.8 * Math.cos(angle), 0.8 * Math.sin(angle), 0),
      new THREE.Vector3(1.15 * Math.cos(angle), 1.15 * Math.sin(angle), 0)
    );
    const pGeo = new THREE.TubeGeometry(pCurve, 4, 0.015, 4, false);
    const pMesh = new THREE.Mesh(pGeo, piliMat);
    bactGroup.add(pMesh);
  }
}
