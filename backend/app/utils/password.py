import bcrypt


def hash_password(password: str) -> str:
    return bcrypt.hash(password)

def get_password_hash(password: str) -> str:
    truncated = password.encode('utf-8')[:72]
    return bcrypt.hashpw(truncated, bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    truncated = password.encode('utf-8')[:72]
    return bcrypt.checkpw(truncated, hashed.encode())
