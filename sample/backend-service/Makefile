# https://www.gnu.org/software/make/manual/make.html#index-_002eEXPORT_005fALL_005fVARIABLES
.EXPORT_ALL_VARIABLES:
GO111MODULE=on

NAME := backend-service
VERSION := $(shell git describe --tags --abbrev=0)
REVISION := $(shell git rev-parse --short HEAD)
LDFLAGS := -s -w -X 'main.version=$(VERSION)' -X 'main.revision=$(REVISION)'

## Show help
help:
	@make2help $(MAKEFILE_LIST)

## Run built binaries
run: build
	./backend-service

## Build binaries
build:
	go build -ldflags "$(LDFLAGS)"

## Setup install third-party libraries for development
setup:
	go get github.com/Songmu/make2help/cmd/make2help
	go get google.golang.org/grpc
	go get github.com/golang/protobuf/protoc-gen-go

## Update go modules
update:
	go get -u
	go mod tidy

## Compile protobuf definitions with grpc-go plugin
protoc:
	protoc \
		-I ../protobuf-definitions \
		-I /usr/local/include \
		-I ${GOPATH}/src \
		-I ${GOPATH}/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis \
		--go_out=plugins=grpc:. \
		../protobuf-definitions/backend/services/v1/hello.proto

## Run gRPC server locally
run-server:
	ADDR=127.0.0.1:8080 go run main.go

## Run gRPC client
run-client:
	go run client/client.go
