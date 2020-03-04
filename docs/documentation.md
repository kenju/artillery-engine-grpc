# Documentation

A user guide.

## `config.engines.grpc`

### Full Example

```yaml
config:
  engines:
    grpc:
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
        includeDirs: [ './protobuf-definitions' ]
```

### `config.engines.grpc.protobufDefinition` (required)

You should define a single `.proto` file with its package and service.

If we have the following proto file:

```proto
syntax = "proto3";

package backend.services.v1;

service HelloService {
    rpc Hello (HelloRequest) returns (HelloResponse);
}
```

`protobufDefinition` settings will look like the following:

```yaml
grpc:
  # specify .proto file basic information
  protobufDefinition:
    filepath: protobuf-definitions/backend/services/v1/hello.proto
    package: backend.services.v1
    service: HelloService
```

### `config.engines.grpc.channelOpts` (optional)

You can set [grpc-ChannelOptions](https://grpc.github.io/grpc/node/grpc.Channel.html).

The available options are listed at https://grpc.github.io/grpc/core/group__grpc__arg__keys.html

```yaml
grpc:
  channelOpts:
    grpc.client_idle_timeout_ms: 1000
```

### `config.engines.grpc.protoLoaderConfig` (optional)

artillery-engine-grpc use [@grpc/proto-loader](https://www.npmjs.com/package/@grpc/proto-loader) for loading .proto files. You can pass its configuration via `protoLoaderConfig` attributes.

The default values will depend on @grpc/proto-loader's default values.

```yaml
grpc:
  protoLoaderConfig:
    keepCase: true
    longs: String
    enums: String
    bytes: Buffer
    defaults: false
    arrays: false
    objects: false
    oneofs: true
    includeDirs: [ './protobuf-definitions' ]
```
