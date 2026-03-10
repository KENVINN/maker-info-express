import { useEffect } from "react";
import MakerInfoApp from "@/components/MakerInfoApp";

export default function Studio() {
  // Studio ocupa tela cheia — sem Navbar nem Footer
  useEffect(() => {
    const prev = document.title;
    document.title = "Maker Info Studio Pro";
    // Impede scroll do body enquanto o studio estiver aberto
    document.body.style.overflow = "hidden";
    return () => {
      document.title = prev;
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#060a14" }}>
      <MakerInfoApp />
    </div>
  );
}
