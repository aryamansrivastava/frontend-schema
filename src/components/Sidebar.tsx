import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiHome,
  FiBook,
  FiCheckSquare,
  FiBarChart2,
  FiChevronDown,
} from "react-icons/fi";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", path: "/", icon: <FiHome size={24} /> },
    { name: "Institute", path: "/institutes", icon: <FiBook size={24} /> },
    {
      name: "Attendance",
      path: "/attendance",
      icon: <FiCheckSquare size={24} />,
    },
    { name: "Results", path: "/results", icon: <FiBarChart2 size={24} /> },
    {
      name: "Drag and Drop",
      path: "/drag-drop",
      icon: <FiChevronDown size={24} />,
    },
  ];

  return (
    <aside
      className={`bg-gray-900 text-white h-screen transition-all duration-300 shadow-lg ${
        isCollapsed ? "w-16" : "w-64"
      } flex flex-col`}
    >
      <div className="p-4 flex justify-between items-center">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white focus:outline-none"
        >
          {isCollapsed ? <FiMenu size={24} /> : <FiX size={24} />}
        </button>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2 mt-4">
          {menuItems.map((item, index) => (
            <li
              key={index}
              onClick={() => navigate(item.path)}
              className="flex items-center p-3 hover:bg-gray-700 rounded-md cursor-pointer"
            >
              <span className="text-white">{item.icon}</span>
              {!isCollapsed && (
                <Link to={item.path} className="ml-4 text-white text-lg">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
