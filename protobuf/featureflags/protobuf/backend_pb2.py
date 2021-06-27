# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: featureflags/protobuf/backend.proto

from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


from hiku.protobuf import query_pb2 as hiku_dot_protobuf_dot_query__pb2
from google.protobuf import timestamp_pb2 as google_dot_protobuf_dot_timestamp__pb2
from featureflags.protobuf import graph_pb2 as featureflags_dot_protobuf_dot_graph__pb2


DESCRIPTOR = _descriptor.FileDescriptor(
  name='featureflags/protobuf/backend.proto',
  package='featureflags.backend',
  syntax='proto3',
  serialized_options=None,
  serialized_pb=b'\n#featureflags/protobuf/backend.proto\x12\x14\x66\x65\x61tureflags.backend\x1a\x19hiku/protobuf/query.proto\x1a\x1fgoogle/protobuf/timestamp.proto\x1a!featureflags/protobuf/graph.proto\"\x13\n\x02Id\x12\r\n\x05value\x18\x01 \x01(\t\"\'\n\x07LocalId\x12\r\n\x05value\x18\x01 \x01(\t\x12\r\n\x05scope\x18\x02 \x01(\t\"m\n\x08\x45itherId\x12&\n\x02id\x18\x01 \x01(\x0b\x32\x18.featureflags.backend.IdH\x00\x12\x31\n\x08local_id\x18\x02 \x01(\x0b\x32\x1d.featureflags.backend.LocalIdH\x00\x42\x06\n\x04kind\",\n\x06SignIn\x12\x10\n\x08username\x18\x02 \x01(\t\x12\x10\n\x08password\x18\x03 \x01(\t\"\t\n\x07SignOut\"7\n\nEnableFlag\x12)\n\x07\x66lag_id\x18\x01 \x01(\x0b\x32\x18.featureflags.backend.Id\"8\n\x0b\x44isableFlag\x12)\n\x07\x66lag_id\x18\x01 \x01(\x0b\x32\x18.featureflags.backend.Id\"6\n\tResetFlag\x12)\n\x07\x66lag_id\x18\x01 \x01(\x0b\x32\x18.featureflags.backend.Id\"\xba\x02\n\x08\x41\x64\x64\x43heck\x12/\n\x08local_id\x18\x01 \x01(\x0b\x32\x1d.featureflags.backend.LocalId\x12*\n\x08variable\x18\x02 \x01(\x0b\x32\x18.featureflags.backend.Id\x12\x34\n\x08operator\x18\x03 \x01(\x0e\x32\".featureflags.graph.Check.Operator\x12\x16\n\x0cvalue_string\x18\x04 \x01(\tH\x00\x12\x16\n\x0cvalue_number\x18\x05 \x01(\x01H\x00\x12\x35\n\x0fvalue_timestamp\x18\x06 \x01(\x0b\x32\x1a.google.protobuf.TimestampH\x00\x12,\n\tvalue_set\x18\x07 \x01(\x0b\x32\x17.featureflags.graph.SetH\x00\x42\x06\n\x04kind\"\x9a\x01\n\x0c\x41\x64\x64\x43ondition\x12)\n\x07\x66lag_id\x18\x01 \x01(\x0b\x32\x18.featureflags.backend.Id\x12/\n\x08local_id\x18\x02 \x01(\x0b\x32\x1d.featureflags.backend.LocalId\x12.\n\x06\x63hecks\x18\x03 \x03(\x0b\x32\x1e.featureflags.backend.EitherId\"B\n\x10\x44isableCondition\x12.\n\x0c\x63ondition_id\x18\x01 \x01(\x0b\x32\x18.featureflags.backend.Id\"\xd7\x03\n\tOperation\x12\x37\n\x0b\x65nable_flag\x18\x01 \x01(\x0b\x32 .featureflags.backend.EnableFlagH\x00\x12\x39\n\x0c\x64isable_flag\x18\x02 \x01(\x0b\x32!.featureflags.backend.DisableFlagH\x00\x12;\n\radd_condition\x18\x03 \x01(\x0b\x32\".featureflags.backend.AddConditionH\x00\x12\x43\n\x11\x64isable_condition\x18\x04 \x01(\x0b\x32&.featureflags.backend.DisableConditionH\x00\x12\x33\n\tadd_check\x18\x05 \x01(\x0b\x32\x1e.featureflags.backend.AddCheckH\x00\x12\x35\n\nreset_flag\x18\x06 \x01(\x0b\x32\x1f.featureflags.backend.ResetFlagH\x00\x12/\n\x07sign_in\x18\x07 \x01(\x0b\x32\x1c.featureflags.backend.SignInH\x00\x12\x31\n\x08sign_out\x18\x08 \x01(\x0b\x32\x1d.featureflags.backend.SignOutH\x00\x42\x04\n\x02op\"h\n\x07Request\x12\x33\n\noperations\x18\x01 \x03(\x0b\x32\x1f.featureflags.backend.Operation\x12(\n\x05query\x18\x02 \x01(\x0b\x32\x19.hiku.protobuf.query.Node\"3\n\x05Reply\x12*\n\x06result\x18\x01 \x01(\x0b\x32\x1a.featureflags.graph.Result2\x98\x01\n\x07\x42\x61\x63kend\x12G\n\x04\x63\x61ll\x12\x1d.featureflags.backend.Request\x1a\x1b.featureflags.backend.Reply\"\x03\x88\x02\x01\x12\x44\n\x04\x43\x61ll\x12\x1d.featureflags.backend.Request\x1a\x1b.featureflags.backend.Reply\"\x00\x62\x06proto3'
  ,
  dependencies=[hiku_dot_protobuf_dot_query__pb2.DESCRIPTOR,google_dot_protobuf_dot_timestamp__pb2.DESCRIPTOR,featureflags_dot_protobuf_dot_graph__pb2.DESCRIPTOR,])




