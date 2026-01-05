import tensorflow as tf

# Current folder = backend, isliye relative path sirf "model/..."
model = tf.keras.models.load_model("model/efficientnet_finetuned_brain_tumor.keras")

# Save as .h5
model.save("model/efficientnet_finetuned_brain_tumor.h5")

print("Model successfully converted to .h5!")
