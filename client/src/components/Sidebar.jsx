import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-5">
      
      <h2 className="text-2xl font-bold mb-8 text-center">
        🚔 SCMC
      </h2>

      <ul className="space-y-4">
        <li>
          <Link to="/dashboard" className="block p-2 rounded hover:bg-gray-700">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/report" className="block p-2 rounded hover:bg-gray-700">
            Report Crime
          </Link>
        </li>
        <li>
          <Link to="/cases" className="block p-2 rounded hover:bg-gray-700">
            View Cases
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;