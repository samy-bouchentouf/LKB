import json

from app.crud import crud_document


if __name__ == "__main__":

    try:

        documents = crud_document.get_all()

        result = []

        for document in documents:

            result.append({

                "id": document.id,
                "title": document.title,
                "type": document.type,
                "authors": document.authors,
                "year": document.year

            })

        print(json.dumps({

            "success": True,
            "documents": result

        }))

    except Exception as e:

        print(json.dumps({

            "success": False,
            "error": str(e)

        }))