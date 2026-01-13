# 1. Exécute ce script Python pour générer le hash
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
password = "secret123"  # Ton mot de passe de test
hashed = pwd_context.hash(password)
print(hashed)
# Output: $argon2id$v=19$m=65536,t=3,p=4$abcd1234...
