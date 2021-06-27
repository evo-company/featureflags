import logging

from typing import List, Optional
from logging import StreamHandler
from logging.handlers import SysLogHandler

from strictconf import Key, Section
from metricslog.ext.formatter import ColorFormatter, CEELogstashFormatter


class LoggingSection(Section):
    logging_level_app = Key('logging-level-app', str)
    logging_level_libs = Key('logging-level-libs', str)
    logging_handlers = Key('logging-handlers', List[str])

    logging_syslog_app = Key('logging-syslog-app', Optional[str])
    logging_syslog_facility = Key('logging-syslog-facility', Optional[str])
    logging_syslog_mapping = Key('logging-syslog-mapping', Optional[dict])
    logging_syslog_defaults = Key('logging-syslog-defaults', Optional[dict])


class LoggingFilter:

    def filter(self, record):
        return not record.msg.startswith('KeepAlive Timeout')


def create_console_handler():
    handler = StreamHandler()
    handler.setFormatter(ColorFormatter())
    return handler


def create_syslog_handler(package, section: LoggingSection):
    assert section.logging_syslog_app, section.logging_syslog_app
    assert section.logging_syslog_facility, section.logging_syslog_facility
    formatter = CEELogstashFormatter(
        section.logging_syslog_app,
        mapping=section.logging_syslog_mapping,
        defaults=section.logging_syslog_defaults,
        extra_only={package},
    )
    facility = SysLogHandler.facility_names[section.logging_syslog_facility]
    handler = SysLogHandler('/dev/log', facility=facility)
    handler.setFormatter(formatter)
    return handler


def configure_logging(package, section: LoggingSection):
    logging.captureWarnings(True)
    logging.root.setLevel(section.logging_level_libs.upper())
    logging.getLogger(package).setLevel(section.logging_level_app.upper())
    if 'console' in section.logging_handlers:
        logging.root.addHandler(create_console_handler())
    if 'syslog' in section.logging_handlers:
        logging.root.addHandler(create_syslog_handler(package, section))
    # Sanic-specific filtering
    logging.getLogger('root').addFilter(LoggingFilter())
