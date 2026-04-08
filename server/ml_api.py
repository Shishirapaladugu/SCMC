from flask import Flask, request, jsonify
from flask_cors import CORS  # <-- Enable CORS
import joblib
import numpy as np
import cv2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.applications import MobileNetV2

app = Flask(__name__)
CORS(app)  # <-- Allow frontend to access the API

# Load model and scaler
model = joblib.load("urban_issue_svm_model(1).pkl")
scaler = joblib.load("urban_issue_scaler.pkl")

# Load base model (feature extractor)
base_model = MobileNetV2(weights='imagenet', include_top=False, pooling='avg')

# Mapping category -> department & priority
category_info = {
    "IllegalParking": {"department": "Traffic Police", "priority": "High"},
    "GarbageOverflow": {"department": "Sanitation", "priority": "Medium"},
    "Pothole": {"department": "Public Works", "priority": "High"},
    "StreetLightFault": {"department": "Electricity", "priority": "Medium"},
    # Add more categories as per your model
}

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    # Read image
    file_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    # Preprocess for MobileNetV2
    img = cv2.resize(img, (224, 224))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = preprocess_input(np.expand_dims(img, axis=0))

    # Feature extraction
    features = base_model.predict(img)

    # Scale
    features_scaled = scaler.transform(features)

    # Predict category
    prediction = model.predict(features_scaled)
    category = str(prediction[0])

    # Get department & priority
    info = category_info.get(category, {"department": "Unknown", "priority": "Low"})

    return jsonify({
        "category": category,
        "department": info["department"],
        "priority": info["priority"]
    })

if __name__ == "__main__":
    app.run(port=5001, debug=True)