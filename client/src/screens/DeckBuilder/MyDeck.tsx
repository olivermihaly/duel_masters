import usePlayerStore from "../../stores/usePlayerStore";

export default function MyDeck() {
  // Get currentDeck and the corresponding deck
  const { currentDeck, decks, removeCardFromDeck } = usePlayerStore((state) => ({
    currentDeck: state.currentDeck,
    decks: state.decks,
    removeCardFromDeck: state.removeCardFromDeck,
  }));

  // Retrieve the deck based on currentDeck

  console.log(decks);
  const deck = decks[currentDeck];

  if (!deck) {
    return <div>Deck not found</div>;
  }

  return (
    <div className="my-deck-container">
      {deck.cards.map((card, index) => (
        <img className="my-deck-card" onClick={() => removeCardFromDeck(currentDeck, index)} src={card.src} key={index} alt={`Card ${index}`} />
      ))}
    </div>
  );
}
