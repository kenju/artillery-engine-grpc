# artillery-engine-grpc

Load test gRPC application with [Artillery.io](https://github.com/orchestrated-io/artillery-engine-lambd)

https://www.npmjs.com/package/artillery-engine-grpc

## NOTE ⚠️

This library is still in alpha version. The configuration & YAML definition will be changed drastically in the stable version, so please be careful 🚧

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
# my-scenario.yml
# @doc https://artillery.io/docs/script-reference/
config:
  target: 127.0.0.1:8080
  phases:
    - duration: 10 #sec
      arrivalRate: 10
      pause: 15 #sec
  engines:
    grpc:
      protobufDefinition:
        filepath: protobuf-definitions/backend/services/v1/hello.proto
        package: backend.services.v1
        service: HelloService

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

## References

### Other Engines

service | source code
---|---
AWS Kinesis | https://github.com/artilleryio/artillery-engine-kinesis
AWS Lambda | https://github.com/orchestrated-io/artillery-engine-lambda
Apache Kafka | https://github.com/flentini/artillery-engine-kafka

## License

[MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)
