import { create } from "zustand";

export type Card = {
  src: string;
};

export type Deck = {
  name: string;
  cards: Card[];
};

export type PlayerProps = {
  username: string;
  decks: Record<string, Deck>;
  currentDeck: string;
  saveDeck: (name: string, deck: Deck) => void;
  addCardToDeck: (deckName: string, card: Card) => void;
  removeCardFromDeck: (deckName: string, index: number) => void;
  deleteDeck: (name: string) => void;
  setCurrentDeck: (currentDeck: string) => void;
};

const usePlayerStore = create<PlayerProps>((set, get) => ({
  decks: { DefaultDeck: { name: "DefaultDeck", cards: [] } },
  username: "",
  currentDeck: "DefaultDeck",

  setCurrentDeck: (currentDeck) => set({ currentDeck }),

  saveDeck: (name, deck) => {
    const { decks } = get();
    if (decks[name]) {
      console.error(`Deck with name "${name}" already exists.`);
      return;
    }
    set({
      decks: {
        ...decks,
        [name]: {
          ...deck,
          cards: deck.cards || [],
        },
      },
    });
  },

  deleteDeck: (name) => {
    const { decks, currentDeck } = get();
    if (name === "DefaultDeck") {
      console.error(`Cannot delete the default deck.`);
      return;
    }

    const { [name]: _, ...rest } = decks;
    set({
      decks: rest,
      currentDeck: currentDeck === name ? "DefaultDeck" : currentDeck,
    });
  },

  addCardToDeck: (deckName, card) => {
    const { decks } = get();
    const deck = decks[deckName];

    if (deck) {
      const updatedDeck = {
        ...deck,
        cards: [...deck.cards, card].sort((a, b) => a.src.localeCompare(b.src)),
      };
      set({ decks: { ...decks, [deckName]: updatedDeck } });
    } else {
      console.error(`Deck with name "${deckName}" does not exist.`);
    }
  },

  removeCardFromDeck: (deckName, index) => {
    const { decks } = get();
    const deck = decks[deckName];

    if (deck && index >= 0 && index < deck.cards.length) {
      const updatedCards = deck.cards.filter((_, i) => i !== index);
      set({ decks: { ...decks, [deckName]: { ...deck, cards: updatedCards } } });
    } else {
      console.error(`Deck with name "${deckName}" does not exist or index is out of bounds.`);
    }
  },
}));

export default usePlayerStore;
