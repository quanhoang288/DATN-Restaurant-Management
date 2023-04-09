FROM node:16-alpine as build

WORKDIR /home/restaurant-management-fe

COPY package*.json ./

RUN npm i

COPY . .

ENV BUILD_PATH=dist/

RUN npm run build

# Set up nginx with built files
FROM nginx:stable-alpine

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /home/restaurant-management-fe/dist /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]