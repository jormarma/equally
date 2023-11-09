FROM alpine

RUN apk add --update --no-cache npm

COPY . .

RUN npm ci

CMD [ "npm", "run", "_test" ]