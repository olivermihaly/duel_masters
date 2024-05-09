import CardList from "./CardList";
import MyDecks from "./MyDecks";
import "./deck-builder.scss";

export default function DeckBuilderScreen() {
  return (
    <div className="deck-builder-container">
      <CardList />
      <MyDecks />
    </div>
  );
}
