#!/bin/bash

npm run build
cp -r dist ../server/featureflags/server/web/static
