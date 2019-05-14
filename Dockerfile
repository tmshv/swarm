# Build
FROM node:12-alpine as build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY .babelrc .browserslistrc ./
COPY assets ./assets
COPY src ./src
RUN npm run build


# Run
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html
