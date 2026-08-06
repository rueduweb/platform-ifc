# step1: We build the angular app using the production config
FROM node:24.18.0-alpine AS build
# Set the working directory
WORKDIR /app
# Copy the package json and package-lock.json files
COPY package*.json ./
# Run a clean install of the dependencies
RUN npm install
# Install Angular CLI globally
RUN npm install -g @angular/cli
# Copy all files
COPY . .
# Build the application
RUN npm run build
# step2: We use the nginx image to serve the application
FROM nginx:stable
# Copy config in the system files of docker
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# Copy build app in the shared folder of nginx
COPY --from=build /app/dist/frontpart/browser /usr/share/nginx/html
#Expose port 80
EXPOSE 80
# Commands to use with docker
#Build: docker build -t frontpart-nodejs .
#Run: docker run -d -p 8080:80 frontpart-nodejs
