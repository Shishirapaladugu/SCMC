import Layout from "../components/Layout";

const Dashboard = () => {
  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800">
        Dashboard
      </h1>

      <p className="text-gray-500 mt-2">
        Welcome to SCMC System 🚔
      </p>

      <div className="grid grid-cols-3 gap-6 mt-8">
        
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-gray-600">Total Cases</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">120</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-gray-600">Pending</h2>
          <p className="text-3xl font-bold text-yellow-500 mt-2">45</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-gray-600">Resolved</h2>
          <p className="text-3xl font-bold text-green-500 mt-2">75</p>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;