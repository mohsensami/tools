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
  Image,
  Brush,
  MonitorPlay,
  MessageCircle,
  MapPinned,
  Sparkle,
} from "lucide-react";

const menu = [
  // { name: "Home", icon: <House />, link: "/" },
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
  { name: "Photoshop", icon: <Image />, link: "/photoshop" },
  { name: "Paint", icon: <Brush />, link: "/paint" },
  { name: "Player", icon: <MonitorPlay />, link: "/player" },
  { name: "Chat", icon: <MessageCircle />, link: "/chat" },
  { name: "Map", icon: <MapPinned />, link: "/map" },
  { name: "Gold", icon: <Sparkle />, link: "/gold" },
];

const Sidebar = () => {
  return (
    <div
      id="sidebar"
      className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="mb-6">
        <Logo />
      </div>
      <ul className="space-y-1 font-medium">
        {menu.map((item) => (
          <li key={item.link}>
            <MenuItem name={item.name} icon={item.icon} link={item.link} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
