import { create } from "zustand";

export interface IMyDecks {
  deck: Deck;
  setDeck: (deck: Deck) => void;
  addCardToDeck: (card: Card) => void;
}

const useMyDecksStore = create<IMyDecks>((set, get) => ({
  deck: { name: "Deck1", deck: [] },

  setDeck: (deck: Deck) => set({ deck }),

  addCardToDeck: (card: Card) => {
    const { deck } = get();
    const copy = [...deck.deck];

    copy.push(card);

    set({ deck: { name: deck.name, deck: copy } });
  },
}));

export default useMyDecksStore;
