from datetime import datetime
from app.config.db import db
from app.helpers.common_helpers import convert_to_camel_case
from app.helpers.exceptions_handlers import exception_handler, SaveToDbError


class ImageModel(db.Model):
    __tablename__ = "image_data"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    depth = db.Column(db.Float, nullable=False)
    pixels = db.Column(db.LargeBinary, nullable=True)

    def __init__(self, depth, pixels=None):
        self.depth = depth
        self.pixels = pixels

    def serialize(self):
        """Converts model into readable format in camel case"""
        data = {
            "id": self.id,
            "depth": self.depth,
            "pixels": self.pixels
        }
        return convert_to_camel_case(data)

    @exception_handler
    def save(self):
        try:
            db.session.add(self)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise SaveToDbError(e)
        return self
