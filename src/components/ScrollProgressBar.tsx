import { useEffect, useState } from "react";

const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? (doc.scrollTop / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-[9997] h-[2px] pointer-events-none">
      <div
        className="h-full bg-primary"
        style={{
          width: `${progress}%`,
          boxShadow: "0 0 10px rgba(0,212,255,0.9), 0 0 24px rgba(0,212,255,0.4)",
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
};

export default ScrollProgressBar;
