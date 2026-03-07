import { useEffect, useRef } from "react";

const CircuitBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // Nodes
    const NODE_COUNT = 40;
    const SPEED = 0.3;
    const LINE_DIST = 180;

    type Node = {
      x: number; y: number;
      vx: number; vy: number;
      radius: number;
    };

    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      radius: Math.random() * 1.5 + 0.5,
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Move nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      });

      // Draw connections (circuit style - only horizontal/vertical segments)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < LINE_DIST) {
            const alpha = (1 - dist / LINE_DIST) * 0.15;
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            // Circuit style: go horizontal then vertical
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, a.y); // horizontal
            ctx.lineTo(b.x, b.y); // vertical
            ctx.stroke();

            // Draw corner dot
            ctx.fillStyle = `rgba(0, 212, 255, ${alpha * 2})`;
            ctx.beginPath();
            ctx.arc(b.x, a.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        ctx.fillStyle = "rgba(0, 212, 255, 0.25)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};

export default CircuitBackground;