_ID = _descriptor.Descriptor(
  name='Id',
  full_name='featureflags.backend.Id',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='value', full_name='featureflags.backend.Id.value', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=156,
  serialized_end=175,
)


_LOCALID = _descriptor.Descriptor(
  name='LocalId',
  full_name='featureflags.backend.LocalId',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='value', full_name='featureflags.backend.LocalId.value', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='scope', full_name='featureflags.backend.LocalId.scope', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=177,
  serialized_end=216,
)


_EITHERID = _descriptor.Descriptor(
  name='EitherId',
  full_name='featureflags.backend.EitherId',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='id', full_name='featureflags.backend.EitherId.id', index=0,
      number=1, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='local_id', full_name='featureflags.backend.EitherId.local_id', index=1,
      number=2, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
    _descriptor.OneofDescriptor(
      name='kind', full_name='featureflags.backend.EitherId.kind',
      index=0, containing_type=None, fields=[]),
  ],
  serialized_start=218,
  serialized_end=327,
)


_SIGNIN = _descriptor.Descriptor(
  name='SignIn',
  full_name='featureflags.backend.SignIn',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='username', full_name='featureflags.backend.SignIn.username', index=0,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='password', full_name='featureflags.backend.SignIn.password', index=1,
      number=3, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=329,
  serialized_end=373,
)


_SIGNOUT = _descriptor.Descriptor(
  name='SignOut',
  full_name='featureflags.backend.SignOut',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=375,
  serialized_end=384,
)


_ENABLEFLAG = _descriptor.Descriptor(
  name='EnableFlag',
  full_name='featureflags.backend.EnableFlag',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='flag_id', full_name='featureflags.backend.EnableFlag.flag_id', index=0,
      number=1, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=386,
  serialized_end=441,
)


_DISABLEFLAG = _descriptor.Descriptor(
  name='DisableFlag',
  full_name='featureflags.backend.DisableFlag',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='flag_id', full_name='featureflags.backend.DisableFlag.flag_id', index=0,
      number=1, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=443,
  serialized_end=499,
)


_RESETFLAG = _descriptor.Descriptor(
  name='ResetFlag',
  full_name='featureflags.backend.ResetFlag',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='flag_id', full_name='featureflags.backend.ResetFlag.flag_id', index=0,
      number=1, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=501,
  serialized_end=555,
)


