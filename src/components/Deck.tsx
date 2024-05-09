import Card from "./Card";
import AquaHulcusImage from "../assets/cards/aqua_hulcus.png";
/*import Img2 from "../assets/cards/aqua_knight.png";
import Img3 from "../assets/cards/aqua_sniper.png";
import Img4 from "../assets/cards/aqua_vehicle.png";
import Img5 from "../assets/cards/astrocomet_dragon.png";
import Img6 from "../assets/cards/creeping_plague.png";
import Img7 from "../assets/cards/wanderning_braineater.png";*/

export const DECK: CardProperties[] = [
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
  {
    src: AquaHulcusImage,
    manaCost: 7,
    name: "Hello",
    attackPower: 5000,
  },
];

export default function Deck() {
  return (
    <>
      {DECK.map((card, index) => {
        return (
          <Card
            startPosition={{ x: 150 + index * 0.3, y: 340 - index * 0.3 }}
            card={card}
          />
        );
      })}
    </>
  );
}
