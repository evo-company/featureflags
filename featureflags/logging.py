import logging

from logging import StreamHandler
from logging.handlers import SysLogHandler

from metricslog.ext.formatter import ColorFormatter, CEELogstashFormatter

from featureflags.config import LoggingSettings


log = logging.getLogger(__name__)


class LoggingFilter:
    def filter(self, record):
        return not record.msg.startswith("KeepAlive Timeout")


def create_console_handler():
    handler = StreamHandler()
    handler.setFormatter(ColorFormatter())
    return handler


def create_syslog_handler(package, section: LoggingSettings):
    assert section.syslog_app, section.syslog_app
    assert section.syslog_facility, section.syslog_facility
    formatter = CEELogstashFormatter(
        section.syslog_app,
        mapping=section.syslog_mapping,
        defaults=section.syslog_defaults,
        extra_only={package},
    )
    facility = SysLogHandler.facility_names[section.syslog_facility]
    handler = SysLogHandler("/dev/log", facility=facility)
    handler.setFormatter(formatter)
    return handler


def configure_logging(package, section: LoggingSettings):
    logging.captureWarnings(True)
    logging.root.setLevel(section.level_libs.upper())
    logging.getLogger(package).setLevel(section.level_app.upper())

    if "logevo" in section.handlers:
        if len(section.handlers) > 1:
            raise ValueError("logevo handler must be used alone")

        try:
            import logevo

            logevo.configure_logging()
            log.info("Logevo configured")
        except ImportError:
            raise ImportError(
                "logevo handler is used but 'logevo' package is not installed"
            )

    if "console" in section.handlers:
        logging.root.addHandler(create_console_handler())
    if "syslog" in section.handlers:
        logging.root.addHandler(create_syslog_handler(package, section))

    # Sanic-specific filtering
    logging.getLogger("root").addFilter(LoggingFilter())
