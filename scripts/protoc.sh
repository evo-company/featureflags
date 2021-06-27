#!/bin/bash
set -e
export PROTO_PATH=$(python3 -c 'import os.path, hiku;\
                    print(os.path.dirname(os.path.dirname(hiku.__file__)))')
python3 -m grpc_tools.protoc -Iprotobuf -I$PROTO_PATH --python_out=protobuf protobuf/featureflags/protobuf/*.proto
python3 -m grpc_tools.protoc -Iprotobuf -I$PROTO_PATH --python_grpc_out=protobuf --grpc_python_out=protobuf protobuf/featureflags/protobuf/service.proto
./node_modules/.bin/pbjs --keep-case -p protobuf -p $PROTO_PATH -t static-module -w commonjs -o server/featureflags/server/web/cs/proto.js protobuf/featureflags/protobuf/backend.proto
./node_modules/.bin/pbts -o server/featureflags/server/web/cs/proto.d.ts server/featureflags/server/web/cs/proto.js
