#!/bin/bash

# SQL Server container setup for Podman on macOS M4
# This script pulls and runs SQL Server 2022 in a container

# Configuration
CONTAINER_NAME="sql2022"
SA_PASSWORD="YourStrong@Passw0rd123"
PORT="1433"

echo "Pulling SQL Server 2022 image..."
podman pull --platform linux/amd64 mcr.microsoft.com/mssql/server:2022-latest

echo "Starting SQL Server container..."
podman run \
  --platform linux/amd64 \
  -e "ACCEPT_EULA=Y" \
  -e "MSSQL_SA_PASSWORD=${SA_PASSWORD}" \
  -p ${PORT}:1433 \
  --name ${CONTAINER_NAME} \
  --hostname ${CONTAINER_NAME} \
  -d \
  mcr.microsoft.com/mssql/server:2022-latest

echo ""
echo "SQL Server container started successfully!"
echo "Container name: ${CONTAINER_NAME}"
echo "Port: ${PORT}"
echo "SA Password: ${SA_PASSWORD}"
echo ""
echo "Connection string details:"
echo "Server: localhost,${PORT}"
echo "User: sa"
echo "Password: ${SA_PASSWORD}"
echo ""
echo "To stop the container: podman stop ${CONTAINER_NAME}"
echo "To start the container: podman start ${CONTAINER_NAME}"
echo "To remove the container: podman rm ${CONTAINER_NAME}"
echo "To view logs: podman logs ${CONTAINER_NAME}"