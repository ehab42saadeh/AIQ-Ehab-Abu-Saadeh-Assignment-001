from flask import send_file, make_response
from flask_apispec import MethodResource, doc, use_kwargs
from marshmallow import Schema, fields
from app.config.db import db
from app.image_generator.models.image_model import ImageModel
from PIL import Image
import io
import numpy as np

class ImageFramesRequestSchema(Schema):
    depth_min = fields.Float(required=True, example=5.0)
    depth_max = fields.Float(required=True, example=15.0)

class ImageFramesResource(MethodResource):
    """Resource for retrieving and applying custom color map to image frames based on depth ranges."""

    @doc(description='Downloads image frames based on depth range with a custom color map.',
         tags=['Image'])
    @use_kwargs(ImageFramesRequestSchema, location="query")
    def post(self, depth_min, depth_max):
        try:
            # Query database for images within the specified depth range
            images = ImageModel.query.filter(ImageModel.depth.between(depth_min, depth_max)).all()

            # Apply custom color map to each image
            processed_images = []
            for image in images:
                # Convert binary data to PIL image
                img = Image.open(io.BytesIO(image.pixels))

                # Example: Apply a custom color map (e.g., invert colors)
                img_array = np.array(img)
                inverted_img = 255 - img_array  # Example of inverting colors
                processed_img = Image.fromarray(inverted_img)

                # Convert processed image back to bytes
                processed_img_bytes = io.BytesIO()
                processed_img.save(processed_img_bytes, format='PNG')
                processed_img_bytes.seek(0)  # Reset pointer to start of file
                processed_images.append(processed_img_bytes)

                # Update image model with processed pixels
                image.pixels = processed_img_bytes.getvalue()
                db.session.commit()

            # Create response with downloadable file
            if len(processed_images) == 1:
                # If there's only one image, return it directly
                response = make_response(send_file(processed_images[0], mimetype='image/png'))
            else:
                # If multiple images, concatenate them into a single BytesIO
                combined_bytes = io.BytesIO()
                for img_bytes in processed_images:
                    combined_bytes.write(img_bytes.getvalue())
                combined_bytes.seek(0)
                response = make_response(send_file(combined_bytes, mimetype='image/png'))

            response.headers['Content-Disposition'] = 'attachment; filename=processed_images.png'
            return response

        except Exception as e:
            return {"message": "Failed to process and download image frames.", "error": str(e)}, 500
