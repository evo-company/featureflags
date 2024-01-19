import os
from pathlib import PosixPath

import pytest

from featureflags.config import CONFIG_PATH_ENV_VAR, CONFIGS_DIR, _load_config


@pytest.mark.parametrize(
    "path",
    CONFIGS_DIR.iterdir(),
)
def test_configs_smoke(path: PosixPath) -> None:
    """Test that the config loads."""
    os.environ[CONFIG_PATH_ENV_VAR] = path.as_posix()
    _load_config()
