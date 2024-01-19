import logging
from abc import ABC, abstractmethod
from string import Template

import ldap3
from ldap3.core.exceptions import LDAPBindError

from featureflags.utils import escape_dn_chars

log = logging.getLogger(__name__)


class BaseLDAP(ABC):
    @abstractmethod
    async def check_credentials(
        self,
        user: str | None,
        password: str | None,
        *,
        connect_timeout: int = 5,
        receive_timeout: int = 5,
    ) -> bool:
        raise NotImplementedError()


class DummyLDAP(BaseLDAP):
    def __init__(self, *, user_is_bound: bool = False) -> None:
        self.user_is_bound = user_is_bound

    async def check_credentials(
        self,
        user: str | None,
        password: str | None,
        *,
        connect_timeout: int = 5,
        receive_timeout: int = 5,
    ) -> bool:
        return self.user_is_bound


class LDAP(BaseLDAP):
    def __init__(self, host: str, base_dn: str) -> None:
        self._host = host
        self._base_dn = base_dn

    async def check_credentials(
        self,
        user: str | None,
        password: str | None,
        *,
        connect_timeout: int = 5,
        receive_timeout: int = 5,
    ) -> bool:
        server = ldap3.Server(self._host, connect_timeout=connect_timeout)

        dn_tpl = Template(self._base_dn)
        dn = dn_tpl.safe_substitute(user=escape_dn_chars(user))

        try:
            with ldap3.Connection(
                server=server,
                user=dn,
                password=password,
                receive_timeout=receive_timeout,
            ) as connection:
                user_is_bound = connection.bind()
                log.debug(
                    "LDAP -> Who am I: %s",
                    connection.extend.standard.who_am_i(),
                )
        except LDAPBindError:
            user_is_bound = False
            log.info("LDAP -> Bind error")

        return user_is_bound
