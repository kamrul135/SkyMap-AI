"""
========================================================================
Weather ML Model — Flask API Server
========================================================================

This is a simple REST API that serves ML predictions to your React app.

Endpoints:
  POST /predict
    Input: JSON with weather features
    Output: Rain prediction + Comfort level + probabilities

The React app calls this instead of the rule-based aiEngine.js

How to run:
  python api_server.py

Then test:
  curl -X POST http://localhost:5000/predict \
    -H "Content-Type: application/json" \
    -d '{"temperature":22, "humidity":60, "wind_speed":3, ...}'

========================================================================
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Allow React frontend to call this API

# Load trained models (do this once at startup)
print("Loading ML models...")
try:
    rain_model = joblib.load('models/rain_model.pkl')
    comfort_model = joblib.load('models/comfort_model.pkl')
    feature_names = joblib.load('models/feature_names.pkl')
    print("✓ Models loaded successfully")
except Exception as e:
    print(f"❌ Error loading models: {e}")
    print("   Run: python train_model.py first")
    exit(1)


@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        'status': 'online',
        'message': 'Weather ML API is running',
        'version': '1.0.0',
        'endpoints': ['/predict']
    })


@app.route('/predict', methods=['POST'])
def predict():
    """
    Main prediction endpoint.
    
    Expected input (JSON):
    {
        "temperature": 22.0,
        "humidity": 60.0,
        "wind_speed": 3.5,
        "visibility": 10.0,
        "clouds": 40.0,
        "pressure": 1013.0,
        "rain_1h": 0.0
    }
    
    Returns (JSON):
    {
        "will_rain": true,
        "rain_probability": 0.75,
        "comfort_level": "High",
        "comfort_probabilities": {
            "Low": 0.05,
            "Medium": 0.25,
            "High": 0.70
        },
        "explanation": "..."
    }
    """
    try:
        # Get input data
        data = request.get_json()
        
        # Validate required fields
        for feature in feature_names:
            if feature not in data:
                return jsonify({
                    'error': f'Missing required field: {feature}'
                }), 400
        
        # Extract features in correct order
        features = [data[f] for f in feature_names]
        X = np.array([features])
        
        # Predict rain
        rain_prediction = rain_model.predict(X)[0]
        rain_proba = rain_model.predict_proba(X)[0]
        
        # Predict comfort
        comfort_prediction = comfort_model.predict(X)[0]
        comfort_proba = comfort_model.predict_proba(X)[0]
        
        # Map comfort level to label
        comfort_labels = ['Low', 'Medium', 'High']
        comfort_label = comfort_labels[comfort_prediction]
        
        # Generate human-readable explanation
        explanation = generate_explanation(
            data, 
            bool(rain_prediction), 
            comfort_label,
            rain_proba[1],
            comfort_proba
        )
        
        # Build response
        response = {
            'will_rain': bool(rain_prediction),
            'rain_probability': float(rain_proba[1]),  # Probability of rain
            'comfort_level': comfort_label,
            'comfort_probabilities': {
                'Low': float(comfort_proba[0]),
                'Medium': float(comfort_proba[1]),
                'High': float(comfort_proba[2])
            },
            'explanation': explanation,
            'model_version': '1.0.0'
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Prediction failed'
        }), 500


def generate_explanation(data, will_rain, comfort, rain_prob, comfort_prob):
    """Generate human-readable explanation for the prediction"""
    
    explanation = []
    
    # Temperature
    temp = data['temperature']
    if 18 <= temp <= 26:
        explanation.append(f"Temperature is ideal at {temp}°C")
    elif temp < 10:
        explanation.append(f"Temperature is cold at {temp}°C")
    elif temp > 32:
        explanation.append(f"Temperature is hot at {temp}°C")
    else:
        explanation.append(f"Temperature is moderate at {temp}°C")
    
    # Rain
    if will_rain:
        explanation.append(f"Rain is likely ({rain_prob*100:.0f}% probability)")
    else:
        explanation.append(f"Low rain chance ({rain_prob*100:.0f}% probability)")
    
    # Comfort summary
    if comfort == "High":
        explanation.append("Overall conditions are very comfortable")
    elif comfort == "Medium":
        explanation.append("Conditions are moderately comfortable")
    else:
        explanation.append("Conditions may be uncomfortable")
    
    return ". ".join(explanation) + "."


@app.route('/health', methods=['GET'])
def health():
    """Health check for production monitoring"""
    return jsonify({'status': 'healthy'})


if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀  Weather ML API Server")
    print("="*60)
    print("\nServer running on: http://localhost:5000")
    print("Endpoints:")
    print("  GET  /         - API info")
    print("  POST /predict  - Get predictions")
    print("  GET  /health   - Health check")
    print("\nPress Ctrl+C to stop")
    print("="*60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
