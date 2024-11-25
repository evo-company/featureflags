FROM python:3.11-slim-bullseye as base

ENV PIP_VERSION=23.2.1
ENV PDM_VERSION=2.9.1
ENV PDM_USE_VENV=no
ENV PYTHONPATH=/app/__pypackages__/3.11/lib

WORKDIR /app

COPY ./pyproject.toml .
COPY ./pdm.lock .

# for pyproject.toml to extract version
COPY ./featureflags/__init__.py ./featureflags/__init__.py
# for pyproject.toml to read readme
COPY ./README.md .

RUN apt-get update && \
  apt-get install -y --no-install-recommends \
  libpq-dev \
  gcc \
  make \
  g++ \
  git && \
  # install tools
  pip install --upgrade pip==${PIP_VERSION} && \
  pip install pdm==${PDM_VERSION} && \
  # configure
  pdm config cache_dir /pdm_cache && \
  pdm config check_update false && \
  # install base deps \
  pdm install --no-lock --prod --no-editable  && \
  # cleanup base layer to keep image size small
  apt purge --auto-remove -y \
  gcc \
  make \
  g++ \
  git && \
  rm -rf /var/cache/apt && \
  rm -rf /var/lib/apt/list && \
  rm -rf $HOME/.cache

FROM node:18-bullseye-slim as assets-base
ENV NODE_PATH=/node_modules
ENV PATH=$PATH:/node_modules/.bin

COPY ui ui
RUN cd ui && npm ci

FROM assets-base as assets-dev

FROM assets-base as assets-prod
RUN cd ui && npm run build

FROM base as dev
RUN pdm install --no-lock -G dev -G sentry -G lint --no-editable

FROM base as test
RUN pdm install --no-lock -G test

FROM base as docs
RUN pdm install --no-lock -G docs

FROM base AS prd

ARG APP_VERSION=0.0.0-dev
RUN echo "${APP_VERSION}" > /app_version

ENV TINI_VERSION=v0.19.0
ADD "https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini" "/tini"
RUN chmod +x /tini

ENV GRPC_HEALTH_PROBE_VERSION=v0.4.19
ADD "https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64" "/usr/local/bin/grpc_health_probe"
RUN chmod +x /usr/local/bin/grpc_health_probe

COPY ./featureflags /app/featureflags

COPY --from=base /app/__pypackages__/3.11/lib /app
COPY --from=base /app/__pypackages__/3.11/bin/* /bin/

COPY --from=assets-prod "ui/dist" "featureflags/web/static"

RUN python3 -m compileall -j=0 -o=2 -f featureflags

ENTRYPOINT ["/tini", "--", "python3", "-m"]
