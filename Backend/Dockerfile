FROM node:latest
WORKDIR /app/backend
COPY package*.json ./
RUN npm install
RUN npm install -g pm2
COPY . .
EXPOSE 4000
CMD ["npm", "run","start"]
