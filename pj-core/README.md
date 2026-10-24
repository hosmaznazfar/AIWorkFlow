# Rust pj core

The root ./pj launcher uses a prebuilt release binary when present, otherwise runs it with Cargo.

Build and test:
```sh
cargo fmt --manifest-path pj-core/Cargo.toml
cargo test --manifest-path pj-core/Cargo.toml
cargo build --release --manifest-path pj-core/Cargo.toml
```

Commands:
- pj init: detect known manifests, initialize .pj/workflow.toml, and update only the managed README section.
- pj doctor: report detected manifests and installed tools.
- pj check --add-command "npm run test": append a check without executing it.
- pj check --list: list configured checks.
- pj check --remove NAME: remove a check by exact name.
- pj check --dry-run: print commands in declaration order.
- pj check: execute checks in order with argument arrays and timeouts.
- pj workflow validate: validate TOML and working directories.

--add-command rejects shell operators. For pipelines, configure an explicit reviewed shell invocation in TOML. Review all commands before execution.
Graphify's package is graphifyy, installed with uv tool install graphifyy. Assistant registration and graph generation are separate actions.
