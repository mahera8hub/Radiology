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

def get_model():
    global model
    if model is None:
        model = tf.keras.models.load_model(
            "brain_tumor_saved_model",
            compile=False
        )
    return model

def preprocess(img_bytes):
    img = Image.open(BytesIO(img_bytes)).convert("RGB")
    img = img.resize((224, 224))
    arr = image.img_to_array(img)
    arr = np.expand_dims(arr, axis=0)
    return preprocess_input(arr)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    m = get_model()   # 👈 load only when first request hits
    img = preprocess(await file.read())
    preds = m.predict(img)

    return {
        "predicted_class": CLASS_NAMES[int(np.argmax(preds))],
        "confidence": float(np.max(preds))
    }

@app.get("/")
def health():
    return {"status": "ML service alive"}
