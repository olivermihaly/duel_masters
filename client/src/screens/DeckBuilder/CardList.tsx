import Card from "../../components/Card";
import ListCard, { DraggableListCard } from "./ListCard";
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
import image15 from "../../assets/newCards/015fd6bb-37a9-45cf-bb6b-a5497412b880.jpg";

export default function CardList() {
  return (
    <div className="card-list">
      <PanelHeader title="Card List" />
      <div className="card-list-cards">
        <DraggableListCard src={image} />
        <DraggableListCard src={image2} />
        <DraggableListCard src={image3} />
        <DraggableListCard src={image4} />
        <DraggableListCard src={image5} />
        <DraggableListCard src={image6} />
        <DraggableListCard src={image7} />
        <DraggableListCard src={image8} />
        <DraggableListCard src={image9} />
        <DraggableListCard src={image10} />
        <DraggableListCard src={image11} />
        <DraggableListCard src={image12} />
        <DraggableListCard src={image13} />
        <DraggableListCard src={image14} />
        <DraggableListCard src={image15} />
      </div>
    </div>
  );
}
