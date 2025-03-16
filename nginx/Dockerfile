FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /var/www/nginx/.well-known/acme-challenge

# Drop symlinks
RUN unlink /var/log/nginx/access.log
RUN unlink /var/log/nginx/error.log

EXPOSE 80
EXPOSE 443