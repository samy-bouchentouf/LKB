from ..database import SessionLocal


class CRUD:
    def __init__(self, model):
        self.model = model

    def add(self, **kwargs):
        db = SessionLocal()

        obj = self.model(**kwargs)

        db.add(obj)
        db.commit()
        db.refresh(obj)

        db.close()

        return obj

    def get(self, obj_id):
        db = SessionLocal()

        obj = (
            db.query(self.model)
            .filter(self.model.id == obj_id)
            .first()
        )

        db.close()

        return obj

    def get_all(self):
        db = SessionLocal()

        objects = db.query(self.model).all()

        db.close()

        return objects

    def update(self, obj_id, **kwargs):
        db = SessionLocal()

        obj = (
            db.query(self.model)
            .filter(self.model.id == obj_id)
            .first()
        )

        if obj is None:
            db.close()
            return None

        for key, value in kwargs.items():
            setattr(obj, key, value)

        db.commit()
        db.refresh(obj)

        db.close()

        return obj

    def delete(self, obj_id):
        db = SessionLocal()

        obj = (
            db.query(self.model)
            .filter(self.model.id == obj_id)
            .first()
        )

        if obj:
            db.delete(obj)
            db.commit()

        db.close()