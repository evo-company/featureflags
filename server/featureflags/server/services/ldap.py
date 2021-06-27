from ..ldap import LDAP
from ..config import Config


def get_ldap(cfg: Config):
    return LDAP(cfg.main.ldap_host, cfg.main.ldap_base_dn)
