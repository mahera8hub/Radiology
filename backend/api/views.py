

# from django.http import JsonResponse
# from rest_framework.decorators import api_view
# import tensorflow as tf
# from tensorflow.keras.preprocessing import image
# from tensorflow.keras.applications.efficientnet import preprocess_input
# import numpy as np
# import os

# # Base directory
# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# # Load model once
# MODEL_PATH = os.path.join(BASE_DIR, 'model', 'efficientnet_finetuned_brain_tumor.keras')
# model = tf.keras.models.load_model(MODEL_PATH)

# # Class labels (must match training)
# CLASS_NAMES = ["Glioma", "Meningioma", "No Tumor", "Pituitary"]

# @api_view(['POST'])
# def predict_tumor(request):
#     import tensorflow as tf
#     file = request.FILES.get('file')
#     if not file:
#         return JsonResponse({'error': 'No file uploaded'}, status=400)

#     # Temp directory
#     temp_dir = os.path.join(BASE_DIR, 'temp')
#     os.makedirs(temp_dir, exist_ok=True)
#     temp_path = os.path.join(temp_dir, file.name)

#     with open(temp_path, 'wb+') as f:
#         for chunk in file.chunks():
#             f.write(chunk)

#     # Preprocess image
#     img = image.load_img(temp_path, target_size=(224, 224))
#     img_array = image.img_to_array(img)
#     img_array = np.expand_dims(img_array, axis=0)
#     img_array = preprocess_input(img_array)

#     # Predict
#     prediction = model.predict(img_array)
#     predicted_class = CLASS_NAMES[np.argmax(prediction)]
#     confidence = float(np.max(prediction))

#     return JsonResponse({
#         'predicted_class': predicted_class,
#         'confidence': confidence
#     })



from django.http import JsonResponse
from rest_framework.decorators import api_view
import os
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.efficientnet import preprocess_input

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'model', 'efficientnet_finetuned_brain_tumor.keras')

CLASS_NAMES = ["Glioma", "Meningioma", "No Tumor", "Pituitary"]

model = None

def get_model():
    global model
    if model is None:
        model = tf.keras.models.load_model(MODEL_PATH)
    return model



@api_view(['POST'])
def predict_tumor(request):
    file = request.FILES.get('image')
    if not file:
        return JsonResponse({'error': 'No image uploaded'}, status=400)

    temp_dir = os.path.join(BASE_DIR, 'temp')
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, file.name)

    with open(temp_path, 'wb+') as f:
        for chunk in file.chunks():
            f.write(chunk)

    img = image.load_img(temp_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    model = get_model()  # ✅ TF loads HERE, not earlier

    preds = model.predict(img_array)
    predicted_class = CLASS_NAMES[np.argmax(preds)]
    confidence = float(np.max(preds))

    return JsonResponse({
        "prediction": predicted_class,
        "confidence": round(confidence * 100, 2)
    })


def home(request):
    return JsonResponse({"status": "Radiology Brain Tumor Detection API is running."})
