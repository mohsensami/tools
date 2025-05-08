import { NavLink } from "react-router-dom";
import { ReactElement } from "react";

type MenuItemProps = {
  name: string;
  icon: ReactElement;
  link: string;
};

const MenuItem = (props: MenuItemProps) => {
  return (
    <div className="mb-2">
      <NavLink
        to={props.link}
        className={({ isActive }) =>
          `flex items-center p-3 text-gray-900 rounded-lg dark:text-white 
          transition-all duration-200 ease-in-out
          ${
            isActive
              ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500"
              : "hover:bg-gray-100 dark:hover:bg-gray-700 border-l-4 border-transparent"
          }`
        }
      >
        <div className="text-gray-600 dark:text-gray-300">{props.icon}</div>
        <span className="ml-3 font-medium">{props.name}</span>
      </NavLink>
    </div>
  );
};

export default MenuItem;
