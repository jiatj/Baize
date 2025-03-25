# base image
FROM python:3.12-slim-bookworm AS base

WORKDIR /app/api

# Install Poetry
ENV POETRY_VERSION=2.0.1

# if you located in China, you can use aliyun mirror to speed up
RUN pip install --no-cache-dir poetry==${POETRY_VERSION} -i https://mirrors.aliyun.com/pypi/simple/

# RUN pip install --no-cache-dir poetry==${POETRY_VERSION}

# Configure Poetry
ENV POETRY_CACHE_DIR=/tmp/poetry_cache
ENV POETRY_NO_INTERACTION=1
ENV POETRY_VIRTUALENVS_IN_PROJECT=true
ENV POETRY_VIRTUALENVS_CREATE=true
ENV POETRY_REQUESTS_TIMEOUT=300

FROM base AS packages

# if you located in China, you can use aliyun mirror to speed up
RUN sed -i 's@deb.debian.org@mirrors.aliyun.com@g' /etc/apt/sources.list.d/debian.sources

RUN mkdir -p /root/.pip && \
    echo "[global]\nindex-url = https://pypi.tuna.tsinghua.edu.cn/simple\ntrusted-host = pypi.tuna.tsinghua.edu.cn" > /root/.pip/pip.conf



RUN apt-get update && apt-get install -y --no-install-recommends gcc g++ libc-dev libffi-dev libgmp-dev libmpfr-dev libmpc-dev
#RUN poetry config repositories.tuna https://pypi.tuna.tsinghua.edu.cn/simple
RUN poetry config repositories.aliyun https://mirrors.aliyun.com/pypi/simple/
ENV POETRY_HTTP_BASIC_PYPI_URL=https://pypi.tuna.tsinghua.edu.cn/simple
ENV PIP_TIMEOUT=600
# Install Python dependencies
COPY pyproject.toml poetry.lock ./
# 更新 poetry.lock 文件
RUN poetry lock

RUN poetry config repositories
RUN pip install --upgrade setuptools 
RUN poetry sync --no-cache --no-root
#RUN poetry install --sync --no-root
# production stage
FROM base AS production

ENV FLASK_APP=app.py
ENV EDITION=SELF_HOSTED
ENV DEPLOY_ENV=PRODUCTION
ENV CONSOLE_API_URL=http://127.0.0.1:5001
ENV CONSOLE_WEB_URL=http://127.0.0.1:3000
ENV SERVICE_API_URL=http://127.0.0.1:5001
ENV APP_WEB_URL=http://127.0.0.1:3000

EXPOSE 5001

# set timezone
ENV TZ=UTC

WORKDIR /app/api

RUN \
    apt-get update \
    # Install dependencies
    && apt-get install -y --no-install-recommends \
        # basic environment
        curl nodejs libgmp-dev libmpfr-dev libmpc-dev \
        # For Security
        expat libldap-2.5-0 perl libsqlite3-0 zlib1g \
        # install a package to improve the accuracy of guessing mime type and file extension
        media-types \
        # install libmagic to support the use of python-magic guess MIMETYPE
        libmagic1 \
        # install libmagic to support the use of python-magic guess MIMETYPE
        media-types \
        # install a package to improve the accuracy of guessing mime type and file extension
        fonts-noto-cjk \
        # install a chinese font to support the use of tools like matplotlib
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# Copy Python environment and packages
ENV VIRTUAL_ENV=/app/api/.venv
COPY --from=packages ${VIRTUAL_ENV} ${VIRTUAL_ENV}
ENV PATH="${VIRTUAL_ENV}/bin:${PATH}"


# Download nltk data
#RUN python -c "import nltk; nltk.download('punkt',url='https://mirrors.tuna.tsinghua.edu.cn/nltk/'); nltk.download('averaged_perceptron_tagger',url='https://mirrors.tuna.tsinghua.edu.cn/nltk/')"

# 设置NLTK数据和镜像源
ENV NLTK_DATA=/usr/local/share/nltk_data
ENV NLTK_DATA_URL=https://mirrors.tuna.tsinghua.edu.cn/nltk_data/

# 安装依赖并下载数据
RUN pip install nltk && \
    mkdir -p $NLTK_DATA && \
    python -c "import nltk; nltk.download('punkt', download_dir='$NLTK_DATA')" && \
    python -c "import nltk; nltk.download('averaged_perceptron_tagger', download_dir='$NLTK_DATA')"


ENV TIKTOKEN_CACHE_DIR=/app/api/.tiktoken_cache

RUN python -c "import tiktoken; tiktoken.encoding_for_model('gpt2')"

# Copy source code
COPY . /app/api/

# Copy entrypoint
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ARG COMMIT_SHA
ENV COMMIT_SHA=${COMMIT_SHA}

ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]
