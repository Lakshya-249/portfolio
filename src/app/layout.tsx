"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import Navigation from "./components/Navigation";
import { useEffect, useRef } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const starFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const starField = starFieldRef.current;
    const cursor = cursorRef.current;
    const stars = starsRef.current;
    if (!cursor || !stars) return;

    const trail: HTMLDivElement[] = [];
    const trailLength = 15; // Slightly shorter trail for sleekness

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;

      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      // Subtle parallax, less jittery
      stars.style.transform = `translate(${x * 10}px, ${y * 10}px)`;

      const trailParticle = document.createElement("div");
      trailParticle.className = "lightsaber-trail-particle";
      trailParticle.style.left = `${e.clientX}px`;
      trailParticle.style.top = `${e.clientY}px`;
      document.body.appendChild(trailParticle);
      trail.push(trailParticle);

      if (trail.length > trailLength) {
        const oldestParticle = trail.shift();
        if (oldestParticle) {
          oldestParticle.style.opacity = "0";
          setTimeout(() => oldestParticle.remove(), 200); // Faster fade
        }
      }
    };

    const createStars = () => {
      // Existing star layers...
      const layers = [
        { count: 300, size: 1, class: "star-dim", depth: 0.5 },
        { count: 150, size: 2, class: "star-bright", depth: 1 },
        { count: 55, size: 3, class: "star-glow", depth: 1.5 },
      ];

      layers.forEach((layer) => {
        for (let i = 0; i < layer.count; i++) {
          const star = document.createElement("div");
          star.className = `star ${layer.class}`;
          const size = Math.random() * layer.size + 1;
          star.style.width = `${size}px`;
          star.style.height = `${size}px`;
          star.style.left = `${Math.random() * 100}%`;
          star.style.top = `${Math.random() * 100}%`;
          star.style.transform = `scale(${layer.depth})`;
          star.style.animationDelay = `${Math.random() * 3}s`;
          stars.appendChild(star);
        }
      });

      const nebula = document.createElement("div");
      nebula.className = "nebula";
      stars.appendChild(nebula);
    };

    const createShootingStars = () => {
      for (let i = 0; i < 10; i++) {
        const shootingStar = document.createElement("div");
        shootingStar.className = "shooting-star";
        shootingStar.style.top = `${Math.random() * 80}%`;
        shootingStar.style.right = `${Math.random() * 100}%`;
        const size = 3 + Math.random() * 3; // 3-6px
        shootingStar.style.width = `${size}px`;
        shootingStar.style.height = `${size}px`;
        const angle = 310 + Math.random() * 10; // 310-320deg
        shootingStar.style.setProperty("--start-angle", `${angle}deg`);
        shootingStar.style.animationDelay = `${Math.random() * 10 + i * 2}s`; // 0-25s
        shootingStar.style.animationDuration = `${4 + Math.random() * 2}s`; // 4-6s
        shootingStar.style.opacity = "0"; // Start invisible
        starsRef.current?.appendChild(shootingStar);
      }
    };
    // Create the star field layers dynamically
    const createStarField = () => {
      const layers = 3;
      for (let i = 1; i <= layers; i++) {
        const layer = document.createElement("div");
        layer.className = `layer layer-${i}`;
        starField?.appendChild(layer);
      }
    };

    createStarField();

    createStars();
    createShootingStars();
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      trail.forEach((particle) => particle.remove());
    };
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="star-wars-bg">
          <div ref={starsRef} className="parallax-stars"></div>
          <div ref={starFieldRef} className="star-field"></div>
        </div>
        <div
          ref={cursorRef}
          className="lightsaber-cursor"
          style={{
            width: "3px", // Slimmer, sharper
            height: "25px",
            background: "linear-gradient(180deg, #60a5fa, #1e3a8a)", // Gradient for depth
            boxShadow: "0 0 8px #60a5fa, 0 0 15px #60a5fa, 0 0 25px #1e3a8a",
            borderRadius: "2px",
          }}
        ></div>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
