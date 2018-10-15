FROM node:carbon-slim

# Create app directory
WORKDIR /git/api-gateway

# Install app dependencies
COPY package.json /git/api-gateway/
RUN npm install

# Bundle app source
COPY . /git/api-gateway/
RUN npm run prepublish

CMD [ "npm", "run", "runServer" ]