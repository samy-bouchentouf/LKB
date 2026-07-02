import json

from app.crud import crud_experiment


if __name__ == "__main__":

    try:

        experiments = crud_experiment.get_all()

        result = []

        for experiment in experiments:

            result.append({

                "id": experiment.id,
                "name": experiment.name,
                "description": experiment.description,
                "status": experiment.status

            })

        print(json.dumps({

            "success": True,
            "experiments": result

        }))

    except Exception as e:

        print(json.dumps({

            "success": False,
            "error": str(e)

        }))