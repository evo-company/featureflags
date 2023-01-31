from typing import Optional
from os.path import expandvars

from strictconf import Section, Compose, Key, key_property

from .logging import LoggingSection


class Dev(LoggingSection, Section):
    pass


class Main(Section):
    _secret = Key('secret', str)
    _dsn = Key('dsn', str)

    debug = Key('debug', bool)

    ldap_host = Key('ldap-host', Optional[str])
    ldap_base_dn = Key('ldap-base-dn', Optional[str])

    @key_property
    def dsn(self):
        return expandvars(self._dsn)

    @key_property
    def secret(self):
        return expandvars(self._secret)


class Config(Compose):
    dev = Dev('dev')
    main = Main('main')
