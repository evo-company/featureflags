from ..ldap import LDAP, DummyLDAP
from ..config import Config


def get_ldap(cfg: Config):
    if not cfg.ldap.host:
        return DummyLDAP(bound=True)
    return LDAP(cfg.ldap.host, cfg.ldap.base_dn)