_ADDCHECK = _descriptor.Descriptor(
  name='AddCheck',
  full_name='featureflags.backend.AddCheck',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='local_id', full_name='featureflags.backend.AddCheck.local_id', index=0,
      number=1, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='variable', full_name='featureflags.backend.AddCheck.variable', index=1,
      number=2, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='operator', full_name='featureflags.backend.AddCheck.operator', index=2,
      number=3, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='value_string', full_name='featureflags.backend.AddCheck.value_string', index=3,
      number=4, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='value_number', full_name='featureflags.backend.AddCheck.value_number', index=4,
      number=5, type=1, cpp_type=5, label=1,
      has_default_value=False, default_value=float(0),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='value_timestamp', full_name='featureflags.backend.AddCheck.value_timestamp', index=5,
      number=6, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='value_set', full_name='featureflags.backend.AddCheck.value_set', index=6,
      number=7, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
    _descriptor.OneofDescriptor(
      name='kind', full_name='featureflags.backend.AddCheck.kind',
      index=0, containing_type=None, fields=[]),
  ],
  serialized_start=558,
  serialized_end=872,
)


_ADDCONDITION = _descriptor.Descriptor(
  name='AddCondition',
  full_name='featureflags.backend.AddCondition',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='flag_id', full_name='featureflags.backend.AddCondition.flag_id', index=0,
      number=1, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='local_id', full_name='featureflags.backend.AddCondition.local_id', index=1,
      number=2, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='checks', full_name='featureflags.backend.AddCondition.checks', index=2,
      number=3, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=875,
  serialized_end=1029,
)


_DISABLECONDITION = _descriptor.Descriptor(
  name='DisableCondition',
  full_name='featureflags.backend.DisableCondition',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='condition_id', full_name='featureflags.backend.DisableCondition.condition_id', index=0,
      number=1, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=1031,
  serialized_end=1097,
)


_OPERATION = _descriptor.Descriptor(
  name='Operation',
  full_name='featureflags.backend.Operation',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='enable_flag', full_name='featureflags.backend.Operation.enable_flag', index=0,
      number=1, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='disable_flag', full_name='featureflags.backend.Operation.disable_flag', index=1,
      number=2, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='add_condition', full_name='featureflags.backend.Operation.add_condition', index=2,
      number=3, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='disable_condition', full_name='featureflags.backend.Operation.disable_condition', index=3,
      number=4, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='add_check', full_name='featureflags.backend.Operation.add_check', index=4,
      number=5, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='reset_flag', full_name='featureflags.backend.Operation.reset_flag', index=5,
      number=6, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='sign_in', full_name='featureflags.backend.Operation.sign_in', index=6,
      number=7, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='sign_out', full_name='featureflags.backend.Operation.sign_out', index=7,
      number=8, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
    _descriptor.OneofDescriptor(
      name='op', full_name='featureflags.backend.Operation.op',
      index=0, containing_type=None, fields=[]),
  ],
  serialized_start=1100,
  serialized_end=1571,
)


_REQUEST = _descriptor.Descriptor(
  name='Request',
  full_name='featureflags.backend.Request',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='operations', full_name='featureflags.backend.Request.operations', index=0,
      number=1, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='query', full_name='featureflags.backend.Request.query', index=1,
      number=2, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=1573,
  serialized_end=1677,
)


_REPLY = _descriptor.Descriptor(
  name='Reply',
  full_name='featureflags.backend.Reply',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='result', full_name='featureflags.backend.Reply.result', index=0,
      number=1, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=1679,
  serialized_end=1730,
)

_EITHERID.fields_by_name['id'].message_type = _ID
_EITHERID.fields_by_name['local_id'].message_type = _LOCALID
_EITHERID.oneofs_by_name['kind'].fields.append(
  _EITHERID.fields_by_name['id'])
_EITHERID.fields_by_name['id'].containing_oneof = _EITHERID.oneofs_by_name['kind']
_EITHERID.oneofs_by_name['kind'].fields.append(
  _EITHERID.fields_by_name['local_id'])
