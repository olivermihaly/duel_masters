import Card from "../../components/Card";
import ListCard from "./ListCard";
import PanelHeader from "./PanelHeader";
import image from "../../assets/cards/aqua_knight.png";
import image2 from "../../assets/cards/aqua_hulcus.png";

export default function CardList() {
  return (
    <div className="card-list">
      <PanelHeader title="Card List" />
      <div className="card-list-cards">
        <ListCard src={image}/>
        <ListCard src={image}/>
        <ListCard src={image}/>
        <ListCard src={image}/>
        <ListCard src={image}/>
        <ListCard src={image}/>
        <ListCard src={image}/>
        <ListCard src={image}/>
        <ListCard src={image2}/>
        <ListCard src={image2}/>
        <ListCard src={image2}/>
        <ListCard src={image2}/>
        <ListCard src={image2}/>
        <ListCard src={image2}/>
        <ListCard src={image2}/>
        <ListCard src={image2}/>
        <ListCard src={image2}/>
        <ListCard src={image2}/>
        <ListCard src={image2}/>
        <ListCard src={image2}/>
        <ListCard src={image2}/>
        <ListCard src={image2}/>
        <ListCard src={image2}/>
        <ListCard src={image}/>
        <ListCard src={image}/>
        <ListCard src={image}/>
        <ListCard src={image}/>
        <ListCard src={image}/>
        <ListCard src={image}/>
        <ListCard src={image}/>
        <ListCard src={image}/>
        <ListCard src={image}/>
        <ListCard src={image}/>
        <ListCard src={image}/>
        <ListCard src={image}/>
        <ListCard src={image}/>
      </div>
    </div>
  );
}
