import { useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  radius?: number;
};

/**
 * Wraps children with a radial light that follows the cursor — Apple product card style.
 * Usage: wrap any card div with <SpotlightCard className="...existing classes...">
 */
const SpotlightCard = ({ children, className = "", radius = 200 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 0, y: 0, visible: false });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setSpot({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setSpot(s => ({ ...s, visible: false }))}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: spot.visible ? 1 : 0,
          background: `radial-gradient(${radius}px circle at ${spot.x}px ${spot.y}px, rgba(0,212,255,0.11), transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
};

export default SpotlightCard;
