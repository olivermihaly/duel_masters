import { useEffect, useLayoutEffect, useRef, useState } from "react";

type CardProps = {
  startPosition: { x: number; y: number };
  card: CardProperties;
};

export default function Card({ startPosition, card }: CardProps) {
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
      cardRef.current!.style.zIndex = "0";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    cardRef.current!.style.top = `${startPosition.y}px`;
    cardRef.current!.style.left = `${startPosition.x}px`;
  }, []);

  const handleMouseDown: React.MouseEventHandler<HTMLImageElement> = (
    event
  ) => {
    setIsDragging(true);
    cardRef.current!.style.zIndex = "1";
    lastMousePosition.current = { x: event.clientX, y: event.clientY };
  };

  const handleDragStart: React.DragEventHandler<HTMLImageElement> = (event) => {
    event.preventDefault(); // Prevent default drag behavior
  };

  return (
    <>
      <img
        className={`card ${isDragging ? "dragging" : ""}`}
        src={card.src}
        ref={cardRef}
        alt="Spiral Gate"
        onMouseDown={handleMouseDown}
        onDragStart={handleDragStart}
      />
    </>
  );
}