_EITHERID.fields_by_name['local_id'].containing_oneof = _EITHERID.oneofs_by_name['kind']
_ENABLEFLAG.fields_by_name['flag_id'].message_type = _ID
_DISABLEFLAG.fields_by_name['flag_id'].message_type = _ID
_RESETFLAG.fields_by_name['flag_id'].message_type = _ID
_ADDCHECK.fields_by_name['local_id'].message_type = _LOCALID
_ADDCHECK.fields_by_name['variable'].message_type = _ID
_ADDCHECK.fields_by_name['operator'].enum_type = featureflags_dot_protobuf_dot_graph__pb2._CHECK_OPERATOR
_ADDCHECK.fields_by_name['value_timestamp'].message_type = google_dot_protobuf_dot_timestamp__pb2._TIMESTAMP
_ADDCHECK.fields_by_name['value_set'].message_type = featureflags_dot_protobuf_dot_graph__pb2._SET
_ADDCHECK.oneofs_by_name['kind'].fields.append(
  _ADDCHECK.fields_by_name['value_string'])
_ADDCHECK.fields_by_name['value_string'].containing_oneof = _ADDCHECK.oneofs_by_name['kind']
_ADDCHECK.oneofs_by_name['kind'].fields.append(
  _ADDCHECK.fields_by_name['value_number'])
_ADDCHECK.fields_by_name['value_number'].containing_oneof = _ADDCHECK.oneofs_by_name['kind']
_ADDCHECK.oneofs_by_name['kind'].fields.append(
  _ADDCHECK.fields_by_name['value_timestamp'])
_ADDCHECK.fields_by_name['value_timestamp'].containing_oneof = _ADDCHECK.oneofs_by_name['kind']
_ADDCHECK.oneofs_by_name['kind'].fields.append(
  _ADDCHECK.fields_by_name['value_set'])
_ADDCHECK.fields_by_name['value_set'].containing_oneof = _ADDCHECK.oneofs_by_name['kind']
_ADDCONDITION.fields_by_name['flag_id'].message_type = _ID
_ADDCONDITION.fields_by_name['local_id'].message_type = _LOCALID
_ADDCONDITION.fields_by_name['checks'].message_type = _EITHERID
_DISABLECONDITION.fields_by_name['condition_id'].message_type = _ID
_OPERATION.fields_by_name['enable_flag'].message_type = _ENABLEFLAG
_OPERATION.fields_by_name['disable_flag'].message_type = _DISABLEFLAG
_OPERATION.fields_by_name['add_condition'].message_type = _ADDCONDITION
_OPERATION.fields_by_name['disable_condition'].message_type = _DISABLECONDITION
_OPERATION.fields_by_name['add_check'].message_type = _ADDCHECK
_OPERATION.fields_by_name['reset_flag'].message_type = _RESETFLAG
_OPERATION.fields_by_name['sign_in'].message_type = _SIGNIN
_OPERATION.fields_by_name['sign_out'].message_type = _SIGNOUT
_OPERATION.oneofs_by_name['op'].fields.append(
  _OPERATION.fields_by_name['enable_flag'])
_OPERATION.fields_by_name['enable_flag'].containing_oneof = _OPERATION.oneofs_by_name['op']
_OPERATION.oneofs_by_name['op'].fields.append(
  _OPERATION.fields_by_name['disable_flag'])
_OPERATION.fields_by_name['disable_flag'].containing_oneof = _OPERATION.oneofs_by_name['op']
_OPERATION.oneofs_by_name['op'].fields.append(
  _OPERATION.fields_by_name['add_condition'])
_OPERATION.fields_by_name['add_condition'].containing_oneof = _OPERATION.oneofs_by_name['op']
_OPERATION.oneofs_by_name['op'].fields.append(
  _OPERATION.fields_by_name['disable_condition'])
_OPERATION.fields_by_name['disable_condition'].containing_oneof = _OPERATION.oneofs_by_name['op']
_OPERATION.oneofs_by_name['op'].fields.append(
  _OPERATION.fields_by_name['add_check'])
_OPERATION.fields_by_name['add_check'].containing_oneof = _OPERATION.oneofs_by_name['op']
_OPERATION.oneofs_by_name['op'].fields.append(
  _OPERATION.fields_by_name['reset_flag'])
