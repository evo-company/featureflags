from hiku.result import ROOT


class IdMixin:
    def id(self, obj, value):
        obj.id = value.hex


class RootBinding:
    def flag(self, obj, value):
        if value is not None:
            obj.flag.Flag = value.ident.hex

    def flags(self, obj, value):
        for ref in value:
            obj.flags.add().Flag = ref.ident.hex

    def flags_by_ids(self, obj, value):
        for ref in value:
            obj.flags_by_ids.add().Flag = ref.ident.hex

    def projects(self, obj, value):
        for ref in value:
            obj.projects.add().Project = ref.ident.hex

    def authenticated(self, obj, value):
        obj.authenticated = value


class ProjectBinding(IdMixin):
    def name(self, obj, value):
        obj.name = value

    def version(self, obj, value):
        obj.version = value

    def variables(self, obj, value):
        for ref in value:
            obj.variables.add().Variable = ref.ident.hex


class VariableBinding(IdMixin):
    def name(self, obj, value):
        obj.name = value

    def type(self, obj, value):
        obj.type = value.to_pb()


class FlagBinding(IdMixin):
    def name(self, obj, value):
        obj.name = value

    def _project(self, obj, value):
        pass

    def project(self, obj, value):
        obj.project.Project = value.ident.hex

    def enabled(self, obj, value):
        obj.enabled.value = value

    def conditions(self, obj, value):
        for ref in value:
            obj.conditions.add().Condition = ref.ident.hex

    def overridden(self, obj, value):
        obj.overridden.value = value


class ConditionBinding(IdMixin):
    def _checks(self, obj, value):
        pass

    def checks(self, obj, value):
        for ref in value:
            obj.checks.add().Check = ref.ident.hex


class CheckBinding(IdMixin):
    def _variable(self, obj, value):
        pass

    def variable(self, obj, value):
        obj.variable.Variable = value.ident.hex

    def operator(self, obj, value):
        obj.operator = value.to_pb()

    def value_string(self, obj, value):
        if value is not None:
            obj.value_string = value

    def value_number(self, obj, value):
        if value is not None:
            obj.value_number = value

    def value_timestamp(self, obj, value):
        if value is not None:
            obj.value_timestamp.FromDatetime(value)

    def value_set(self, obj, value):
        if value is not None:
            obj.value_set.items[:] = value


BINDINGS = {
    "Root": RootBinding(),
    "Project": ProjectBinding(),
    "Variable": VariableBinding(),
    "Flag": FlagBinding(),
    "Condition": ConditionBinding(),
    "Check": CheckBinding(),
}


def populate_result_proto(result, result_proto):
    binding = BINDINGS["Root"]
    for name, value in result.__idx__.root.items():
        getattr(binding, name.partition("[")[0])(result_proto.Root, value)
    for node_name, node_index in result.__idx__.items():
        if node_name != ROOT.node:
            binding = BINDINGS[node_name]
            idx_proto = getattr(result_proto, node_name)
            for id_, obj in node_index.items():
                obj_proto = idx_proto[id_.hex]
                for name, value in obj.items():
                    getattr(binding, name.partition("[")[0])(obj_proto, value)
    return result_proto
