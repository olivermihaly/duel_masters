import { useRef, useState, CSSProperties, useEffect } from "react";
import usePlayerStore from "../../stores/usePlayerStore"; // Changed to usePlayerStore

export default function ListCard({ src, deckName }: { src: string; deckName: string }) {
  const addCardToDeck = usePlayerStore((state) => state.addCardToDeck);
  return <img className="list-card" src={src} onClick={() => addCardToDeck(deckName, { src })} alt="List Card" />;
}

type DraggableListCardProps = {
  src: string;
  deckName: string;
};

type DraggableImageProps = {
  src: string;
  style: CSSProperties;
  removeCard: () => void;
};

export function DraggableListCard({ src }: DraggableListCardProps) {
  const cardRef = useRef<HTMLImageElement>(null);
  const [draggableCard, setDraggableCard] = useState<DraggableImageProps | null>(null);
  const handleClick = (e: MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setDraggableCard({
        src,

        style: {
          position: "absolute",
          left: `${e.clientX}px`,
          top: `${e.clientY}px`,
          borderRadius: 10,
          cursor: "pointer",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
        },
        removeCard: () => setDraggableCard(null),
      });
    }
  };

  return (
    <div className="draggable-list-card-container" draggable={false}>
      <img
        ref={cardRef}
        className="list-card"
        style={{ borderRadius: 10 }}
        src={src}
        onMouseDown={(e) => handleClick(e as unknown as MouseEvent)} // Explicit cast for MouseEvent
        draggable={false}
        alt="Draggable List Card"
      />
      {draggableCard && <DraggableImage src={draggableCard.src} style={draggableCard.style} removeCard={draggableCard.removeCard} />}
    </div>
  );
}

function DraggableImage({ src, style, removeCard }: DraggableImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const addCardToDeck = usePlayerStore((state) => state.addCardToDeck);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const img = imgRef.current;
      if (img) {
        img.style.left = `${e.clientX}px`;
        img.style.top = `${e.clientY}px`;
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      const container = document.getElementsByClassName("my-decks")[0];
      const rect = container.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        const { currentDeck } = usePlayerStore.getState();

        addCardToDeck(currentDeck, { src });
        removeCard();
      } else {
        removeCard();
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [src, addCardToDeck, removeCard]);

  return <img ref={imgRef} src={src} className="draggable-list-card" style={style} draggable={false} alt="Draggable Image" />;
}
