from ..ldap import LDAP, DummyLDAP
from ..config import Config


def get_ldap(cfg: Config):
    if not cfg.main.ldap_host:
        return DummyLDAP(bound=True)
    return LDAP(cfg.main.ldap_host, cfg.main.ldap_base_dn)
