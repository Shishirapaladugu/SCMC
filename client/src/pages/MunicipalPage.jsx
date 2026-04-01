// src/pages/MunicipalPage.jsx
const MunicipalPage = ({ complaints }) => {
  const grouped = complaints.reduce((acc, c) => {
    if (!acc[c.department]) acc[c.department] = [];
    acc[c.department].push(c);
    return acc;
  }, {});

  return (
    <div>
      <h1>Municipal Dashboard</h1>
      {Object.keys(grouped).map((dept) => (
        <div key={dept}>
          <h2>{dept} Department</h2>
          {grouped[dept].sort((a, b) => b.priority - a.priority).map((c, i) => (
            <div key={i}>
              <p>Issue: {c.category}</p>
              <p>Priority: {c.priority}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MunicipalPage;