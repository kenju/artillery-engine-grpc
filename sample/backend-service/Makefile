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
	protoc --go_out=plugins=grpc:. \
		-I ../protobuf-definitions \
		../protobuf-definitions/backend/services/*/*.proto
	protoc --go_out=plugins=grpc:. \
		-I ../protobuf-definitions \
		../protobuf-definitions/backend/resources/*/*.proto
  # HACK: change import path to make compile succeeded
	sed -i '' -e 's/v1 "/v1 "github.com\/kenju\/artillery-engine-grpc\/sample\/backend-service\//' backend/services/v1/hello.pb.go

## Run gRPC server locally
run-server:
	ADDR=127.0.0.1:8080 go run main.go

## Run gRPC client
run-client:
	go run client/client.go
