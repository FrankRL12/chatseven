import BarraLateral from "./BarraLateral";
import ContainerChat from "./ContainerChat";
import Navegacio from "./Navegacio";
import "./css/PaginaDeChat.css";

export default function PaginaDeChat({ phoneNumber }) {
  return (
    <div className="chat-pagina">
      <div className="chat-pagina-container">
        <Navegacio />
        <BarraLateral phoneNumber={phoneNumber} />
        <ContainerChat phoneNumber={phoneNumber} />
      </div>
    </div>
  );
}
