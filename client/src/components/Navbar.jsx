const Navbar = () => {
  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-700">
        SCMC Dashboard
      </h1>

      <button className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600">
        Logout
      </button>
    </div>
  );
};

export default Navbar;