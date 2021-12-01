FROM node:16

WORKDIR /urs/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3002

CMD ["npm", "run", "dev"]