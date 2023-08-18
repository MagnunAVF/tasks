# Tasks API
API To save the tasks in a database.

## Prerequisites
* Rust
* libsqlite3

## Setup
Run in terminal:
```
cp .env.sample .env
cargo install diesel_cli --no-default-features --features sqlite
```

## Running in localhost
To run the application in localhost, run in terminal:
```
cargo run
```

## User
Local user credentials (Basic Auth):
* username: `ximira`
* password: `gelo`
Use this Auth header in request:
```
"Authorization": "Basic eGltaXJhOmdlbG8K"
```