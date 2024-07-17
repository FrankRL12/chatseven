import BarraLateral from "./BarraLateral";
import ContainerChat from "./ContainerChat";
import Navegacio from "./Navegacio";
import "./css/PaginaDeChat.css";

export default function PaginaDeChat() {
  return (
    <div className="chat-pagina">
      <div className="chat-pagina-container">
        <Navegacio />
        <BarraLateral/>
        <ContainerChat/>
      </div>
    </div>
  );
}
