import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Particle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  speed: number;
}

interface Sphere {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

interface PageLoaderProps {
  isVisible: boolean;
  onComplete: () => void;
}

export default function PageLoader({ isVisible, onComplete }: PageLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [spheres, setSpheres] = useState<Sphere[]>([]);
  const [chipAssembled, setChipAssembled] = useState(false);
  const [loadingText, setLoadingText] = useState("Инициализация...");

  // Chip shape coordinates (simplified microprocessor)
  const chipCoordinates = [
    // Center core
    { x: 50, y: 50 },
    // Inner circuits
    { x: 40, y: 40 }, { x: 60, y: 40 },
    { x: 40, y: 60 }, { x: 60, y: 60 },
    { x: 45, y: 45 }, { x: 55, y: 45 },
    { x: 45, y: 55 }, { x: 55, y: 55 },
    // Circuit paths
    { x: 30, y: 50 }, { x: 70, y: 50 },
    { x: 50, y: 30 }, { x: 50, y: 70 },
    // Corner elements
    { x: 35, y: 35 }, { x: 65, y: 35 },
    { x: 35, y: 65 }, { x: 65, y: 65 },
    // Additional circuit details
    { x: 42, y: 50 }, { x: 58, y: 50 },
    { x: 50, y: 42 }, { x: 50, y: 58 },
  ];

  const loadingStages = [
    "Инициализация...",
    "Загрузка ядра системы...",
    "Сборка нейронных связей...",
    "Активация AI модулей...",
    "Запуск Jarvis...",
    "Готово!"
  ];

  useEffect(() => {
    if (!isVisible) return;

    // Initialize particles
    const initialParticles: Particle[] = chipCoordinates.map((coord, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      targetX: coord.x,
      targetY: coord.y,
      size: Math.random() * 3 + 2,
      color: `hsl(${200 + Math.random() * 60}, 80%, ${60 + Math.random() * 30}%)`,
      speed: 0.02 + Math.random() * 0.03,
    }));

    // Initialize flying spheres
    const initialSpheres: Sphere[] = Array.from({ length: 8 }, (_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.6 + 0.2,
      color: `hsl(${180 + Math.random() * 80}, 70%, 60%)`,
    }));

    setParticles(initialParticles);
    setSpheres(initialSpheres);

    let animationFrame: number;
    let progressInterval: NodeJS.Timeout;
    let textInterval: NodeJS.Timeout;

    const animate = () => {
      // Update particles moving to chip positions
      setParticles(prev => prev.map(particle => {
        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 1) {
          return {
            ...particle,
            x: particle.x + dx * particle.speed,
            y: particle.y + dy * particle.speed,
          };
        }
        return particle;
      }));

      // Update flying spheres
      setSpheres(prev => prev.map(sphere => {
        let newX = sphere.x + sphere.vx;
        let newY = sphere.y + sphere.vy;
        let newVx = sphere.vx;
        let newVy = sphere.vy;

        // Bounce off edges
        if (newX <= 0 || newX >= 100) {
          newVx = -sphere.vx;
          newX = Math.max(0, Math.min(100, newX));
        }
        if (newY <= 0 || newY >= 100) {
          newVy = -sphere.vy;
          newY = Math.max(0, Math.min(100, newY));
        }

        return {
          ...sphere,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          opacity: 0.2 + Math.sin(Date.now() * 0.002 + sphere.id) * 0.3,
        };
      }));

      animationFrame = requestAnimationFrame(animate);
    };

    // Progress simulation
    progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 5 + 2;
        if (newProgress >= 100) {
          setChipAssembled(true);
          setTimeout(() => {
            onComplete();
          }, 1000);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    // Text changes
    textInterval = setInterval(() => {
      setLoadingText(prev => {
        const currentIndex = loadingStages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % loadingStages.length;
        return loadingStages[nextIndex];
      });
    }, 1500);

    animate();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (progressInterval) clearInterval(progressInterval);
      if (textInterval) clearInterval(textInterval);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20" />
        
        {/* Animated grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            animation: "gridMove 20s linear infinite"
          }}
        />
        
        {/* Pulse effect */}
        <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
      </div>

      {/* Flying spheres */}
      <div className="absolute inset-0">
        {spheres.map(sphere => (
          <div
            key={sphere.id}
            className="absolute rounded-full blur-sm"
            style={{
              left: `${sphere.x}%`,
              top: `${sphere.y}%`,
              width: `${sphere.size}px`,
              height: `${sphere.size}px`,
              backgroundColor: sphere.color,
              opacity: sphere.opacity,
              boxShadow: `0 0 ${sphere.size * 2}px ${sphere.color}`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="text-center z-10 px-8 max-w-lg w-full">
        {/* Chip assembly area */}
        <div className="relative w-64 h-64 mx-auto mb-12 border border-white/20 rounded-xl bg-black/50 backdrop-blur-sm">
          {/* Circuit board background */}
          <div 
            className="absolute inset-2 opacity-20"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(0,255,255,0.3) 1px, transparent 1px),
                radial-gradient(circle at 75% 75%, rgba(0,255,255,0.3) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px, 15px 15px",
            }}
          />
          
          {/* Particles forming the chip */}
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                transform: "translate(-50%, -50%)",
                transition: chipAssembled ? "all 0.5s ease" : "none",
              }}
            />
          ))}

          {/* Chip glow effect when assembled */}
          {chipAssembled && (
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-xl animate-pulse" />
          )}
        </div>

        {/* Loading text */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 animate-pulse">
            {loadingText}
          </h2>
          <div className="flex items-center justify-center space-x-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-800 rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>

        {/* Progress percentage */}
        <div className="text-2xl font-bold text-white mb-2">
          {Math.round(progress)}%
        </div>

        {/* STARK branding */}
        <div className="text-sm text-white/60 uppercase tracking-wider">
          STARK INDUSTRIES • AI DIVISION
        </div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(50px) translateY(50px); }
        }
      `}</style>
    </div>
  );
}
