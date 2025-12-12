Brain Tumor Classification (Glioma | Meningioma | Pituitary | No Tumor)

A full-stack MRI tumor classification app powered by EfficientNet.
Frontend uses React + MUI + Tailwind, backend uses Django + SQLite, and the ML model is trained on a Kaggle dataset in Google Colab.

🚀 Features

Classifies 4 tumor types: Glioma, Meningioma, Pituitary, No Tumor

EfficientNet model trained in Google Colab

Achieved 87.9% accuracy

Responsive UI for MRI upload

Django REST API for predictions

Prediction confidence included

🧠 Tech Stack

Frontend: React, MUI, Tailwind, Axios
Backend: Django, Django REST Framework, SQLite
ML: EfficientNet, TensorFlow/Keras, Kaggle MRI dataset

📂 Project Structure
/frontend    → React UI
/backend     → Django API + ML model
/model       → Saved EfficientNet model
db.sqlite3   → SQLite database

⚙️ Setup
Backend (Django)
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Frontend (React)
cd frontend
npm install
npm start

🔗 API Endpoint

POST /api/predict/

Form-data

file: <MRI image>


Response

{
  "prediction": "Pituitary",
  "confidence": 0.88
}

📈 Model Details

EfficientNet (transfer learning)

Trained in Google Colab (GPU)

Dataset: Kaggle Brain MRI

Classes: Glioma, Meningioma, Pituitary, No Tumor

Final accuracy: 87.9%

🔮 Future Enhancements

Grad-CAM heatmaps

Cloud deployment

Model upgrade to EfficientNet-B3

📜 License

MIT License.
