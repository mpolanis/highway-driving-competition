FROM cyberbotics/webots.cloud:R2023b-ubuntu22.04-09.03.2023

# Copy all the competition files into a project folder
# in webots.yml this folder is referenced in the "dockerCompose" field to be used by the theia IDE when testing the competition online
RUN mkdir -p /usr/local/webots-project
COPY . /usr/local/webots-project

# Install the driving simulation requirements
RUN apt-get update && apt-get install --yes \
    python3-pip \
    libxerces-c-dev \
    libfox-1.6-dev \
    libgdal-dev \
    libproj-dev \
    libgl2ps-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --upgrade pip && \
    pip3 install --no-cache-dir \
    lxml \
    pyproj \
    shapely \
    rtree \
    webcolors \
    configparser