_OPERATION.fields_by_name['reset_flag'].containing_oneof = _OPERATION.oneofs_by_name['op']
_OPERATION.oneofs_by_name['op'].fields.append(
  _OPERATION.fields_by_name['sign_in'])
_OPERATION.fields_by_name['sign_in'].containing_oneof = _OPERATION.oneofs_by_name['op']
_OPERATION.oneofs_by_name['op'].fields.append(
  _OPERATION.fields_by_name['sign_out'])
_OPERATION.fields_by_name['sign_out'].containing_oneof = _OPERATION.oneofs_by_name['op']
_REQUEST.fields_by_name['operations'].message_type = _OPERATION
_REQUEST.fields_by_name['query'].message_type = hiku_dot_protobuf_dot_query__pb2._NODE
_REPLY.fields_by_name['result'].message_type = featureflags_dot_protobuf_dot_graph__pb2._RESULT
DESCRIPTOR.message_types_by_name['Id'] = _ID
DESCRIPTOR.message_types_by_name['LocalId'] = _LOCALID
DESCRIPTOR.message_types_by_name['EitherId'] = _EITHERID
DESCRIPTOR.message_types_by_name['SignIn'] = _SIGNIN
DESCRIPTOR.message_types_by_name['SignOut'] = _SIGNOUT
DESCRIPTOR.message_types_by_name['EnableFlag'] = _ENABLEFLAG
DESCRIPTOR.message_types_by_name['DisableFlag'] = _DISABLEFLAG
DESCRIPTOR.message_types_by_name['ResetFlag'] = _RESETFLAG
DESCRIPTOR.message_types_by_name['AddCheck'] = _ADDCHECK
DESCRIPTOR.message_types_by_name['AddCondition'] = _ADDCONDITION
DESCRIPTOR.message_types_by_name['DisableCondition'] = _DISABLECONDITION
DESCRIPTOR.message_types_by_name['Operation'] = _OPERATION
DESCRIPTOR.message_types_by_name['Request'] = _REQUEST
DESCRIPTOR.message_types_by_name['Reply'] = _REPLY
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

Id = _reflection.GeneratedProtocolMessageType('Id', (_message.Message,), {
  'DESCRIPTOR' : _ID,
  '__module__' : 'featureflags.protobuf.backend_pb2'
  # @@protoc_insertion_point(class_scope:featureflags.backend.Id)
  })
_sym_db.RegisterMessage(Id)

LocalId = _reflection.GeneratedProtocolMessageType('LocalId', (_message.Message,), {
  'DESCRIPTOR' : _LOCALID,
  '__module__' : 'featureflags.protobuf.backend_pb2'
  # @@protoc_insertion_point(class_scope:featureflags.backend.LocalId)
  })
_sym_db.RegisterMessage(LocalId)

EitherId = _reflection.GeneratedProtocolMessageType('EitherId', (_message.Message,), {
  'DESCRIPTOR' : _EITHERID,
  '__module__' : 'featureflags.protobuf.backend_pb2'
  # @@protoc_insertion_point(class_scope:featureflags.backend.EitherId)
  })
_sym_db.RegisterMessage(EitherId)

SignIn = _reflection.GeneratedProtocolMessageType('SignIn', (_message.Message,), {
  'DESCRIPTOR' : _SIGNIN,
  '__module__' : 'featureflags.protobuf.backend_pb2'
  # @@protoc_insertion_point(class_scope:featureflags.backend.SignIn)
  })
_sym_db.RegisterMessage(SignIn)

SignOut = _reflection.GeneratedProtocolMessageType('SignOut', (_message.Message,), {
  'DESCRIPTOR' : _SIGNOUT,
  '__module__' : 'featureflags.protobuf.backend_pb2'
  # @@protoc_insertion_point(class_scope:featureflags.backend.SignOut)
  })
_sym_db.RegisterMessage(SignOut)

EnableFlag = _reflection.GeneratedProtocolMessageType('EnableFlag', (_message.Message,), {
  'DESCRIPTOR' : _ENABLEFLAG,
  '__module__' : 'featureflags.protobuf.backend_pb2'
  # @@protoc_insertion_point(class_scope:featureflags.backend.EnableFlag)
  })
