# Weather ML Model

Simple machine learning models for weather predictions.

## TL;DR — Get Started in 2 Minutes

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Generate training data
python generate_training_data.py

# 3. Train models
python train_model.py

# 4. Test predictions
python test_model.py

# 5. Start API server
python api_server.py

# 6. In React: change mlAdapter.js provider to REST_API
```

API runs at `http://localhost:5000`

## 📁 Files

| File | Purpose |
|------|---------|
| `generate_training_data.py` | Creates 5,000 synthetic weather samples |
| `train_model.py` | Trains Random Forest models |
| `api_server.py` | Flask REST API to serve predictions |
| `test_model.py` | Tests models with example data |
| `requirements.txt` | Python dependencies |
| `INTEGRATION_GUIDE.md` | Complete integration docs |

## 🎯 Models

1. **Rain Predictor**: Binary classification (Yes/No)
   - Input: 7 weather features
   - Output: Rain probability (0-1)
   - Accuracy: ~85-90%

2. **Comfort Predictor**: Multi-class (Low/Medium/High)
   - Input: 7 weather features  
   - Output: Comfort level + probabilities
   - Accuracy: ~75-85%

## 🧠 Algorithm

**Random Forest Classifier** — chosen because:
- Works well with small datasets
- No feature scaling needed
- Provides feature importance
- Easy to understand
- Great out-of-the-box performance

## 📊 Features (Input)

```
temperature  — °C (-10 to 45)
humidity     — % (0 to 100)
wind_speed   — m/s (0 to 25)
visibility   — km (0 to 10)
clouds       — % (0 to 100)
pressure     — hPa (980 to 1040)
rain_1h      — mm (0 to 10)
```

## 🔌 API Usage

**Request:**
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 22,
    "humidity": 60,
    "wind_speed": 3.5,
    "visibility": 10,
    "clouds": 40,
    "pressure": 1013,
    "rain_1h": 0
  }'
```

**Response:**
```json
{
  "will_rain": false,
  "rain_probability": 0.15,
  "comfort_level": "High",
  "comfort_probabilities": {
    "Low": 0.05,
    "Medium": 0.25,
    "High": 0.70
  },
  "explanation": "Temperature is ideal at 22°C. Low rain chance...",
  "model_version": "1.0.0"
}
```

## 🔄 React Integration

The `mlAdapter.js` is already configured! Just:

1. Start the Python API: `python api_server.py`
2. Change provider in `mlAdapter.js`:
   ```javascript
   const CURRENT_PROVIDER = AI_PROVIDERS.REST_API;
   ```
3. Done! UI automatically uses ML predictions

No component changes needed — the adapter handles everything.

## 📚 Learn More

See `INTEGRATION_GUIDE.md` for:
- Detailed setup instructions
- Model performance metrics
- Customization options
- Deployment guides
- Troubleshooting

## 🚀 Next Steps

- [ ] Collect real weather history data
- [ ] Add more features (UV index, dew point)
- [ ] Try other algorithms (Gradient Boosting, Neural Networks)
- [ ] Deploy API to production
- [ ] A/B test ML vs rules
- [ ] Implement model retraining pipeline
