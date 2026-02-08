"""
========================================================================
Weather ML Model — Training Script
========================================================================

This script trains two machine learning models:
  1. Rain Predictor (Binary Classification)
  2. Comfort Level Predictor (Multi-class Classification)

Both use Random Forest classifiers because they:
  - Work well with small datasets
  - Don't require feature scaling
  - Provide feature importance
  - Are easy to understand for beginners
  - Perform well out-of-the-box

After training, models are saved to disk and can be loaded by the API.

========================================================================
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)
import joblib
import os

# Feature columns (inputs to the model)
FEATURE_COLUMNS = [
    'temperature',
    'humidity',
    'wind_speed',
    'visibility',
    'clouds',
    'pressure',
    'rain_1h'
]

def train_rain_model(X_train, X_test, y_train, y_test):
    """
    Train a model to predict: Will it rain? (Yes/No)
    
    This is a BINARY CLASSIFICATION problem.
    """
    print("\n" + "="*60)
    print("🌧️  Training Rain Prediction Model")
    print("="*60)
    
    # Create and train the model
    model = RandomForestClassifier(
        n_estimators=100,      # 100 decision trees
        max_depth=10,          # Prevent overfitting
        random_state=42,       # Reproducible results
        n_jobs=-1              # Use all CPU cores
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate on test set
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\n✓ Model trained successfully!")
    print(f"  Accuracy: {accuracy * 100:.2f}%")
    
    print("\n📊 Detailed Performance:")
    print(classification_report(
        y_test, 
        y_pred, 
        target_names=['No Rain', 'Rain']
    ))
    
    print("🔢 Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    # Feature importance
    importance = pd.DataFrame({
        'feature': FEATURE_COLUMNS,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\n🎯 Feature Importance (what matters most for rain prediction):")
    print(importance.to_string(index=False))
    
    return model


def train_comfort_model(X_train, X_test, y_train, y_test):
    """
    Train a model to predict: Comfort Level (Low/Medium/High)
    
    This is a MULTI-CLASS CLASSIFICATION problem.
    """
    print("\n" + "="*60)
    print("😊  Training Comfort Level Prediction Model")
    print("="*60)
    
    # Create and train the model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=12,          # Slightly deeper for 3 classes
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\n✓ Model trained successfully!")
    print(f"  Accuracy: {accuracy * 100:.2f}%")
    
    print("\n📊 Detailed Performance:")
    print(classification_report(
        y_test, 
        y_pred, 
        target_names=['Low Comfort', 'Medium Comfort', 'High Comfort']
    ))
    
    print("🔢 Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    # Feature importance
    importance = pd.DataFrame({
        'feature': FEATURE_COLUMNS,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\n🎯 Feature Importance (what matters most for comfort):")
    print(importance.to_string(index=False))
    
    return model


def main():
    """Main training pipeline"""
    
    print("="*60)
    print("🚀  Weather ML Model Training")
    print("="*60)
    
    # 1. Load training data
    print("\n📂 Loading training data...")
    
    if not os.path.exists('weather_training_data.csv'):
        print("❌ Training data not found!")
        print("   Run: python generate_training_data.py")
        return
    
    df = pd.read_csv('weather_training_data.csv')
    print(f"✓ Loaded {len(df)} samples")
    
    # 2. Prepare features (X) and targets (y)
    X = df[FEATURE_COLUMNS]
    y_rain = df['will_rain']
    y_comfort = df['comfort_level']
    
    # 3. Split into training and testing sets (80/20 split)
    print("\n📊 Splitting data: 80% training, 20% testing...")
    X_train, X_test, y_rain_train, y_rain_test = train_test_split(
        X, y_rain, test_size=0.2, random_state=42
    )
    _, _, y_comfort_train, y_comfort_test = train_test_split(
        X, y_comfort, test_size=0.2, random_state=42
    )
    
    print(f"  Training samples: {len(X_train)}")
    print(f"  Testing samples: {len(X_test)}")
    
    # 4. Train both models
    rain_model = train_rain_model(X_train, X_test, y_rain_train, y_rain_test)
    comfort_model = train_comfort_model(X_train, X_test, y_comfort_train, y_comfort_test)
    
    # 5. Save models to disk
    print("\n" + "="*60)
    print("💾  Saving Models")
    print("="*60)
    
    os.makedirs('models', exist_ok=True)
    
    joblib.dump(rain_model, 'models/rain_model.pkl')
    print("✓ Saved: models/rain_model.pkl")
    
    joblib.dump(comfort_model, 'models/comfort_model.pkl')
    print("✓ Saved: models/comfort_model.pkl")
    
    # Save feature names for the API
    joblib.dump(FEATURE_COLUMNS, 'models/feature_names.pkl')
    print("✓ Saved: models/feature_names.pkl")
    
    print("\n" + "="*60)
    print("✅  Training Complete!")
    print("="*60)
    print("\nNext steps:")
    print("  1. Run the API server: python api_server.py")
    print("  2. Test predictions: python test_model.py")
    print("  3. Integrate with React frontend")


if __name__ == "__main__":
    main()
