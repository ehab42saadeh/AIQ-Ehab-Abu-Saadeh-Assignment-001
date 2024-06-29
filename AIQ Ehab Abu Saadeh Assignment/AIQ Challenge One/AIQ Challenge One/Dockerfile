FROM node:alpine

# working directory
RUN mkdir -p /usr/src/app 
WORKDIR /usr/src/app

# app dependencies
COPY package*.json ./

# Install dependencies including nodemon


RUN npm install -g nodemon 

RUN  npm install 
# build code for production
# RUN npm ci --only=production

# Bundle app source 
COPY . .

EXPOSE 8080
CMD ["npm", "run", "start.dev"]

