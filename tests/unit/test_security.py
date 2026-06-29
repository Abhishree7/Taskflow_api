import pytest
from jose import JWTError

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)


def test_password_hash_and_verify():
    hashed = hash_password("mysecret")
    assert verify_password("mysecret", hashed)
    assert not verify_password("wrong", hashed)


def test_access_token_roundtrip():
    import uuid
    uid = uuid.uuid4()
    token = create_access_token(uid)
    payload = decode_token(token)
    assert payload["sub"] == str(uid)
    assert payload["type"] == "access"


def test_refresh_token_type():
    import uuid
    token = create_refresh_token(uuid.uuid4())
    payload = decode_token(token)
    assert payload["type"] == "refresh"


def test_invalid_token_raises():
    with pytest.raises(JWTError):
        decode_token("not.a.token")
