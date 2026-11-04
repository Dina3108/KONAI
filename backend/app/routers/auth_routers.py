from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

from app.schemas.user import (
    UserCreate,
    UserResponse,
    LoginResponse
)

from app.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    require_roles
)


router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication & RBAC"]
)


ALLOWED_ROLES = [
    "Administrator",
    "Technical Engineer",
    "Regional Manager",
    "Viewer"
]


# -------------------------------------------------
# 1. USER LOGIN
# -------------------------------------------------

@router.post("/login", response_model=LoginResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    email = form_data.username.strip().lower()

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if not verify_password(
        form_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is inactive"
        )

    access_token = create_access_token(
        user_id=user.id,
        role=user.role
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


# -------------------------------------------------
# 2. GET CURRENT LOGGED-IN USER
# -------------------------------------------------

@router.get("/me", response_model=UserResponse)
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user


# -------------------------------------------------
# 3. ADMINISTRATOR CREATES A USER
# -------------------------------------------------

@router.post(
    "/users",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def create_user(
    data: UserCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(
        require_roles("Administrator")
    )
):

    if data.role not in ALLOWED_ROLES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user role"
        )

    email = str(data.email).strip().lower()

    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered"
        )

    new_user = User(
        full_name=data.full_name,
        email=email,
        hashed_password=hash_password(data.password),
        role=data.role,
        is_active=True
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# -------------------------------------------------
# 4. ADMINISTRATOR LISTS ALL USERS
# -------------------------------------------------

@router.get(
    "/users",
    response_model=list[UserResponse]
)
def get_all_users(
    db: Session = Depends(get_db),
    admin: User = Depends(
        require_roles("Administrator")
    )
):

    users = db.query(User).order_by(User.id).all()

    return users