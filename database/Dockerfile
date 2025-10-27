FROM postgres:15-alpine

# Copy initialization script
COPY init.sql /docker-entrypoint-initdb.d/init.sql

# Expose default PostgreSQL port
EXPOSE 5432
