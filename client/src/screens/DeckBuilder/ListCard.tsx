import useMyDecksStore from "../../stores/useMyDeckStore";

export default function ListCard({src}:{src:string}) {
  const [addCardToDeck] = useMyDecksStore((state) => [state.addCardToDeck]);

  return (
    <img
      className="list-card"
      src={src}
      onClick={() => addCardToDeck({ src: src })}
    ></img>
  );
}
