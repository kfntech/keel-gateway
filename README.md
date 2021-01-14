# Keel Gateway

This project is not affiliated with keel.sh in any capacity.

The docker image helps translate webhook calls from Aliyun (阿里云) docker repository into the format accepted by Keel thus removing the need to use Webhook Relay in a private setting.

For security reasons, you should still use Webhook Relay when using public endpoint.

This project uses Openresty (NGINX with a custom LUA module) to manipulate the POST request received and converts it into correct format for Keel consumption

## Quick Start
