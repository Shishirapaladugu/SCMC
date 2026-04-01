// src/pages/CitizenPage.jsx
import { useState } from "react";
import axios from "axios";

const CitizenPage = ({ addComplaint }) => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!image) return alert("Select an image");
    const formData = new FormData();
    formData.append("image", image);

    const res = await axios.post("http://127.0.0.1:5001/predict", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setResult(res.data);
    addComplaint(res.data); // send to global state
  };

  return (
    <div>
      <h1>Citizen Dashboard</h1>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleUpload}>Upload & Classify</button>
      {result && <div>
        <p>Category: {result.category}</p>
        <p>Department: {result.department}</p>
        <p>Priority: {result.priority}</p>
      </div>}
    </div>
  );
};

export default CitizenPage;