import { useEffect, useRef, useState } from "react";
import spiralGateImage from "../assets/cards/spiral_gate.png";

export default function Card() {
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLImageElement>(null);
  const lastMousePosition = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        const card = cardRef.current;
        if (card && lastMousePosition.current) {
          const offsetX =
            event.clientX - lastMousePosition.current.x + card.offsetLeft;
          const offsetY =
            event.clientY - lastMousePosition.current.y + card.offsetTop;
          card.style.left = `${offsetX}px`;
          card.style.top = `${offsetY}px`;
        }
        lastMousePosition.current = { x: event.clientX, y: event.clientY };
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown: React.MouseEventHandler<HTMLImageElement> = (
    event
  ) => {
    setIsDragging(true);
    lastMousePosition.current = { x: event.clientX, y: event.clientY };
  };

  const handleDragStart: React.DragEventHandler<HTMLImageElement> = (event) => {
    event.preventDefault(); // Prevent default drag behavior
  };

  return (
    <>
      <img
        className={`card ${isDragging ? "dragging" : ""}`}
        src={spiralGateImage}
        ref={cardRef}
        alt="Spiral Gate"
        onMouseDown={handleMouseDown}
        onDragStart={handleDragStart}
      />
    </>
  );
}
