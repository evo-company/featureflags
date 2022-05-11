FROM python:3.7.13-slim-bullseye as base

WORKDIR /app

RUN apt-get update \
    && apt-get install -y build-essential

COPY server/setup.txt /app/server/setup.txt

RUN pip3 install --no-cache-dir --no-deps --disable-pip-version-check -r "server/setup.txt"

FROM node:12.4.0-alpine as assets-base
ENV NODE_PATH=/node_modules
ENV PATH=$PATH:/node_modules/.bin
RUN npm install

FROM assets-base as assets-dev
COPY ui ui

FROM assets-base as assets-prod
COPY ui ui
RUN cd ui \
    && npm install \
    && npm run build

FROM base as prd

COPY . .

RUN pip3 install --no-deps server/

COPY --from=assets-prod "ui/dist" "server/featureflags/server/web/static"
ADD "https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/v0.2.0/grpc_health_probe-linux-amd64" \
    "/usr/local/bin/grpc_health_probe"

ADD "https://github.com/krallin/tini/releases/download/v0.18.0/tini" "/tini"

RUN chmod +x /usr/local/bin/grpc_health_probe \
    && chmod +x /tini

FROM base as dev

ADD "https://github.com/watchexec/watchexec/releases/download/cli-v1.19.0/watchexec-1.19.0-x86_64-unknown-linux-gnu.deb" /opt/watchexec.deb
RUN apt-get install /opt/watchexec.deb
RUN pip install pip-tools && mkdir -p /.cache/pip-tools && chmod -R 777 /.cache/pip-tools

FROM dev as test
COPY requirements-tests.txt .

RUN pip3 install --no-cache-dir --no-deps --disable-pip-version-check -r requirements-tests.txt

FROM base as docs
COPY requirements-docs.txt .

RUN pip3 install --no-cache-dir --no-deps --disable-pip-version-check -r requirements-docs.txt
