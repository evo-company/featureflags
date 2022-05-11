import enum
from datetime import datetime

from sqlalchemy import Integer, UniqueConstraint, Index
from sqlalchemy.types import String, Boolean, Enum
from sqlalchemy.schema import MetaData, Table, Column, ForeignKey
from sqlalchemy.ext.declarative import as_declarative
from sqlalchemy.dialects.postgresql import UUID, DOUBLE_PRECISION, TIMESTAMP
from sqlalchemy.dialects.postgresql import ARRAY

from featureflags.protobuf.graph_pb2 import Check as PBCheck
from featureflags.protobuf.graph_pb2 import Variable as PBVariable

from .utils import ArrayOfEnum


metadata = MetaData()


@as_declarative(metadata=metadata)
class Base:
    __table__: Table


class Type(enum.Enum):
    STRING = 1
    NUMBER = 2
    TIMESTAMP = 3
    SET = 4

    @classmethod
    def from_pb(cls, value):
        return cls.__members__[PBVariable.Type.Name(value)]

    def to_pb(self):
        return PBVariable.Type.Value(self.name)


class Operator(enum.Enum):
    EQUAL = 1
    LESS_THAN = 2
    LESS_OR_EQUAL = 3
    GREATER_THAN = 4
    GREATER_OR_EQUAL = 5
    CONTAINS = 6
    PERCENT = 7
    REGEXP = 8
    WILDCARD = 9
    SUBSET = 10
    SUPERSET = 11

    @classmethod
    def from_pb(cls, value):
        return cls.__members__[PBCheck.Operator.Name(value)]

    def to_pb(self):
        return PBCheck.Operator.Value(self.name)


class Action(enum.Enum):
    ENABLE_FLAG = 1
    DISABLE_FLAG = 2
    ADD_CONDITION = 3
    DISABLE_CONDITION = 4
    RESET_FLAG = 5
    DELETE_FLAG = 6


class AuthUser(Base):
    __tablename__ = 'auth_user'

    id = Column(UUID(as_uuid=True), primary_key=True)
    username = Column(String, nullable=False, unique=True)

    __table_args__ = (
        Index('auth_user_username_idx', username),
    )


class AuthSession(Base):
    __tablename__ = 'auth_session'

    session = Column(String, primary_key=True)
    auth_user = Column(ForeignKey('auth_user.id'), nullable=False)
    creation_time = Column(TIMESTAMP, nullable=False)
    expiration_time = Column(TIMESTAMP, nullable=False)

    __table_args__ = (
        Index('auth_session_expiration_time_idx', expiration_time),
    )


class LocalIdMap(Base):
    __tablename__ = 'local_id_map'

    scope = Column(String, primary_key=True)
    value = Column(String, primary_key=True)
    id = Column(UUID(as_uuid=True), nullable=False)
    timestamp = Column(TIMESTAMP, nullable=False)


class Project(Base):
    __tablename__ = 'project'

    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String, nullable=False, unique=True)
    version = Column(Integer, nullable=False)

    __table_args__ = (
        Index('project_name_idx', name),
    )


class Variable(Base):
    __tablename__ = 'variable'

    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String, nullable=False)
    type = Column(Enum(Type, name='variable_type'), nullable=False)

    project = Column(ForeignKey('project.id'), nullable=False)

    __table_args__ = (
        UniqueConstraint(project, name),
        Index('variable_project_name_idx', project, name),
    )


class Flag(Base):
    __tablename__ = 'flag'

    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String, nullable=False)
    enabled = Column(Boolean)

    project = Column(ForeignKey('project.id'), nullable=False)

    __table_args__ = (
        UniqueConstraint(project, name),
        Index('flag_project_name_idx', project, name),
    )


class Condition(Base):
    __tablename__ = 'condition'

    id = Column(UUID(as_uuid=True), primary_key=True)
    flag = Column(ForeignKey('flag.id'), nullable=False)

    checks = Column('checks', ARRAY(UUID(as_uuid=True), as_tuple=True))


class Check(Base):
    __tablename__ = 'check'

    id = Column(UUID(as_uuid=True), primary_key=True)
    operator = Column(Enum(Operator, name='check_operator'), nullable=False)
    value_string = Column(String)
    value_number = Column(DOUBLE_PRECISION)
    value_timestamp = Column(TIMESTAMP)
    value_set = Column(ARRAY(String))

    variable = Column(ForeignKey('variable.id'), nullable=False)

    __value_from_op__ = {
        'value_string': lambda m: {
            Check.value_string: m.value_string,
        },
        'value_number': lambda m: {
            Check.value_number: m.value_number,
        },
        'value_timestamp': lambda m: {
            Check.value_timestamp: datetime.fromtimestamp(m.value_timestamp),
        },
        'value_set': lambda m: {
            Check.value_set: list(m.value_set),
        },
    }

    @classmethod
    def value_from_op(cls, check):
        return cls.__value_from_op__[check.kind](check)


class Changelog(Base):
    __tablename__ = 'changelog'

    id = Column(Integer, primary_key=True)

    timestamp = Column(TIMESTAMP, nullable=False)
    auth_user = Column(ForeignKey('auth_user.id'), nullable=False)
    flag = Column(ForeignKey('flag.id', ondelete='CASCADE'), nullable=False)
    actions = Column(ArrayOfEnum(Enum(Action, name='changelog_actions'),
                                 as_tuple=True))
