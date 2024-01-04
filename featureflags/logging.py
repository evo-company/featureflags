import logging
from logging import StreamHandler
from logging.handlers import SysLogHandler

from metricslog.ext.formatter import CEELogstashFormatter, ColorFormatter

from featureflags.config import config

log = logging.getLogger(__name__)


def create_console_handler() -> StreamHandler:
    handler = StreamHandler()
    handler.setFormatter(ColorFormatter())
    return handler


def create_syslog_handler(package: str) -> SysLogHandler:
    assert config.logging.syslog_app, config.logging.syslog_app
    assert config.logging.syslog_facility, config.logging.syslog_facility
    formatter = CEELogstashFormatter(
        config.logging.syslog_app,
        mapping=config.logging.syslog_mapping,
        defaults=config.logging.syslog_defaults,
        extra_only={package},
    )
    facility = SysLogHandler.facility_names[config.logging.syslog_facility]
    handler = SysLogHandler("/dev/log", facility=facility)
    handler.setFormatter(formatter)
    return handler


def configure_logging(package: str) -> None:
    logging.captureWarnings(True)
    logging.root.setLevel(config.logging.level_libs.upper())
    logging.getLogger(package).setLevel(config.logging.level_app.upper())

    if "logevo" in config.logging.handlers:
        if len(config.logging.handlers) > 1:
            raise ValueError("logevo handler must be used alone")

        try:
            import logevo

            logevo.configure_logging()
        except ImportError as e:
            raise ImportError(
                "logevo handler is used but 'logevo' package is not installed"
            ) from e
        else:
            log.info("Logevo configured")

    if "console" in config.logging.handlers:
        logging.root.addHandler(create_console_handler())

    if "syslog" in config.logging.handlers:
        logging.root.addHandler(create_syslog_handler(package))
