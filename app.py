from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import io
import tensorflow as tf
import os

app = Flask(__name__)
CORS(app)

# Updated class names to match your dataset
CLASS_NAMES = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']

# Define biodegradable categories
BIODEGRADABLE_ITEMS = ['cardboard', 'paper']
NON_BIODEGRADABLE_ITEMS = ['glass', 'metal', 'plastic', 'trash']

def get_biodegradability(class_name):
    """Determine if an item is biodegradable based on its class"""
    if class_name.lower() in [item.lower() for item in BIODEGRADABLE_ITEMS]:
        return "Biodegradable"
    elif class_name.lower() in [item.lower() for item in NON_BIODEGRADABLE_ITEMS]:
        return "Non-Biodegradable"
    else:
        return "Unknown"

def get_disposal_info(class_name):
    """Get disposal information for each category"""
    disposal_info = {
        'cardboard': {
            'biodegradable': True,
            'recycling_info': 'Recyclable - clean and flatten before recycling',
            'decomposition_time': '2-3 months'
        },
        'paper': {
            'biodegradable': True,
            'recycling_info': 'Recyclable - remove any plastic coating',
            'decomposition_time': '2-6 weeks'
        },
        'glass': {
            'biodegradable': False,
            'recycling_info': 'Highly recyclable - clean before recycling',
            'decomposition_time': '1 million years'
        },
        'metal': {
            'biodegradable': False,
            'recycling_info': 'Recyclable - clean cans and containers',
            'decomposition_time': '50-500 years'
        },
        'plastic': {
            'biodegradable': False,
            'recycling_info': 'Check recycling number - not all plastics are recyclable',
            'decomposition_time': '450-1000 years'
        },
        'trash': {
            'biodegradable': False,
            'recycling_info': 'General waste - dispose in regular trash bin',
            'decomposition_time': 'Varies greatly'
        }
    }
    return disposal_info.get(class_name.lower(), {})

# Try to load the model with better debugging
try:
    # Check current directory
    current_dir = os.getcwd()
    print(f"Current directory: {current_dir}")
    
    # List all .h5 files
    h5_files = [f for f in os.listdir('.') if f.endswith('.h5')]
    print(f"Found .h5 files: {h5_files}")
    
    model_path = 'waste_classifier_model.h5'
    
    # Try alternative names if main one doesn't exist
    if not os.path.exists(model_path):
        possible_names = [
            'waste_classifier.h5',
            'waste_classification_model.h5',
            'model.h5',
            'garbage_classifier.h5'
        ]
        
        for name in possible_names:
            if os.path.exists(name):
                model_path = name
                print(f"Found model with alternative name: {name}")
                break
        else:
            print(f"Model file not found. Looking for: {model_path}")
            print(f"Available .h5 files: {h5_files}")
            raise FileNotFoundError(f"No model file found. Available .h5 files: {h5_files}")
    
    print(f"Loading model from: {model_path}")
    model = tf.keras.models.load_model(model_path)
    print("Model loaded successfully!")
    print(f"Model input shape: {model.input_shape}")
    print(f"Model output shape: {model.output_shape}")
    
    # Verify the model has 6 outputs (for 6 classes)
    if model.output_shape[-1] != 6:
        print(f"WARNING: Model has {model.output_shape[-1]} outputs, expected 6 for garbage classification")
    
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded. Check server logs.'}), 500

    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # Read and process image
        img = Image.open(file.stream).convert('RGB').resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        print(f"Image shape for prediction: {img_array.shape}")
        
        # Make prediction
        preds = model.predict(img_array)
        print(f"Raw predictions: {preds}")
        
        # Get class index and confidence
        class_idx = int(np.argmax(preds, axis=1)[0])
        confidence = float(np.max(preds))
        
        # Get the predicted class name
        predicted_class = CLASS_NAMES[class_idx]
        
        # Determine biodegradability
        biodegradability = get_biodegradability(predicted_class)
        
        # Get disposal information
        disposal_info = get_disposal_info(predicted_class)
        
        # Create all predictions with class names
        all_predictions = []
        for i, pred in enumerate(preds[0]):
            all_predictions.append({
                'class': CLASS_NAMES[i],
                'confidence': float(pred),
                'biodegradable': get_biodegradability(CLASS_NAMES[i])
            })
        
        # Sort predictions by confidence
        all_predictions.sort(key=lambda x: x['confidence'], reverse=True)
        
        result = {
            'predicted_class': predicted_class,
            'biodegradability': biodegradability,
            'confidence': confidence,
            'disposal_info': disposal_info,
            'all_predictions': all_predictions
        }
        
        print(f"Prediction result: {result}")
        return jsonify(result)
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': f'Error processing image: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'expected_classes': CLASS_NAMES,
        'biodegradable_items': BIODEGRADABLE_ITEMS,
        'non_biodegradable_items': NON_BIODEGRADABLE_ITEMS
    })

@app.route('/classes', methods=['GET'])
def get_classes():
    """Get information about all supported classes"""
    class_info = []
    for class_name in CLASS_NAMES:
        info = {
            'class': class_name,
            'biodegradable': get_biodegradability(class_name),
            'disposal_info': get_disposal_info(class_name)
        }
        class_info.append(info)
    
    return jsonify({
        'classes': class_info,
        'total_classes': len(CLASS_NAMES)
    })

if __name__ == '__main__':
    print("Starting Flask server...")
    print(f"Supported classes: {CLASS_NAMES}")
    print(f"Biodegradable items: {BIODEGRADABLE_ITEMS}")
    print(f"Non-biodegradable items: {NON_BIODEGRADABLE_ITEMS}")
    app.run(host='0.0.0.0', port=5000, debug=True)