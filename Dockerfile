FROM openresty/openresty:alpine
WORKDIR /etc/nginx/conf.d
COPY default.conf .
EXPOSE 80