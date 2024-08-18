FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf

# Drop symlinks
RUN unlink /var/log/nginx/access.log
RUN unlink /var/log/nginx/error.log

EXPOSE 80