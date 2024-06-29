import pandas as pd
from flask import request
from flask_apispec import MethodResource, marshal_with, doc, use_kwargs
from marshmallow import Schema, fields
from werkzeug.utils import secure_filename
from PIL import Image
import io

from app.config.db import db
from app.helpers.common_helpers import convert_to_camel_case
from app.helpers.exceptions_handlers import exception_handler, SaveToDbError
from app.image_generator.models.image_model import ImageModel

# Schemas for marshmallow
class ImageUploadSchema(Schema):
    file = fields.Raw(required=True, type="file", description="Excel file containing image data")

class ImageResponseSchema(Schema):
    id = fields.Int()
    depth = fields.Float()
    pixels = fields.Str()

class ImportExcelFileResource(MethodResource):
    """Resource for uploading and processing a CSV file containing image data."""

    @doc(description='Uploads a CSV file and saves the image data in the database.',
         tags=['Image'])
    @use_kwargs(ImageUploadSchema, location="files")
    @marshal_with(ImageResponseSchema, description="An Image object.", code=200)
    def post(self, **kwargs):
        try:
            # Get the uploaded file
            file = request.files['file']
            filename = secure_filename(file.filename)

            # Check if the file is a CSV file
            if not filename.endswith('.csv'):
                return {"message": "Invalid file format. Please upload a CSV file."}, 400

            # Read the CSV file
            df = pd.read_csv(file)

            # Validate the required columns are present
            if 'depth' not in df.columns:
                return {"message": "Missing required column 'depth' in the CSV file."}, 400

            for index, row in df.iterrows():
                depth = row['depth']
                pixels = row.iloc[1:].values.astype(float)  # Convert to float if necessary

                # Check if the number of pixels matches the required size
                if pixels.size != 200:
                    return {"message": f"Invalid pixel data size for row {index + 1}. Expected 200 pixels."}, 400

                # Reshape the pixels into a 200x200 matrix
                pixels = pixels.reshape((200, 1))  # Adjust the reshape dimensions as needed

                # Convert the image data to a PIL image, resize it to 150x150
                image = Image.fromarray(pixels.astype('uint8'))
                image = image.resize((150, 150))

                # Convert the resized image to bytes
                image_bytes = io.BytesIO()
                image.save(image_bytes, format='PNG')
                image_bytes = image_bytes.getvalue()

                # Create a new ImageModel object and save it to the database
                image_model = ImageModel(depth=depth, pixels=image_bytes)
                image_model.save()

            return {"message": "File processed and images saved successfully."}, 200

        except ValueError as ve:
            return {"message": "Error processing the CSV file.", "error": str(ve)}, 400
        except Exception as e:
            return {"message": "An unexpected error occurred.", "error": str(e)}, 500

