FROM rust:1.76-slim-bookworm AS build

RUN apt-get update && \
    apt-get install -y pkg-config libssl-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /rust

ENV RUSTFLAGS="-C target-feature=+avx2 -C target-cpu=haswell"

COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml
COPY ./prisma-cli/Cargo.toml ./prisma-cli/Cargo.toml
COPY ./.cargo ./.cargo
COPY ./prisma-cli ./prisma-cli
COPY ./prisma ./prisma
COPY ./src ./src


RUN RUSTFLAGS="-C target-feature=+avx2 -C target-cpu=haswell" cargo run -p prisma-cli --release -- generate
RUN RUSTFLAGS="-C target-feature=+avx2 -C target-cpu=haswell" cargo build --release 

FROM rust:1.76-slim-bookworm AS runtime

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libssl-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /rust/target/release/refeed-backend .

ENTRYPOINT ["/app/refeed-backend"]
