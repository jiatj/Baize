FROM --platform=linux/amd64 node:20.18.0-bullseye-slim

WORKDIR /app

COPY . .

RUN yarn config set registry https://registry.npmmirror.com/
RUN yarn install
RUN yarn build

ENV APP_API_URL=http://127.0.0.1:5001
ENV PORT=3001

EXPOSE 3001

CMD ["yarn","start"]
