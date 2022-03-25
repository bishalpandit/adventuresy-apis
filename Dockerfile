FROM mhart/alpine-node:6.17

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "start"]