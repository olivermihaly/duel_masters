import Card from "../../components/Card";
import ListCard from "./ListCard";
import PanelHeader from "./PanelHeader";
import image from "../../assets/cards/aqua_knight.png";
import image2 from "../../assets/cards/aqua_hulcus.png";
import image3 from "../../assets/cards/aqua_sniper.png";
import image4 from "../../assets/cards/aqua_soldier.png";
import image5 from "../../assets/cards/aqua_vehicle.png";
import image6 from "../../assets/cards/astrocomet_dragon.png";
import image7 from "../../assets/cards/deathliger_lion_of_chaos.png";
import image8 from "../../assets/cards/bloody_squito.png";
import image9 from "../../assets/cards/chilias_the_oracle.png";
import image10 from "../../assets/cards/fatal_attacker_horvath.png";
import image11 from "../../assets/cards/bolshack_dragon.png";
import image12 from "../../assets/cards/unicorn_fish.png";
import image13 from "../../assets/cards/urth_purifying_elemental.png";
import image14 from "../../assets/cards/artisan_picora.png";

export default function CardList() {
  return (
    <div className="card-list">
      <PanelHeader title="Card List" />
      <div className="card-list-cards">
        <ListCard src={image} />
        <ListCard src={image2} />
        <ListCard src={image3} />
        <ListCard src={image4} />
        <ListCard src={image5} />
        <ListCard src={image6} />
        <ListCard src={image7} />
        <ListCard src={image8} />
        <ListCard src={image9} />
        <ListCard src={image10} />
        <ListCard src={image11} />
        <ListCard src={image12} />
        <ListCard src={image13} />
        <ListCard src={image14} />
      </div>
    </div>
  );
}
