FROM node:25-alpine as builder
WORKDIR /app
ARG REACT_APP_BASE_URL
ARG REACT_APP_CLIENT_ID
ARG REACT_APP_CLIENT_SECRET
ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL
ENV REACT_APP_CLIENT_ID=$REACT_APP_CLIENT_ID
ENV REACT_APP_CLIENT_SECRET=$REACT_APP_CLIENT_SECRET
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:25-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
