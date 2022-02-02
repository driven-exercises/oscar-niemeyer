#!/bin/bash

docker-compose -f ./.hub/docker-compose.test.yml down;
docker-compose -f ./.hub/docker-compose.test.yml up --build --exit-code-from app;
