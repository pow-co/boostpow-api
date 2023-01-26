
# BoostPow Server

Welcome to the world of honest signals based in proof of work in Bitcoin. Everyone can benefit by paying attention to the signals coming out of the blockchain, and this project aims to make it easy for any organization decentralized access the Boost POW signal directly.

The goal of Boost Server is to provide a realiable, real-time index of Boost POW within your datacenter or virtual network.

**With Boost Server Your Apps Cut Straight To the Signal That Bitcoin Values**

- full index of all boosted content
- apps and services access the blockchain without need for a node
- your miners can manage and submit their proof of work to the network
- your apps can easily buy proof of work


## Installation

### Docker
```
docker-compose up

```

Once running, navigate to `http://localhost:8000/api` to get started using the API


## Usage

At the heart of the boostpow signal is ranking, causing some information to stand out against the massive black hole of information within the blockchain. Your apps need to be able to quickly rank content in the blockchain based on how much proof of work signal they have received over a given time span relative to the other information.

```
curl -d '{"content": "596d6103b11a0d31cb225f01aff924713e807b6741f0e3356770658e2c272a17", "difficulty": 0.0009, "tag": "boostpowdev"}' \
	http://localhost:5200/api/v1/scripts

```
### Ranking by Label

## Configuration

BoostPow Server may be configured in several ways depending on the needs of your environment.

1) Environment Variables

2) Configuration Files

3) Command Line Arguments

The same variables are used in all three options, however in configuration files and command line arguments all variables are strictly lower case, whereas in environment variables they may be upper case or lower case.

### Environment Variables

| Variable             | Description                                                                             | Default | Required |
|----------------------|-----------------------------------------------------------------------------------------|---------|----------|
| HTTP_API_ENABLED     | Serve JSON API. Disabling will still sync the boostpow chain                            | true    | false    |
| AMQP_ENABLED         | Communicate between components via RabbitMQ. Require by some features under src/actors/ | true    | false    |
| POSTGRES_ENABLED     | Cache boost jobs, proof of work, and content rankings in database                       | true    | true     |
| DATABASE_URL         | Postgres connection Url in the form `postgres://user:password@host:port/database        |         | true     |
| HTTP_API_HOST        | IP address to bind when serving. Set to 127.0.0.1 or localhost for local-only access    | 0.0.0.0 | false    |
| HTTP_API_PORT        | Port to bind when accepting new API client connections.                                 | 5200    | false    |
| PROMETHEUS_ENABLED   | Expose /metrics endpoint to allow prometheus to scrape default and your custom metrics. | true    | false    |
| LOKI_ENABLED         | Stream logs from the application to a loki log aggregation server.                      | false   | false    |
| AUTO_BOOSTER_ENABLED | Automatic bot that periodically purchases boostpow on the content you desire.           | false   | false    |


### Configuration Files

The app loads files from a hierarchy each overriding the previous. First the system level config files are loaded, then user level config file, finally the local config file for development purposes

1) /etc/boostpow/boostpow.json

2) ~/.boostpow/boostpow.json

3) .config/boostpow.json

Config files are JSON objects containing key value pairs where the key is the config variable and the value is the value of the variable. Numbers and booleans will be parsed and made available. Variable names can be either upper or lower case.

```
{
	"database_url": "postgres://postgres:12321423fekrefk@mydb.example.com:5432/boostpow",
	"http_api_port": 3000,
	"loki_enabled": true,
	"loki_url": "https://loki.example.com",
	"prometheus_enabled": false
}
```

## System Events

When using AMQP you may bind the following events as routingkeys to receive delivery of these messages to your application. You may also choose to receive these events via Webhook by configuring the `WEBHOOK_URL` and `WEBHOOKS_ENABLED` variables.

| Event                | Description                                                                             |
|----------------------|-----------------------------------------------------------------------------------------|
| boost.job.recorded   | Every time a new boostpow job is recorded in the local database, regardless of source   |
| boost.job.detected   | When a boostpow job is detected via the Bitcoin p2p network                             |
| boost.job.received   | When a boostpow job is received via the API outside of the Bitcoin p2p network          |
| boost.proof.recorded | Every time a new boostpow proof is recorded in the local database, regardless of source |
| boost.proof.detected | When a boostpow proof is detected via the Bitcoin p2p network                           |
| boost.proof.received | When a boostpow proof is received via the API outside of the Bitcoin p2p network        |


