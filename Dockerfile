# Dockerfile
FROM golang:1-alpine AS builder

WORKDIR /app

COPY . .

RUN go build -o shell-playground

FROM alpine:3.18.9

RUN apk --no-cache add bash ca-certificates

# 设置工作目录
WORKDIR /root/

COPY --from=builder /app/shell-playground .
COPY --from=builder /app/static ./static

CMD ["./shell-playground"]

EXPOSE 21110
