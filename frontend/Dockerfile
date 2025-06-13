FROM node:20 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/.next/standalone /usr/share/nginx/html
COPY --from=build /app/.next/static /usr/share/nginx/html/_next/static
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000