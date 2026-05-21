import os
from pathlib import PosixPath

import pytest

from featureflags.config import (
    CONFIG_PATH_ENV_VAR,
    CONFIGS_DIR,
    OidcClient,
    _load_config,
)


@pytest.mark.parametrize(
    "path",
    CONFIGS_DIR.iterdir(),
)
def test_configs_smoke(path: PosixPath) -> None:
    """Test that the config loads."""
    os.environ[CONFIG_PATH_ENV_VAR] = path.as_posix()
    _load_config()


def test_oidc_client_secret_resolves_from_env(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("OIDC_TEST_SECRET", "from-env")
    client = OidcClient(
        id="cid", name="web", client_secret="$OIDC_TEST_SECRET"
    )
    assert client.client_secret == "from-env"


def test_oidc_client_secret_missing_env_raises(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.delenv("OIDC_TEST_MISSING", raising=False)
    with pytest.raises(ValueError, match="OIDC_TEST_MISSING"):
        OidcClient(id="cid", name="web", client_secret="$OIDC_TEST_MISSING")
