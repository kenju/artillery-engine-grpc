# artillery-engine-grpc sample

## Usage

### Setup

Link `artillery-engine-grpc` for this sample repository's package.json using [`npm link`](https://docs.npmjs.com/cli/link.html)

```
# create symlink at first
cd artillery-engine-grpc/
npm link

# link created symlink to this sample repository
cd sample/
npm link artillery-engine-grpc
```

### Load Test

At first, run containers:

```
docker-compose pull
docker-compose up --build
```

Check the running containers:

```
docker-compose ps
```

output:

```
          Name                   Command         State           Ports
-------------------------------------------------------------------------------
sample_backend-service_1   /go/backend-service   Up      0.0.0.0:8080->8080/tcp
```

Send gRPC request to gateway-service:

```
(cd backend-service && make run-client)
```

output:

```
2019/09/28 14:38:18 backend.Hello() message=success:<status_code:"0" >
```

containers' log:

```
backend-service_1  | time="2019-09-28T05:38:18Z" level=info msg="Hello()" func="main.(*backendServer).Hello" file="/app/main.go:88" request=
```

### Load Test

Run the load test with:

```
npm install
DEBUG=engine:grpc npm run start
```
