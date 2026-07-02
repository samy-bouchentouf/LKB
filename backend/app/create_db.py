from operators.database import engine
from operators.models import Base

Base.metadata.create_all(bind=engine)

print("Toutes les tables ont été créées.")