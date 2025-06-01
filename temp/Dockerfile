FROM node:20.18

WORKDIR /app
COPY package.json .
RUN npm i
COPY . .
WORKDIR /app/views/
RUN npm i && npm run build
WORKDIR /app
RUN npm run build
EXPOSE 8080
CMD [ "npm", "run", "start" ]