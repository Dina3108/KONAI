from getpass import getpass

from app.database import SessionLocal
from app.models.user import User
from app.security import hash_password


db = SessionLocal()

try:
    existing_admin = db.query(User).filter(
        User.role == "Administrator"
    ).first()

    if existing_admin:
        print("Administrator account already exists.")
    else:
        print("\nKONE Platform - Initial Administrator Setup")

        full_name = input("Enter full name: ").strip()
        email = input("Enter email: ").strip().lower()

        password = getpass("Enter password: ")
        confirm_password = getpass("Confirm password: ")

        if len(full_name) < 2:
            raise ValueError("Name must contain at least 2 characters.")

        if len(password) < 8:
            raise ValueError("Password must contain at least 8 characters.")

        if password != confirm_password:
            raise ValueError("Passwords do not match.")

        existing_user = db.query(User).filter(
            User.email == email
        ).first()

        if existing_user:
            raise ValueError("This email is already registered.")

        admin = User(
            full_name=full_name,
            email=email,
            hashed_password=hash_password(password),
            role="Administrator",
            is_active=True
        )

        db.add(admin)
        db.commit()

        print("\nAdministrator account created successfully!")

except Exception as error:
    db.rollback()
    print("\nError:", error)

finally:
    db.close()