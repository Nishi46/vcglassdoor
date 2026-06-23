"use client";

import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isText, setIsText] = useState(false);

  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const vel = useRef({ x: 0, y: 0 });
  const prevPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      vel.current = {
        x: e.clientX - prevPos.current.x,
        y: e.clientY - prevPos.current.y,
      };
      prevPos.current = { x: e.clientX, y: e.clientY };
      pos.current = { x: e.clientX, y: e.clientY };

      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (el) {
        const cursorLabel = el.closest("[data-cursor]")?.getAttribute("data-cursor") ?? "";
        setLabel(cursorLabel);
        setIsHovering(
          !!el.closest("a, button, [role='button'], [data-cursor]") ||
          el.tagName === "BUTTON" || el.tagName === "A"
        );
        setIsText(
          window.getComputedStyle(el).cursor === "text"
        );
      }
    };

    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    const animate = () => {
      const ease = isHovering ? 0.12 : 0.18;
      ring.current.x += (pos.current.x - ring.current.x) * ease;
      ring.current.y += (pos.current.y - ring.current.y) * ease;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(rafId.current);
    };
  }, [isHovering]);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{ willChange: "transform" }}
      >
        <div
          className="rounded-full bg-white transition-all duration-150"
          style={{
            width: isClicking ? 6 : isText ? 2 : 8,
            height: isClicking ? 6 : isText ? 20 : 8,
          }}
        />
      </div>

      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ willChange: "transform" }}
      >
        <div
          className="rounded-full border border-white/40 mix-blend-difference flex items-center justify-center transition-all duration-200"
          style={{
            width: isHovering ? (label ? 80 : 48) : isClicking ? 28 : 36,
            height: isHovering ? (label ? 80 : 48) : isClicking ? 28 : 36,
            marginLeft: isHovering ? (label ? -40 : -24) : isClicking ? -14 : -18,
            marginTop: isHovering ? (label ? -40 : -24) : isClicking ? -14 : -18,
            backgroundColor: isHovering ? "rgba(255,255,255,0.08)" : "transparent",
          }}
        >
          {label && (
            <span className="text-[10px] font-medium text-white tracking-wide text-center leading-tight px-2">
              {label}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
