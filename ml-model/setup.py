#!/usr/bin/env python3
"""
Quick start script for ML model setup.
Runs all steps in sequence.
"""

import subprocess
import sys
import os

def run_command(cmd, description):
    """Run a command and handle errors"""
    print(f"\n{'='*60}")
    print(f"📌 {description}")
    print('='*60)
    result = subprocess.run(cmd, shell=True)
    if result.returncode != 0:
        print(f"\n❌ Failed: {description}")
        sys.exit(1)
    print(f"✅ Success: {description}")

def main():
    print("""
╔════════════════════════════════════════════════════════════╗
║         Weather ML Model — Quick Start Setup              ║
╚════════════════════════════════════════════════════════════╝

This script will:
  1. Check Python version
  2. Install dependencies
  3. Generate training data
  4. Train models
  5. Test predictions
  6. Show next steps

Estimated time: 2-3 minutes
    """)
    
    input("Press Enter to continue...")
    
    # Check Python version
    print("\n🐍 Python version:")
    print(f"   {sys.version}")
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ required")
        sys.exit(1)
    
    # Install dependencies
    run_command(
        f"{sys.executable} -m pip install -r requirements.txt",
        "Installing Python packages"
    )
    
    # Generate data
    run_command(
        f"{sys.executable} generate_training_data.py",
        "Generating training data"
    )
    
    # Train models
    run_command(
        f"{sys.executable} train_model.py",
        "Training ML models"
    )
    
    # Test models
    run_command(
        f"{sys.executable} test_model.py",
        "Testing predictions"
    )
    
    print(f"""
╔════════════════════════════════════════════════════════════╗
║                  🎉 Setup Complete!                        ║
╚════════════════════════════════════════════════════════════╝

Next steps:

1. Start the API server:
   python api_server.py

2. Test the API:
   curl -X POST http://localhost:5000/predict \\
     -H "Content-Type: application/json" \\
     -d '{{"temperature": 22, "humidity": 60, "wind_speed": 3.5, "visibility": 10, "clouds": 40, "pressure": 1013, "rain_1h": 0}}'

3. Integrate with React:
   - Open: src/services/mlAdapter.js
   - Change: CURRENT_PROVIDER = AI_PROVIDERS.REST_API
   - Save and rebuild React app

See INTEGRATION_GUIDE.md for more details.
    """)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Setup cancelled by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)
