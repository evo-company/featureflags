#!/bin/bash

cd ./ui
npm run build
cp -r dist ../server/featureflags/server/web/static
cd ../
