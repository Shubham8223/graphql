FROM node:latest
WORKDIR /app/frontend
COPY package*.json ./
RUN npm install 
RUN npm install -g vite
COPY . .
EXPOSE 3000
CMD ["npm", "run","dev"]
