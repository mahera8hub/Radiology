# ml_model.py
import tensorflow as tf
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "model" / "efficientnet_finetuned_brain_tumor.h5"
_model = None

def get_model():
    global _model
    if _model is None:
        _model = tf.keras.models.load_model("model.h5", compile=False)  # path to your model
    return _model

# from django.conf import settings

# _model = None

# def get_model():
#     global _model

#     if not settings.ENABLE_ML:
#         raise RuntimeError("ML is disabled in this environment")

#     if _model is None:
#         import tensorflow as tf  # imported only when needed
#         _model = tf.keras.models.load_model("saved_model")

#     return _model
