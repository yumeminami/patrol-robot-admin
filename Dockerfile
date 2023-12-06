FROM node:16 as builder

# Create app directory
WORKDIR /app
COPY . /app

# Install app dependencies
RUN npm install --force --slient

RUN npm run build

FROM nginx:latest

COPY --from=builder /app/build /patrol-robot-admin

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]