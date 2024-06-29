# Use the official PostgreSQL image from the Docker Hub
FROM postgres:latest

# Set environment variables

ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=0000

# Copy the SQL dump file into the container
COPY ./init/ /docker-entrypoint-initdb.d/


