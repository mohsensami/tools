import Logo from "../../Logo";
import MenuItem from "./MenuItem";

import {
  House,
  Clapperboard,
  CloudHail,
  Camera,
  QrCode,
  Cable,
  BookA,
  Clock,
  Newspaper,
  SquareStack,
  Bitcoin,
} from "lucide-react";

const menu = [
  { name: "Home", icon: <House />, link: "/" },
  { name: "Movies", icon: <Clapperboard />, link: "/movies" },
  { name: "PowerSupply", icon: <Cable />, link: "/power-supply-calculator" },
  { name: "Crypto", icon: <Bitcoin />, link: "/crypto" },
  { name: "Weather", icon: <CloudHail />, link: "/weather" },
  { name: "Dictionary", icon: <BookA />, link: "/dictionary" },
  { name: "Qr-code", icon: <QrCode />, link: "/qr-code" },
  { name: "Times", icon: <Clock />, link: "/times" },
  { name: "News", icon: <Newspaper />, link: "/news" },
  { name: "Unsplash", icon: <Camera />, link: "/unsplash" },
  { name: "Lorem", icon: <SquareStack />, link: "/lorem" },
  { name: "Paint", icon: <SquareStack />, link: "/paint" },
];

const Sidebar = () => {
  return (
    <div
      id="sidebar"
      className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800"
    >
      <Logo />
      <ul className="space-y-2 font-medium">
        <li>
          {menu.map((item) => (
            <MenuItem name={item.name} icon={item.icon} link={item.link} />
          ))}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
