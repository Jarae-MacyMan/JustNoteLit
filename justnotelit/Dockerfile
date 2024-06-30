
FROM node:17-alpine

WORKDIR /app

# Copy package.json  to the working directory
COPY package*.json .

# Install the dependencies
RUN npm install


# Copy the rest of the application code to the working directory
COPY . .

RUN npm run build

#expose port 3000
EXPOSE 3000


CMD ["npm", "start"]