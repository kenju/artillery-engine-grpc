package main

import (
	"context"
	"log"
	"time"

	backend_resource "github.com/kenju/artillery-engine-grpc/sample/backend-service/backend/resources/v1"
	backend_service "github.com/kenju/artillery-engine-grpc/sample/backend-service/backend/services/v1"
	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
)

func main() {
	var opts []grpc.DialOption
	opts = append(opts, grpc.WithInsecure())

	serverAddr := "127.0.0.1:8080"

	conn, err := grpc.Dial(serverAddr, opts...)
	if err != nil {
		panic(err)
	}
	defer conn.Close()

	backendCheck(conn)
}

func backendCheck(conn *grpc.ClientConn) {
	client := backend_service.NewHelloServiceClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	backendHello(ctx, client)
	backendBye(ctx, client)
}

func backendHello(ctx context.Context, client backend_service.HelloServiceClient) {
	req := &backend_service.HelloRequest{
		Id:       1,
		Name:     "Foo",
		Platform: backend_resource.Platform_Web,
	}

	ctx = metadata.AppendToOutgoingContext(ctx,
		"user-id", "u111",
	)

	message, err := client.Hello(ctx, req)
	if err != nil {
		panic(err)
	}
	log.Printf("backend.Hello() message=%+v\n", message)
}

func backendBye(ctx context.Context, client backend_service.HelloServiceClient) {
	req := &backend_service.ByeRequest{}
	message, err := client.Bye(ctx, req)
	if err != nil {
		panic(err)
	}
	log.Printf("backend.Bye() message=%+v\n", message)
}
