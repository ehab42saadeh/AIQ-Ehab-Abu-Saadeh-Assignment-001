from marshmallow import Schema, fields

class ImageSchema(Schema):
    id = fields.Int(required=True, example=1)
    depth = fields.Float(required=True, example=10.5)
    pixels = fields.Str(required=False, example="binarydata")  

class ImageRequestSchema(Schema):
    depth = fields.Float(required=True, example=10.5)
    pixels = fields.Str(required=False, example="binarydata")  
