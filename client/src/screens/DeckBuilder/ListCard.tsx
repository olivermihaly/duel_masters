import { useRef, useState, CSSProperties, useEffect } from "react";
import useMyDecksStore from "../../stores/useMyDeckStore";

export default function ListCard({ src }: { src: string }) {
  const [addCardToDeck] = useMyDecksStore((state) => [state.addCardToDeck]);

  return (
    <img
      className="list-card"
      src={src}
      onClick={() => addCardToDeck({ src: src })}
    ></img>
  );
}

type DraggableListCardProps = {
  src: string;
};

type DraggableImageProps = {
  src: string;
  style: CSSProperties;
  removeCard: () => void;
};

export function DraggableListCard({ src }: DraggableListCardProps) {
  const cardRef = useRef<HTMLImageElement>(null);
  const [draggableCard, setDraggableCard] =
    useState<DraggableImageProps | null>(null);

  const handleClick = (e: MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    // img.style.left = `${e.clientX - 0}px`;
    //  img.style.top = `${e.clientY - 0}px`;
    if (rect) {
      setDraggableCard({
        src,
        style: {
          position: "absolute",
          left: `${e.clientX}px`,
          top: `${e.clientY}px`,
          borderRadius: 10,
          cursor: "pointer",
          transform: "translate(-50%,-50%)",
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
        onMouseDown={(e) => handleClick(e)}
        draggable={false}
      ></img>
      {draggableCard && (
        <DraggableImage
          src={draggableCard.src}
          style={draggableCard.style}
          removeCard={() => setDraggableCard(null)}
        />
      )}
    </div>
  );
}
function DraggableImage({ src, style, removeCard }: DraggableImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [addCardToDeck] = useMyDecksStore((state) => [state.addCardToDeck]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return function cleanup() {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  function onMouseUp(e: MouseEvent) {
    let container = document.getElementsByClassName("my-decks")[0];
    let rect = container.getBoundingClientRect();
    if (rect.x < e.clientX && rect.y < e.clientY) {
      addCardToDeck({ src: src });
      removeCard();
    } else {
      removeCard();
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    //console.log(e.clientY, e.clientX);
    const img = imgRef.current;
    if (img) {
      img.style.left = `${e.clientX - 0}px`;
      img.style.top = `${e.clientY - 0}px`;
    }
  };

  return (
    <img
      ref={imgRef}
      src={src}
      className="draggable-list-card"
      style={style}
      draggable={false}
    />
  );
}
