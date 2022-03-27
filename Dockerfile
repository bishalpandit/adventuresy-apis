FROM node:16.3.0-alpine

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

CMD ["npm", "run", "start"]