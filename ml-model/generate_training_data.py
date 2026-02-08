"""
========================================================================
Weather ML Model — Training Data Generator
========================================================================

This script generates synthetic training data for our weather ML model.
In a real-world scenario, you'd use historical weather data from APIs
or datasets like OpenWeather historical data, NOAA, etc.

For learning purposes, we create realistic synthetic data based on
weather patterns and human comfort principles.

Features used:
  - temperature (°C)
  - humidity (%)
  - wind_speed (m/s)
  - visibility (km)
  - clouds (%)
  - pressure (hPa)
  - rain_1h (mm of rain in last hour)

Targets:
  - will_rain (0 = No, 1 = Yes)
  - comfort_level (0 = Low, 1 = Medium, 2 = High)

========================================================================
"""

import pandas as pd
import numpy as np

# Set random seed for reproducibility
np.random.seed(42)

def generate_training_data(n_samples=5000):
    """
    Generate synthetic weather training data.
    
    Parameters:
        n_samples (int): Number of samples to generate
        
    Returns:
        pd.DataFrame: Training data with features and targets
    """
    print(f"Generating {n_samples} training samples...")
    
    data = []
    
    for _ in range(n_samples):
        # Generate base weather features
        temp = np.random.uniform(-10, 45)  # -10°C to 45°C
        humidity = np.random.uniform(10, 100)  # 10% to 100%
        wind_speed = np.random.uniform(0, 25)  # 0 to 25 m/s
        visibility = np.random.uniform(0.1, 10)  # 0.1 to 10 km
        clouds = np.random.uniform(0, 100)  # 0% to 100%
        pressure = np.random.uniform(980, 1040)  # 980 to 1040 hPa
        
        # Rain logic: more likely when cloudy, high humidity, low pressure
        rain_probability = 0
        if clouds > 60:
            rain_probability += 0.3
        if humidity > 70:
            rain_probability += 0.25
        if pressure < 1000:
            rain_probability += 0.2
        if visibility < 3:
            rain_probability += 0.15
        
        will_rain = 1 if np.random.random() < rain_probability else 0
        rain_1h = np.random.uniform(0, 5) if will_rain else 0
        
        # Comfort logic: ideal = 18-26°C, 35-60% humidity, low wind
        comfort_score = 0
        
        # Temperature comfort
        if 18 <= temp <= 26:
            comfort_score += 40
        elif 10 <= temp < 18 or 26 < temp <= 32:
            comfort_score += 25
        elif 0 <= temp < 10 or 32 < temp <= 38:
            comfort_score += 10
        
        # Humidity comfort
        if 35 <= humidity <= 60:
            comfort_score += 25
        elif 25 <= humidity < 35 or 60 < humidity <= 75:
            comfort_score += 15
        elif humidity > 75:
            comfort_score += 5
        
        # Wind comfort
        if wind_speed < 5:
            comfort_score += 20
        elif wind_speed < 10:
            comfort_score += 10
        
        # Visibility comfort
        if visibility > 8:
            comfort_score += 10
        elif visibility > 4:
            comfort_score += 5
        
        # Rain penalty
        if will_rain:
            comfort_score -= 10
        
        # Classify comfort level
        if comfort_score >= 70:
            comfort_level = 2  # High
        elif comfort_score >= 40:
            comfort_level = 1  # Medium
        else:
            comfort_level = 0  # Low
        
        data.append({
            'temperature': round(temp, 1),
            'humidity': round(humidity, 1),
            'wind_speed': round(wind_speed, 2),
            'visibility': round(visibility, 2),
            'clouds': round(clouds, 1),
            'pressure': round(pressure, 1),
            'rain_1h': round(rain_1h, 2),
            'will_rain': will_rain,
            'comfort_level': comfort_level
        })
    
    df = pd.DataFrame(data)
    
    print(f"✓ Generated {len(df)} samples")
    print(f"  - Rain distribution: {df['will_rain'].value_counts().to_dict()}")
    print(f"  - Comfort distribution: {df['comfort_level'].value_counts().to_dict()}")
    
    return df


if __name__ == "__main__":
    # Generate training data
    df = generate_training_data(n_samples=5000)
    
    # Save to CSV
    output_file = "weather_training_data.csv"
    df.to_csv(output_file, index=False)
    print(f"\n✓ Saved training data to: {output_file}")
    
    # Show sample
    print("\n📊 Sample data (first 5 rows):")
    print(df.head())
    
    print("\n📈 Feature statistics:")
    print(df.describe())
