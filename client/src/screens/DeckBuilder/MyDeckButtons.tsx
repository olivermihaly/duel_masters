import usePlayerStore from "../../stores/usePlayerStore";

export default function MyDeckButtons() {
  const { setCurrentDeck, saveDeck, deleteDeck, currentDeck } = usePlayerStore((state) => ({
    setCurrentDeck: state.setCurrentDeck,
    saveDeck: state.saveDeck,
    deleteDeck: state.deleteDeck,
    currentDeck: state.currentDeck,
  }));

  const handleNewDeck = () => {
    const newDeckName = `Deck${Object.keys(usePlayerStore.getState().decks).length + 1}`;

    saveDeck(newDeckName, { name: newDeckName, cards: [] });

    setCurrentDeck(newDeckName);
  };

  const handleDeleteDeck = () => {
    if (currentDeck !== "DefaultDeck") {
      deleteDeck(currentDeck);
      setCurrentDeck("DefaultDeck");
    }
  };

  return (
    <div className="my-deck-buttons-container">
      <button className="my-deck-button">Back</button>
      <button className="my-deck-button">Save deck</button>
      <button className="my-deck-button" onClick={handleNewDeck}>
        New deck
      </button>
      <button className="my-deck-button" onClick={handleDeleteDeck}>
        Delete deck
      </button>
    </div>
  );
}
