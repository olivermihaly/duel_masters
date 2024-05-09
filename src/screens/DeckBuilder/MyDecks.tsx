import DeckSelector from "./DeckSelector";
import MyDeck from "./MyDeck";
import MyDeckButtons from "./MyDeckButtons";
import PanelHeader from "./PanelHeader";

export default function MyDecks() {
  return (
    <div className="my-decks">
      <PanelHeader title="My Decks" />
      <DeckSelector />
      <MyDeck />
      <MyDeckButtons />
    </div>
  );
}
