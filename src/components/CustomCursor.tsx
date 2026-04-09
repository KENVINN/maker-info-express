import { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos     = useRef({ x: -100, y: -100 });
  const lerped  = useRef({ x: -100, y: -100 });
  const raf     = useRef<number>(0);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    // hide system cursor everywhere
    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onDown = () => { setClicked(true);  setTimeout(() => setClicked(false), 150); };

    // track interactive elements
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button, [role='button'], input, textarea, select, label")) {
        setHovered(true);
      }
    };
    const onOut = (e: MouseEvent) => {
      const el = e.relatedTarget as HTMLElement | null;
      if (!el?.closest("a, button, [role='button'], input, textarea, select, label")) {
        setHovered(false);
      }
    };

    const tick = () => {
      // dot — snaps instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      // ring — smooth lerp (spring feel)
      lerped.current.x += (pos.current.x - lerped.current.x) * 0.11;
      lerped.current.y += (pos.current.y - lerped.current.y) * 0.11;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${lerped.current.x}px, ${lerped.current.y}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    raf.current = requestAnimationFrame(tick);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  // dot size / ring size driven by state
  const dotSize   = clicked ? 3  : hovered ? 3  : 6;
  const ringSize  = clicked ? 20 : hovered ? 44 : 32;
  const ringOpacity = hovered ? 0.9 : 0.55;

  return (
    <>
      {/* filled dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-primary"
        style={{
          width: dotSize,
          height: dotSize,
          marginLeft: -(dotSize / 2),
          marginTop: -(dotSize / 2),
          transition: "width 0.2s, height 0.2s, margin 0.2s",
          boxShadow: "0 0 8px rgba(0,212,255,0.9)",
          willChange: "transform",
        }}
      />
      {/* trailing ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-primary"
        style={{
          width: ringSize,
          height: ringSize,
          marginLeft: -(ringSize / 2),
          marginTop: -(ringSize / 2),
          opacity: ringOpacity,
          transition: "width 0.25s cubic-bezier(0.23,1,0.32,1), height 0.25s cubic-bezier(0.23,1,0.32,1), margin 0.25s cubic-bezier(0.23,1,0.32,1), opacity 0.2s",
          boxShadow: hovered ? "0 0 12px rgba(0,212,255,0.4)" : "0 0 6px rgba(0,212,255,0.2)",
          willChange: "transform",
        }}
      />
    </>
  );
};

export default CustomCursor;
