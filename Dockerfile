# Build
FROM node:10 as build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm i -g npm
RUN npm i

COPY webpack.config.js .babelrc ./
COPY configs ./configs
COPY assets ./assets
COPY src ./src
RUN npm run build


# Run
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
COPY --from=build /app/target/app /usr/share/nginx/html
