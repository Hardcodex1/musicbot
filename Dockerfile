FROM node:16

WORKDIR /app

ARG BOT_TOKEN

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "index.js"]
