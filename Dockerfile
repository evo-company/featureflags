FROM python:3.11-slim-bullseye as base

WORKDIR /app

ENV PIP_VERSION=22.0.2
ENV PDM_VERSION=2.4.6
ENV PDM_USE_VENV=no
ENV PYTHONPATH=/app/__pypackages__/3.11/lib

COPY pyproject.toml .
COPY pdm.lock .
COPY scripts/pre-install.sh .

RUN apt-get update && apt-get install -y libpq-dev gcc make g++ git && \
    # install tools
    pip install --upgrade pip==${PIP_VERSION} && \
    pip install pdm==${PDM_VERSION} && \

    # configure
    pdm config cache_dir /pdm_cache && \
    pdm config check_update false && \

    ./pre-install.sh && \
    # install base deps
    pdm install --no-lock --prod --no-editable  && \

    # cleanup base layer to keep image size small
    apt purge --auto-remove -y gcc make g++ git && \
      rm -rf /var/cache/apt && rm -rf /var/lib/apt/list && rm -rf $HOME/.cache

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

FROM base as dev

RUN pdm install --no-lock -G dev -G lint --no-editable

FROM base as test

RUN pdm install --no-lock -G test

FROM base as docs

RUN pdm install --no-lock -G docs

FROM base AS prd

ARG APP_VERSION=0.0.0-dev

ENV TINI_VERSION=v0.18.0
ENV GRPC_HEALTH_PROBE_VERSION=v0.2.0

ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

ADD "https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64" "/usr/local/bin/grpc_health_probe"
RUN chmod +x /usr/local/bin/grpc_health_probe

RUN echo "${APP_VERSION}" > /app_version

COPY server/featureflags /app/featureflags
COPY --from=assets-prod "ui/dist" "featureflags/server/web/static"

RUN python3 -m compileall featureflags

ENTRYPOINT ["/tini", "--", "python3", "-m"]
