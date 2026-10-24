# Dependencies

Dependency policy: **core workflow dependencies and project-specific dependencies are separate**. Avoid making optional tooling mandatory for every repository.

## Core CLI (target architecture)

| Dependency | Requirement | Purpose |
|---|---|---|
| Git | Required for repository-aware status/diff/history commands | Repository state |
| Rust toolchain | Required only when building the pj core from source | Compile the Rust CLI |
| Prebuilt pj binary | Preferred installation when a trusted release is available | Avoid requiring Node.js/Python just for workflow commands |
| POSIX shell | Required for the small Unix ./pj launcher; usable from Bash or Fish | Invoke the binary |
| PowerShell launcher | Windows alternative | Invoke the binary on Windows |
| TOML configuration | Read by the pj core | Project and action declarations |

The current MJS CLI and setup script are prototypes and require Node.js. They are not the target dependency model. Do not claim a Rust binary or installer is available until it has been implemented, packaged, and tested.

## Optional graph support

| Dependency | Requirement | Purpose |
|---|---|---|
| Python 3.10+ | Required by current Graphify upstream package | Graph extraction runtime |
| uv or pipx | Recommended isolated installer | Install Graphify without polluting project Python dependencies |
| graphifyy package | Optional unless graph workflow is enabled | Provides graphify command |
| AI assistant supporting Graphify skill | Required for assistant-driven graph operations; varies by assistant | Build/update semantic/document graph and interact with it |
| API key | Optional and backend-dependent | Some semantic extraction paths; code AST extraction can run without an LLM |

Official references: [Graphify installation](https://graphiffy.com/docs/install), [CLI](https://graphiffy.com/docs/cli). Verify upstream requirements when adopting because they can change.

## Project-specific action runtimes

Action runtimes are installed only when the project uses an action that needs them. Examples:
- JavaScript/TypeScript actions: Node.js and the project's selected npm, pnpm, yarn, or bun lockfile/scripts.
- .NET actions: compatible .NET SDK.
- Python actions: supported Python version and selected pip/uv/poetry/pipenv tooling.
- Rust actions: compatible Rust toolchain and Cargo.
- Go actions: compatible Go version.
- Shell actions: the specific shell named by the action (Bash and Fish are not interchangeable script languages).
- Other stacks: follow the authoritative manifest and CI.

Do not install all examples. Document only the runtimes and packages required by the target project's configured actions. Adding an action must update the target README with the actual prerequisite, installation, invocation, and validation steps.

## Chat and GitHub access

The AI assistant and GitHub integration are not dependencies installed by this repository. Chat-driven file changes and tracked handover updates require an assistant with access to the repository and permission to write the selected branch. If not available, generate the proposed content and ask the developer to commit/push it manually.

## Verify dependencies

For the current MJS prototype only, run node --version and git --version. For the target Rust CLI, verify pj --version and pj doctor once implemented. For Graphify, follow upstream install steps and run graphify --version. Then verify the project's own dependency/version checks.
