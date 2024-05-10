import useMyDecksStore from "../../stores/useMyDeckStore";

export default function MyDeck() {
  const [deck, setDeck, removeCardFromDeck] = useMyDecksStore((state) => [
    state.deck,
    state.setDeck,
    state.removeCardFromDeck
  ]);

  const sortedDeck = [...deck.deck].sort((a, b) => a.src.localeCompare(b.src));


  return (
    <div className="my-deck-container">
      {deck.deck.map((card, index) => {
        return (
          <img
            className="my-deck-card" 
            onClick={() => removeCardFromDeck(index)}
            src={card.src}
            key={index}
          />
        );
      })}
    </div>
  );
}
