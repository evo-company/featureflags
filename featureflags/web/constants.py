from datetime import timedelta
from pathlib import Path

COOKIE_ACCESS_TOKEN = "access_token"
COOKIE_ACCESS_TOKEN_MAX_AGE = 365 * 24 * 3600

ACCESS_TOKEN_TTL = timedelta(minutes=10)

STATIC_DIR = Path(__file__).parent / "static"
