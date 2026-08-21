# from rest_framework.test import APIClient
# from django.test import TestCase

# class TumorPredictionTests(TestCase):
#     def setUp(self):
#         self.client = APIClient()

#     def test_predict_endpoint_with_valid_image(self):
#         with open('test_images/sample_mri.jpg', 'rb') as img:
#             response = self.client.post('/api/predict/', {'image': img}, format='multipart')
#         self.assertEqual(response.status_code, 200)
#         self.assertIn('prediction', response.data)


import io
from PIL import Image
from django.test import TestCase
from rest_framework.test import APIClient


def generate_test_image():
    """Creates a small in-memory JPEG image, so tests don't depend on
    an external sample file being present in the repo."""
    file = io.BytesIO()
    image = Image.new("RGB", (224, 224), color=(128, 128, 128))
    image.save(file, "JPEG")
    file.seek(0)
    file.name = "test_mri.jpg"
    return file


class TumorPredictionTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_predict_endpoint_with_valid_image(self):
        test_image = generate_test_image()
        response = self.client.post(
            "/api/predict/",
            {"file": test_image},
            format="multipart",
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("predicted_class", data)
        self.assertIn("confidence", data)
        self.assertIn(
            data["predicted_class"],
            ["Glioma", "Meningioma", "No Tumor", "Pituitary"],
        )

    def test_predict_endpoint_without_file(self):
        response = self.client.post("/api/predict/", {}, format="multipart")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json())