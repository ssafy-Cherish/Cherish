FROM node:20 AS builder
WORKDIR /frontend
COPY package.json .
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run dev -- --host