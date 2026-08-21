from fastapi import FastAPI, UploadFile, File
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.efficientnet import preprocess_input
from io import BytesIO
from PIL import Image

app = FastAPI()

CLASS_NAMES = ["Glioma", "Meningioma", "No Tumor", "Pituitary"]

model = None  # 👈 important
infer = None

def get_model():
    global model, infer
    if model is None:
        model = tf.saved_model.load("brain_tumor_saved_model")
        infer = model.signatures["serving_default"]
    return infer


def preprocess(img_bytes):
    img = Image.open(BytesIO(img_bytes)).convert("RGB")
    img = img.resize((224, 224))
    arr = image.img_to_array(img)
    arr = np.expand_dims(arr, axis=0)
    return preprocess_input(arr)

# @app.post("/predict")
# async def predict(file: UploadFile = File(...)):
#     m = get_model()   # 👈 load only when first request hits
#     img = preprocess(await file.read())
#     preds = m.predict(img)

#     return {
#         "predicted_class": CLASS_NAMES[int(np.argmax(preds))],
#         "confidence": float(np.max(preds))
#     }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    infer = get_model()

    img = preprocess(await file.read())
    img_tensor = tf.convert_to_tensor(img)

    outputs = infer(img_tensor)

    # get first output tensor
    preds = list(outputs.values())[0].numpy()

    return {
        "predicted_class": CLASS_NAMES[int(np.argmax(preds))],
        "confidence": float(np.max(preds))
    }

@app.get("/")
def health():
    return {"status": "ML service alive"}
