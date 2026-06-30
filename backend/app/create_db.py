from app.database import engine
from app.models import Base

Base.metadata.create_all(bind=engine)

print("Toutes les tables ont été créées.")