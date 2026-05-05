FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
# Health check Docker will ping /health.html every 10 seconds.
# If the endpoint fails 3 times in a row, the container is marked unhealthy.
# This enables smoke testing of the running container post-deployment.
HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost/health.html || exit 1
