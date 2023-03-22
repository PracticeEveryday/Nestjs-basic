FROM node:18.14.2

WORKDIR /usr/src/app

COPY . /usr/src/app

COPY yarn.lock package.json /usr/src/app

# RUN npm install -g yarn

RUN npx husky

RUN yarn install 

RUN yarn build

# FROM node:18.14.2

# WORKDIR /usr/src/app

ENV NODE_ENV=development

EXPOSE 8080

CMD ["yarn", "start:dev"]