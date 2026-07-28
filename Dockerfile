FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
#CAMBIA EL PUERTO AQUI (EJEMPLO USANDO EL 3000)
EXPOSE 5173
CMD ["nginx", "-g", "daemon off"]