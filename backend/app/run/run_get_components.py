import json

from app.crud import crud_component


if __name__ == "__main__":

    try:

        components = crud_component.get_all()

        result = []

        for component in components:

            result.append({

                "id": component.id,

                "name": component.name,

                "type": component.type,

                "manufacturer": component.manufacturer,

                "reference": component.reference,

                "serial_number": component.serial_number,

                "location": component.location

            })

        print(json.dumps({

            "success": True,

            "components": result

        }))

    except Exception as e:

        print(json.dumps({

            "success": False,

            "error": str(e)

        }))