_sym_db.RegisterMessage(EnableFlag)

DisableFlag = _reflection.GeneratedProtocolMessageType('DisableFlag', (_message.Message,), {
  'DESCRIPTOR' : _DISABLEFLAG,
  '__module__' : 'featureflags.protobuf.backend_pb2'
  # @@protoc_insertion_point(class_scope:featureflags.backend.DisableFlag)
  })
_sym_db.RegisterMessage(DisableFlag)

ResetFlag = _reflection.GeneratedProtocolMessageType('ResetFlag', (_message.Message,), {
  'DESCRIPTOR' : _RESETFLAG,
  '__module__' : 'featureflags.protobuf.backend_pb2'
  # @@protoc_insertion_point(class_scope:featureflags.backend.ResetFlag)
  })
_sym_db.RegisterMessage(ResetFlag)

AddCheck = _reflection.GeneratedProtocolMessageType('AddCheck', (_message.Message,), {
  'DESCRIPTOR' : _ADDCHECK,
  '__module__' : 'featureflags.protobuf.backend_pb2'
  # @@protoc_insertion_point(class_scope:featureflags.backend.AddCheck)
  })
_sym_db.RegisterMessage(AddCheck)

AddCondition = _reflection.GeneratedProtocolMessageType('AddCondition', (_message.Message,), {
  'DESCRIPTOR' : _ADDCONDITION,
  '__module__' : 'featureflags.protobuf.backend_pb2'
  # @@protoc_insertion_point(class_scope:featureflags.backend.AddCondition)
  })
_sym_db.RegisterMessage(AddCondition)

DisableCondition = _reflection.GeneratedProtocolMessageType('DisableCondition', (_message.Message,), {
  'DESCRIPTOR' : _DISABLECONDITION,
  '__module__' : 'featureflags.protobuf.backend_pb2'
  # @@protoc_insertion_point(class_scope:featureflags.backend.DisableCondition)
  })
_sym_db.RegisterMessage(DisableCondition)

Operation = _reflection.GeneratedProtocolMessageType('Operation', (_message.Message,), {
  'DESCRIPTOR' : _OPERATION,
  '__module__' : 'featureflags.protobuf.backend_pb2'
  # @@protoc_insertion_point(class_scope:featureflags.backend.Operation)
  })
_sym_db.RegisterMessage(Operation)

Request = _reflection.GeneratedProtocolMessageType('Request', (_message.Message,), {
  'DESCRIPTOR' : _REQUEST,
  '__module__' : 'featureflags.protobuf.backend_pb2'
  # @@protoc_insertion_point(class_scope:featureflags.backend.Request)
  })
_sym_db.RegisterMessage(Request)

Reply = _reflection.GeneratedProtocolMessageType('Reply', (_message.Message,), {
  'DESCRIPTOR' : _REPLY,
  '__module__' : 'featureflags.protobuf.backend_pb2'
  # @@protoc_insertion_point(class_scope:featureflags.backend.Reply)
  })
_sym_db.RegisterMessage(Reply)



_BACKEND = _descriptor.ServiceDescriptor(
  name='Backend',
  full_name='featureflags.backend.Backend',
  file=DESCRIPTOR,
  index=0,
  serialized_options=None,
  serialized_start=1733,
  serialized_end=1885,
  methods=[
  _descriptor.MethodDescriptor(
    name='call',
    full_name='featureflags.backend.Backend.call',
    index=0,
    containing_service=None,
    input_type=_REQUEST,
    output_type=_REPLY,
    serialized_options=b'\210\002\001',
  ),
  _descriptor.MethodDescriptor(
    name='Call',
    full_name='featureflags.backend.Backend.Call',
    index=1,
    containing_service=None,
    input_type=_REQUEST,
    output_type=_REPLY,
    serialized_options=None,
  ),
])
_sym_db.RegisterServiceDescriptor(_BACKEND)

DESCRIPTOR.services_by_name['Backend'] = _BACKEND

# @@protoc_insertion_point(module_scope)
