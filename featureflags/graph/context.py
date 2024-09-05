import aiopg.sa

from featureflags.graph.types import (
    Changes,
    DirtyProjects,
    GraphContext,
    ValuesChanges,
)
from featureflags.services.auth import BaseUserSession
from featureflags.services.ldap import BaseLDAP


def init_graph_context(
    session: BaseUserSession,
    ldap: BaseLDAP,
    engine: aiopg.sa.Engine,
) -> dict:
    return {
        GraphContext.DB_ENGINE: engine,
        GraphContext.USER_SESSION: session,
        GraphContext.LDAP_SERVICE: ldap,
        GraphContext.DIRTY_PROJECTS: DirtyProjects(),
        GraphContext.CHANGES: Changes(),
        GraphContext.VALUES_CHANGES: ValuesChanges(),
        GraphContext.CHECK_IDS: {},
    }
