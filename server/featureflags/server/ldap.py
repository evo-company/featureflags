import asyncio
import logging

from string import Template

from ldap3 import Server, Connection


log = logging.getLogger(__name__)


def _escape_dn_chars(s):
    """
    Escape all DN special characters found in s
    with a back-slash (see RFC 4514, section 2.4)

    From python-ldap, which is distributed under Python-style license.
    """
    if s:
        s = s.replace("\\", "\\\\")
        s = s.replace(",", "\\,")
        s = s.replace("+", "\\+")
        s = s.replace('"', '\\"')
        s = s.replace("<", "\\<")
        s = s.replace(">", "\\>")
        s = s.replace(";", "\\;")
        s = s.replace("=", "\\=")
        s = s.replace("\000", "\\\000")
        if s[0] == "#" or s[0] == " ":
            s = "".join(("\\", s))
        if s[-1] == " ":
            s = "".join((s[:-1], "\\ "))
    return s


def _check_credentials(server, dn, password, receive_timeout):
    with Connection(
        server, user=dn, password=password, receive_timeout=receive_timeout
    ) as conn:
        is_bound = conn.bind()
        log.debug("LDAP -> Who am I: %s", conn.extend.standard.who_am_i())
        return is_bound


class DummyLDAP:
    def __init__(self, *, bound=False):
        self._bound = bound

    async def check_credentials(
        self, user, password, *, connect_timeout=5, receive_timeout=5
    ):
        return self._bound


class LDAP:
    def __init__(self, host, base_dn):
        self._host = host
        self._base_dn = base_dn

    async def check_credentials(
        self, user, password, *, connect_timeout=5, receive_timeout=5
    ):
        server = Server(self._host, connect_timeout=connect_timeout)

        dn_tpl = Template(self._base_dn)
        dn = dn_tpl.safe_substitute(user=_escape_dn_chars(user))

        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None, _check_credentials, server, dn, password, receive_timeout
        )
        return result
