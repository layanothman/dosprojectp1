FROM node:18-alpine as base

# Catalog Service
FROM base as production
WORKDIR /app
RUN apk add --no-cache sqlite
COPY package.json .
COPY ./src/nginx .
RUN npm install
COPY ./src/catalog-service .
EXPOSE 3005
CMD ["npm", "run", "start-catalog"]

# Order Service
FROM base as production1
WORKDIR /app
RUN apk add --no-cache sqlite
COPY package.json .
COPY ./src/nginx .
RUN npm install
COPY ./src/order-service .
EXPOSE 3006
CMD ["npm", "run", "start-order"]

# Catalog Replica
FROM base as production2
WORKDIR /app
RUN apk add --no-cache sqlite
COPY package.json .
COPY ./src/nginx .
RUN npm install
COPY ./src/catalog-service-replica .
EXPOSE 3009
CMD ["npm", "run", "start-catalog-replica"]

# Order Replica
FROM base as production3
WORKDIR /app
RUN apk add --no-cache sqlite
COPY package.json .
COPY ./src/nginx .
RUN npm install
COPY ./src/order-service-replica .
EXPOSE 3008
CMD ["npm", "run", "start-order-replica"]

# Client
FROM base as client
WORKDIR /app
COPY package.json .
COPY ./src/nginx .
RUN npm install
COPY ./src/client-service .
EXPOSE 3007
CMD ["npm", "run", "start-client"]
