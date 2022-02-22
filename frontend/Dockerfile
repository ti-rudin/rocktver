FROM node:alpine
WORKDIR /usr/src/app
COPY . /usr/src/app/

RUN npm i --silent && npm run build

ENV HOST 0.0.0.0
EXPOSE 3000
CMD ["npm", "run", "dev"]
