import Logo from "../../Logo";
import MenuItem from "./MenuItem";

const menu = [
  { name: "Home", icon: "Home", link: "/" },
  { name: "Movies", icon: "Movies", link: "/movies" },
  { name: "PowerSupply", icon: "Power", link: "/power-supply-calculator" },
  { name: "weather", icon: "weather", link: "/weather" },
  { name: "dictionary", icon: "dictionary", link: "/dictionary" },
  { name: "qr-code", icon: "qr-code", link: "/qr-code" },
  { name: "times", icon: "times", link: "/times" },
  { name: "deepseek", icon: "deepseek", link: "/deepseek" },
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
