import { ChangeEvent } from "react";
import usePlayerStore from "../../stores/usePlayerStore";

export default function DeckSelector() {
  const { decks, setCurrentDeck } = usePlayerStore((state) => ({
    decks: state.decks,
    setCurrentDeck: state.setCurrentDeck,
  }));

  // Handle change in deck selection
  const handleDeckChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrentDeck(event.target.value);
  };

  return (
    <select className="deck-selector" name="decks" id="decks" onChange={handleDeckChange}>
      {Object.keys(decks).map((deckName) => (
        <option key={deckName} value={deckName}>
          {deckName}
        </option>
      ))}
    </select>
  );
}
