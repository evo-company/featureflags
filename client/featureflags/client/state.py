from hiku.builder import build, Q
from hiku.export.protobuf import export

from featureflags.protobuf.service_pb2 import ExchangeRequest

from .conditions import load_flags


def get_query(project_name):
    return export(build([
        Q.flags(project_name=project_name)[
            Q.id,
            Q.name,
            Q.enabled,
            Q.overridden,
            Q.conditions[
                Q.id,
                Q.checks[
                    Q.id,
                    Q.variable[
                        Q.id,
                        Q.name,
                        Q.type,
                    ],
                    Q.operator,
                    Q.value_string,
                    Q.value_number,
                    Q.value_timestamp,
                    Q.value_set,
                ]
            ],
        ],
    ]))


class State:

    def __init__(self, project, variables):
        self._project = project
        self._variables = variables

        self._state = {}
        self._version = 0

        self._exchange_query = get_query(project)
        self._variables_sent = False

    def get(self, flag_name):
        return self._state.get(flag_name)

    def get_request(self, flags_usage):
        request = ExchangeRequest(project=self._project, version=self._version)
        request.query.CopyFrom(self._exchange_query)
        if not self._variables_sent:
            for var in self._variables:
                request.variables.add(name=var.name, type=var.type)
        request.flags_usage.extend(flags_usage)
        return request

    def apply_reply(self, reply):
        self._variables_sent = True
        if self._version != reply.version:
            self._state = load_flags(reply.result)
            self._version = reply.version
