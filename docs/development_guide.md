# Development Guide

A development guide.

## Logging

We use [`debug`](https://www.npmjs.com/package/debug) package for debugging with `engine:grpc` tag.

To show debug log, add `DEBUG=engine:grpc` to the environments.

```
DEBUG=engine:grpc npm run start
```

## Publish

We use [GitHub Actions](https://help.github.com/en/actions) workflow to publish packages to https://www.npmjs.com/package/artillery-engine-grpc.

Update `version` field in the `package.json`.

Create `v*` tags and push to origin/master.

```
git tag v0.0.x
git push origin --tags
```

See `.github/workflows/npm-publish.yml` for more details.

## Other Engines

service | source code
---|---
AWS Kinesis | https://github.com/artilleryio/artillery-engine-kinesis
AWS Lambda | https://github.com/orchestrated-io/artillery-engine-lambda
Apache Kafka | https://github.com/flentini/artillery-engine-kafka
