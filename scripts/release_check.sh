#!/bin/bash
if [[ $(git status client server protobuf -s) ]]; then
    echo "Working directory is not clean"
    false
else
    true
fi
