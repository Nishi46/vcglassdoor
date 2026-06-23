"use client";

import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  ox: number; // origin x
  oy: number; // origin y
  vx: number;
  vy: number;
  r: number;
  alpha: number;
}

export default function SubtleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    let dots: Dot[] = [];
    const mouse = { x: -1000, y: -1000 };
    let rafId: number;

    function resize() {
      W = canvas!.width = canvas!.offsetWidth;
      H = canvas!.height = canvas!.offsetHeight;
      init();
    }

    function init() {
      dots = [];
      const cols = Math.floor(W / 60);
      const rows = Math.floor(H / 60);
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = (i / cols) * W;
          const y = (j / rows) * H;
          dots.push({
            x, y, ox: x, oy: y,
            vx: 0, vy: 0,
            r: Math.random() * 1.2 + 0.4,
            alpha: Math.random() * 0.25 + 0.05,
          });
        }
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      for (const d of dots) {
        // Mouse repulsion
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repulseR = 120;

        if (dist < repulseR) {
          const force = (1 - dist / repulseR) * 1.8;
          d.vx += (dx / dist) * force;
          d.vy += (dy / dist) * force;
        }

        // Spring back to origin
        d.vx += (d.ox - d.x) * 0.04;
        d.vy += (d.oy - d.y) * 0.04;

        // Damping
        d.vx *= 0.82;
        d.vy *= 0.82;

        d.x += d.vx;
        d.y += d.vy;

        ctx!.beginPath();
        ctx!.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(148,163,184,${d.alpha})`; // slate-400
        ctx!.fill();
      }

      rafId = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    draw();

    const onMove = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.x = -1000; mouse.y = -1000; };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
