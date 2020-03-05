# artillery-engine-grpc

[![npm version](https://badge.fury.io/js/artillery-engine-grpc.svg)](https://badge.fury.io/js/artillery-engine-grpc) ![Publish Node.js Package](https://github.com/kenju/artillery-engine-grpc/workflows/Publish%20Node.js%20Package/badge.svg)

Load test gRPC application with [Artillery.io](https://artillery.io/)

## Documentation

For users:

- [Documentation](https://kenju.github.io/artillery-engine-grpc/documentation)

For developers:

- [Development Guide](https://kenju.github.io/artillery-engine-grpc/development_guide)

## Usage

### Install the plugin

```sh
# if `artillery` is installed globally
npm install -g artillery-engine-grpc
```

### Define your scenario

#### .proto file

```proto
syntax = "proto3";

package backend.services.v1;

service HelloService {
    rpc Hello (HelloRequest) returns (HelloResponse) {
    }
}

message HelloRequest {
    int32 id = 1;
    string name = 2;
}

message HelloResponse {
    string message = 1;
}
```

#### scenario file

```yml
config:
  target: 127.0.0.1:8080
  phases:
    - duration: 10
      arrivalRate: 10
      pause: 15
  engines:
    grpc:
      channelOpts:
        grpc.client_idle_timeout_ms: 1000
      protobufDefinition:
        filepath: protobuf-definitions/backend/services/v1/hello.proto
        package: backend.services.v1
        service: HelloService
      protoLoaderConfig:
        keepCase: true
        longs: String
        enums: String
        bytes: Buffer
        defaults: false
        arrays: false
        objects: false
        oneofs: true
        includeDirs: []
      metadata:
        "user-id": u123

scenarios:
  - name: test backend-service running at http://localhost:8000
    engine: grpc
    flow:
    # list RPC names with its arguments
    - Hello:
        id: 1
        name: Alice
    - Hello:
        id: 2
        name: Bob
    - Hello:
        id: 3
        name: Chris

```

### Run the scenario

```
artillery run my-scenario.yml
```

## License

[MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)
