
# from django.http import JsonResponse
# from rest_framework.decorators import api_view
# import tensorflow as tf
# from tensorflow.keras.preprocessing import image
# import numpy as np
# import os

# # Model load (only once)
# MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'model', 'efficientnet_finetuned_brain_tumor.keras')
# model = tf.keras.models.load_model(MODEL_PATH)

# # Tumhare trained model ke labels
# CLASS_NAMES = ["Glioma", "Meningioma", "Pituitary", "No Tumor"]

# @api_view(['POST'])
# def predict_tumor(request):
#     file = request.FILES.get('file')
#     if not file:
#         return JsonResponse({'error': 'No file uploaded'}, status=400)

#     temp_path = f"temp/{file.name}"
#     os.makedirs("temp", exist_ok=True)
#     with open(temp_path, 'wb+') as f:
#         for chunk in file.chunks():
#             f.write(chunk)

#     # Image preprocessing
#     img = image.load_img(temp_path, target_size=(224, 224))
#     img_array = image.img_to_array(img)
#     img_array = np.expand_dims(img_array, axis=0) / 255.0

#     prediction = model.predict(img_array)
#     predicted_class = CLASS_NAMES[np.argmax(prediction)]
#     confidence = float(np.max(prediction))

#     return JsonResponse({
#         'predicted_class': predicted_class,
#         'confidence': confidence
#     })







from django.http import JsonResponse
from rest_framework.decorators import api_view
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.efficientnet import preprocess_input
import numpy as np
import os

# Model load (only once)
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'model', 'efficientnet_finetuned_brain_tumor.keras')
model = tf.keras.models.load_model(MODEL_PATH)

# Model labels (must match training)
CLASS_NAMES = ["Glioma", "Meningioma", "No Tumor", "Pituitary"]

@api_view(['POST'])
def predict_tumor(request):
    file = request.FILES.get('file')
    if not file:
        return JsonResponse({'error': 'No file uploaded'}, status=400)

    # Save temporarily
    temp_path = f"temp/{file.name}"
    os.makedirs("temp", exist_ok=True)
    with open(temp_path, 'wb+') as f:
        for chunk in file.chunks():
            f.write(chunk)

    # Correct preprocessing for EfficientNet
    img = image.load_img(temp_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)  # ✅ Use EfficientNet preprocessing

    # Predict
    prediction = model.predict(img_array)
    predicted_class = CLASS_NAMES[np.argmax(prediction)]
    confidence = float(np.max(prediction))

    return JsonResponse({
        'predicted_class': predicted_class,
        'confidence': confidence
    })
