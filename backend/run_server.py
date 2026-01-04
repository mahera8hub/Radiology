import os
from waitress import serve
from radiology_backend.wsgi import application

port = int(os.environ.get("PORT", 10000))
serve(application, host="0.0.0.0", port=port)
