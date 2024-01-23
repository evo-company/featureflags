#!/bin/bash

cd ./ui

npm run build
cp -r dist ../featureflags/web/static

cd ../
