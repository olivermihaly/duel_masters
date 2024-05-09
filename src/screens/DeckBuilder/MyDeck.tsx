import useMyDecksStore from "../../stores/useMyDeckStore";

export default function MyDeck() {
  const [deck, setDeck] = useMyDecksStore((state) => [
    state.deck,
    state.setDeck,
  ]);
  return (
    <div className="my-deck-container">
      {deck.deck.map((card, index) => {
        return <img className="my-deck-card" src={card.src} key={index}></img>;
      })}
    </div>
  );
}
