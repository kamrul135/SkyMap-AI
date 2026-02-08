"""
========================================================================
ML Model Test Script
========================================================================

This script tests the trained models with sample weather data.
Use this to verify your models work before deploying the API.

========================================================================
"""

import joblib
import numpy as np
import pandas as pd

# Load models
print("Loading models...")
rain_model = joblib.load('models/rain_model.pkl')
comfort_model = joblib.load('models/comfort_model.pkl')
feature_names = joblib.load('models/feature_names.pkl')
print("✓ Models loaded\n")

# Test cases
test_cases = [
    {
        'name': '☀️ Perfect Summer Day',
        'temperature': 24.0,
        'humidity': 45.0,
        'wind_speed': 2.5,
        'visibility': 10.0,
        'clouds': 15.0,
        'pressure': 1020.0,
        'rain_1h': 0.0
    },
    {
        'name': '🌧️ Rainy Cold Day',
        'temperature': 8.0,
        'humidity': 85.0,
        'wind_speed': 12.0,
        'visibility': 3.0,
        'clouds': 95.0,
        'pressure': 995.0,
        'rain_1h': 2.5
    },
    {
        'name': '🔥 Hot Humid Day',
        'temperature': 36.0,
        'humidity': 75.0,
        'wind_speed': 1.0,
        'visibility': 8.0,
        'clouds': 60.0,
        'pressure': 1010.0,
        'rain_1h': 0.0
    },
    {
        'name': '❄️ Cold Windy Day',
        'temperature': -5.0,
        'humidity': 40.0,
        'wind_speed': 18.0,
        'visibility': 9.0,
        'clouds': 70.0,
        'pressure': 1025.0,
        'rain_1h': 0.0
    }
]

print("="*70)
print("🧪  Testing ML Models")
print("="*70)

for case in test_cases:
    name = case['name']
    features = [case[f] for f in feature_names]
    X = pd.DataFrame([features], columns=feature_names)
    
    # Predictions
    rain_pred = rain_model.predict(X)[0]
    rain_proba = rain_model.predict_proba(X)[0]
    
    comfort_pred = comfort_model.predict(X)[0]
    comfort_proba = comfort_model.predict_proba(X)[0]
    
    comfort_labels = ['Low', 'Medium', 'High']
    comfort_label = comfort_labels[comfort_pred]
    
    print(f"\n{name}")
    print("-" * 70)
    print(f"  Input: {case['temperature']}°C, {case['humidity']}% humidity, "
          f"{case['wind_speed']} m/s wind, {case['clouds']}% clouds")
    print(f"\n  🌧️  Rain Prediction:")
    print(f"      {'WILL RAIN' if rain_pred else 'NO RAIN'} "
          f"({rain_proba[1]*100:.1f}% confidence)")
    print(f"\n  😊  Comfort Level:")
    print(f"      {comfort_label} ({comfort_proba[comfort_pred]*100:.1f}% confidence)")
    print(f"      Distribution: Low={comfort_proba[0]*100:.0f}%, "
          f"Medium={comfort_proba[1]*100:.0f}%, High={comfort_proba[2]*100:.0f}%")

print("\n" + "="*70)
print("✅  Testing Complete")
print("="*70)
print("\nNext: Start the API server with: python api_server.py")
