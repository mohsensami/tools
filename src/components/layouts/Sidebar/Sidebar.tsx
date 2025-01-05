import Logo from '../../Logo';
import MenuItem from './MenuItem';

const menu = [
    { name: 'Home', icon: 'Home', link: '/' },
    { name: 'Movies', icon: 'Movies', link: '/movies' },
    { name: 'PowerSupply', icon: 'Power', link: '/power-supply-calculator' },
];

const Sidebar = () => {
    return (
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
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
