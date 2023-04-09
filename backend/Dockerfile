FROM node:16-alpine

WORKDIR /home/restaurant-management-be

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3000

CMD [ "node", "src/index.js" ]