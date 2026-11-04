
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    status,
)
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import (
    UserRegister,
    UserCreate,
    UserUpdate,
    UserResponse,
    LoginResponse,
)
from app.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    require_roles,
)
from app.services.audit_service import record_audit_event


router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication & RBAC"],
)


ALLOWED_ROLES = [
    "Administrator",
    "Technical Engineer",
    "Regional Manager",
    "Viewer",
]


# -------------------------------------------------
# 1. USER LOGIN
# -------------------------------------------------

@router.post("/login", response_model=LoginResponse)
def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    email = form_data.username.strip().lower()

    user = db.query(User).filter(
        User.email == email
    ).first()

    # Invalid credentials
    if not user or not verify_password(
        form_data.password,
        user.hashed_password,
    ):
        record_audit_event(
            db,
            module="Security & Administration",
            action="LOGIN_FAILURE",
            description="Login failed due to invalid credentials.",
            user=user,
            user_email=email,
            request=request,
            status="FAILURE",
        )

        db.commit()

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Inactive account
    if not user.is_active:
        record_audit_event(
            db,
            module="Security & Administration",
            action="LOGIN_FAILURE",
            description="Login rejected because the account is inactive.",
            user=user,
            request=request,
            status="FAILURE",
        )

        db.commit()

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is inactive. Contact an administrator.",
        )

    access_token = create_access_token(
        user_id=user.id,
        role=user.role,
    )

    record_audit_event(
        db,
        module="Security & Administration",
        action="LOGIN_SUCCESS",
        description="User successfully logged in.",
        user=user,
        request=request,
    )

    db.commit()

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }


# -------------------------------------------------
# 2. PUBLIC SELF-REGISTRATION
# -------------------------------------------------

@router.post(
    "/register",
    response_model=LoginResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(
    data: UserRegister,
    request: Request,
    db: Session = Depends(get_db),
):
    email = str(data.email).strip().lower()

    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This email address is already registered.",
        )

    new_user = User(
        full_name=data.full_name.strip(),
        email=email,
        hashed_password=hash_password(data.password),
        role="Viewer",
        is_active=True,
    )

    try:
        db.add(new_user)
        db.flush()

        record_audit_event(
            db,
            module="Security & Administration",
            action="USER_REGISTERED",
            description="New user registered through public registration.",
            user=new_user,
            entity_type="User",
            entity_id=new_user.id,
            new_values={
                "full_name": new_user.full_name,
                "email": new_user.email,
                "role": new_user.role,
                "is_active": new_user.is_active,
            },
            request=request,
        )

        db.commit()
        db.refresh(new_user)

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create account. Please try again.",
        )

    access_token = create_access_token(
        user_id=new_user.id,
        role=new_user.role,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user,
    }


# -------------------------------------------------
# 3. GET CURRENT LOGGED-IN USER
# -------------------------------------------------

@router.get("/me", response_model=UserResponse)
def get_my_profile(
    current_user: User = Depends(get_current_user),
):
    return current_user


# -------------------------------------------------
# 4. ADMINISTRATOR CREATES A USER
# -------------------------------------------------

@router.post(
    "/users",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    data: UserCreate,
    request: Request,
    db: Session = Depends(get_db),
    admin: User = Depends(
        require_roles("Administrator")
    ),
):
    if data.role not in ALLOWED_ROLES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user role",
        )

    email = str(data.email).strip().lower()

    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    new_user = User(
        full_name=data.full_name.strip(),
        email=email,
        hashed_password=hash_password(data.password),
        role=data.role,
        is_active=True,
    )

    try:
        db.add(new_user)
        db.flush()

        record_audit_event(
            db,
            module="Security & Administration",
            action="USER_CREATED",
            description=f"Administrator created account for {new_user.full_name}.",
            user=admin,
            entity_type="User",
            entity_id=new_user.id,
            new_values={
                "full_name": new_user.full_name,
                "email": new_user.email,
                "role": new_user.role,
                "is_active": new_user.is_active,
            },
            request=request,
        )

        db.commit()
        db.refresh(new_user)

    except Exception:
        db.rollback()
        raise

    return new_user


# -------------------------------------------------
# 5. ADMINISTRATOR LISTS ALL USERS
# -------------------------------------------------

@router.get(
    "/users",
    response_model=list[UserResponse],
)
def get_all_users(
    db: Session = Depends(get_db),
    admin: User = Depends(
        require_roles("Administrator")
    ),
):
    users = db.query(User).order_by(User.id).all()

    return users


# -------------------------------------------------
# 6. ADMINISTRATOR UPDATES USER ROLE / STATUS
# -------------------------------------------------

@router.patch(
    "/users/{user_id}",
    response_model=UserResponse,
)
def update_user(
    user_id: int,
    data: UserUpdate,
    request: Request,
    db: Session = Depends(get_db),
    admin: User = Depends(
        require_roles("Administrator")
    ),
):
    target_user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    changes = data.model_dump(exclude_unset=True)

    if not changes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No update information provided",
        )

    if target_user.id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot modify your own account here",
        )

    new_role = changes.get("role", target_user.role)
    new_active = changes.get("is_active", target_user.is_active)

    # Protect the last active administrator
    if (
        target_user.role == "Administrator"
        and target_user.is_active
        and (
            new_role != "Administrator"
            or new_active is False
        )
    ):
        other_active_admins = db.query(User).filter(
            User.role == "Administrator",
            User.is_active.is_(True),
            User.id != target_user.id,
        ).count()

        if other_active_admins == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "The last active administrator cannot "
                    "be demoted or deactivated"
                ),
            )

    # Capture original values before modification
    old_values = {
        "role": target_user.role,
        "is_active": target_user.is_active,
    }

    if "role" in changes:
        target_user.role = changes["role"]

    if "is_active" in changes:
        target_user.is_active = changes["is_active"]

    new_values = {
        "role": target_user.role,
        "is_active": target_user.is_active,
    }

    try:
        # Record role changes
        if old_values["role"] != new_values["role"]:
            record_audit_event(
                db,
                module="Security & Administration",
                action="ROLE_UPDATED",
                description=(
                    f"Administrator changed the role of "
                    f"{target_user.full_name}."
                ),
                user=admin,
                entity_type="User",
                entity_id=target_user.id,
                old_values={"role": old_values["role"]},
                new_values={"role": new_values["role"]},
                request=request,
            )

        # Record activation/deactivation
        if old_values["is_active"] != new_values["is_active"]:
            action = (
                "ACCOUNT_ACTIVATED"
                if new_values["is_active"]
                else "ACCOUNT_DEACTIVATED"
            )

            record_audit_event(
                db,
                module="Security & Administration",
                action=action,
                description=(
                    f"Administrator "
                    f"{'activated' if new_values['is_active'] else 'deactivated'} "
                    f"{target_user.full_name}'s account."
                ),
                user=admin,
                entity_type="User",
                entity_id=target_user.id,
                old_values={"is_active": old_values["is_active"]},
                new_values={"is_active": new_values["is_active"]},
                request=request,
            )

        db.commit()
        db.refresh(target_user)

    except Exception:
        db.rollback()
        raise

    return target_user
