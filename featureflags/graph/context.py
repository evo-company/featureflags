import aiopg.sa

from featureflags.graph.types import (
    Changes,
    DirtyProjects,
    GraphContext,
    ValuesChanges,
)
from featureflags.services.auth import BaseUserSession
from featureflags.services.ldap import BaseLDAP
from featureflags.services.notifications import NotificationsService
from featureflags.services.oidc_auth import OidcAuthenticator


def init_graph_context(
    session: BaseUserSession,
    ldap: BaseLDAP | None,
    engine: aiopg.sa.Engine,
    oidc_authenticators: dict[str, OidcAuthenticator] | None = None,
    notifications: NotificationsService | None = None,
) -> dict:
    return {
        GraphContext.DB_ENGINE: engine,
        GraphContext.USER_SESSION: session,
        GraphContext.LDAP_SERVICE: ldap,
        GraphContext.OIDC_AUTHENTICATORS: oidc_authenticators or {},
        GraphContext.DIRTY_PROJECTS: DirtyProjects(),
        GraphContext.CHANGES: Changes(),
        GraphContext.VALUES_CHANGES: ValuesChanges(),
        GraphContext.CHECK_IDS: {},
        GraphContext.NOTIFICATIONS: notifications,
    }
