import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import CitizenPage from "./pages/CitizenPage";
import MunicipalPage from "./pages/MunicipalPage";

const App = () => {
  const [complaints, setComplaints] = useState([]);

  const addComplaint = (complaint) => {
    setComplaints((prev) => [...prev, complaint]);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <nav style={{ padding: "10px", backgroundColor: "#007bff", color: "white" }}>
        <Link to="/" style={{ marginRight: "20px", color: "white", textDecoration: "none" }}>Citizen Dashboard</Link>
        <Link to="/municipal" style={{ color: "white", textDecoration: "none" }}>Municipal Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<CitizenPage addComplaint={addComplaint} />} />
        <Route path="/municipal" element={<MunicipalPage complaints={complaints} />} />
      </Routes>
    </div>
  );
};

export default App;