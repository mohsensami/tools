import { NavLink } from "react-router-dom";

type MenuItemProps = {
  name: string;
  icon: string;
  link: string;
};

const MenuItem = (props: MenuItemProps) => {
  return (
    <div>
      <NavLink
        to={props.link}
        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
      >
        {props.icon}
        <span className="ml-3">{props.name}</span>
      </NavLink>
    </div>
  );
};

export default MenuItem;
