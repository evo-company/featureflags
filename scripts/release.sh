#!/bin/bash
set -e
USAGE="Usage: VERSION=<> MESSAGE=<> pdm run release"

if [ -z "${VERSION}" ]; then
    echo "$USAGE"
    echo "VERSION is not set"
    exit 1
fi
if [ -z "${MESSAGE}" ]; then
    echo "$USAGE"
    echo "MESSAGE is not set"
    exit 1
fi

echo "Releasing ${VERSION} with message: ${MESSAGE}"

echo "__version__ = \"${VERSION}\"" > featureflags/__init__.py
git add featureflags/__init__.py
git commit -m "Release ${VERSION}"

git tag -a v${VERSION} -m "${MESSAGE}"
git push origin main --tags
