import { create } from "zustand";

export interface Card {
  src: string;
}

export interface Deck {
  name: string;
  deck: Card[];
}

export interface IMyDecks {
  deck: Deck;
  setDeck: (deck: Deck) => void;
  addCardToDeck: (card: Card) => void;
  removeCardFromDeck: (index:number) => void
}

const useMyDecksStore = create<IMyDecks>((set, get) => ({
  deck: { name: "Deck1", deck: [] },

  setDeck: (deck: Deck) => set({ deck }),

  addCardToDeck: (card: Card) => {
    const { deck } = get();
    const copy = [...deck.deck];

    copy.push(card);

    set({ deck: { name: deck.name, deck: copy.sort((a, b) => a.src.localeCompare(b.src)) } });
  },

removeCardFromDeck: (index:number) => {
  const { deck } = get();


  let temp = [...deck.deck]

  temp.splice(index,1)

  const updatedeck = {
    name: deck.name,
    deck: temp.sort((a, b) => a.src.localeCompare(b.src))
  };
  set({ deck : updatedeck });
  }
}
));

export default useMyDecksStore;
