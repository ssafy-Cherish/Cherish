FROM node:20 AS builder
WORKDIR /frontend
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run dev -- --host