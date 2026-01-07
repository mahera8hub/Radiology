# ml_model.py
import tensorflow as tf

_model = None

def get_model():
    global _model
    if _model is None:
        _model = tf.keras.models.load_model("model.h5")  # path to your model
    return _model
