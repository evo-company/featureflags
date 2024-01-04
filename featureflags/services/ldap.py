from featureflags.ldap import LDAP, DummyLDAP
from featureflags.config import Config


def get_ldap(cfg: Config):
    if not cfg.ldap.host:
        return DummyLDAP(bound=True)
    return LDAP(cfg.ldap.host, cfg.ldap.base_dn)
