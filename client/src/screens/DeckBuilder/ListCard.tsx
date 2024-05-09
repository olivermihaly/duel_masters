import image from "../../assets/cards/aqua_knight.png";
import useMyDecksStore from "../../stores/useMyDeckStore";

export default function ListCard() {
  const [addCardToDeck] = useMyDecksStore((state) => [state.addCardToDeck]);

  return (
    <img
      className="list-card"
      src={image}
      onClick={() => addCardToDeck({ src: image })}
    ></img>
  );
}
