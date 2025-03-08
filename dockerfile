FROM node:23-alpine

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

RUN mkdir -p /app && chown -R appuser:appgroup /app

RUN chown -R appuser:appgroup /app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "App.js"]
