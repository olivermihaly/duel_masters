type CardProperties = {
  src: string;
  manaCost: number;
  attackPower: number;
  name: string;
};

type Card = {
  src: string;
};

type Deck = {
  name: string;
  deck: Card[];
};
