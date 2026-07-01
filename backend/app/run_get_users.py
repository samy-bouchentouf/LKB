import json

from app.crud import crud_user


if __name__ == "__main__":

    try:

        users = crud_user.get_all()

        result = []

        for user in users:

            result.append({

                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role

            })

        print(json.dumps({

            "success": True,
            "users": result

        }))

    except Exception as e:

        print(json.dumps({

            "success": False,
            "error": str(e)

        }))