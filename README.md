# artillery-engine-grpc

Load test gRPC application with [Artillery.io](https://github.com/orchestrated-io/artillery-engine-lambd)

https://www.npmjs.com/package/artillery-engine-grpc

## Usage

### Install the plugin

```sh
# if `artillery` is installed globally
npm install -g artillery-engine-grpc
```

### Define your scenario

```yml
# my-scenario.yml
config:
  target: 'https://localhost:8000'
  phases:
    - duration: 60
      arrivalRate: 20
  engines:
    grpc: {}
  defaults:
    protobufDefinition: ''

scenarios:
  name: 'test gRPC Application'
  engine: 'grpc'
  flow:
    - Hello:
        foo: "var"
```

### Run the scenario

```
artillery run my-scenario.yml
```

## Development

### Use `sample/` with local source code

Use [`npm link`](https://docs.npmjs.com/cli/link).

e.g. https://github.com/artilleryio/artillery/issues/508#issuecomment-408361851

## References

### Other Engines

service | source code
---|---
AWS Kinesis | https://github.com/artilleryio/artillery-engine-kinesis
AWS Lambda | https://github.com/orchestrated-io/artillery-engine-lambda
Apache Kafka | https://github.com/flentini/artillery-engine-kafka

## License

[MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)
