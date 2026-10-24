# Dependencies

Dependency policy: **core workflow dependencies and project-specific dependencies are separate**. Avoid making optional tooling mandatory for every repository.

## Core

| Dependency | Requirement | Purpose |
|---|---|---|
| Git | Required | Branch/status/diff/commit history |
| Node.js | Required for the provided JavaScript CLI template | Run `scripts/pj.mjs`; projects can replace it with a native implementation if preferred |
| Shell | `./pj` needs a compatible shell; Node invocation is a fallback | Convenient launcher |

## Optional graph support

| Dependency | Requirement | Purpose |
|---|---|---|
| Python 3.10+ | Required by current Graphify upstream package | Graph extraction runtime |
| `uv` or `pipx` | Recommended isolated installer | Install Graphify without polluting project Python dependencies |
| `graphifyy` package | Optional unless graph workflow is enabled | Provides `graphify` command |
| AI assistant supporting Graphify skill | Required for assistant-driven `/graphify` operations; varies by assistant | Build/update semantic/document graph and interact with it |
| API key | Optional and backend-dependent | Some semantic extraction paths; code AST extraction can run without an LLM |

Official references: [Graphify installation](https://graphiffy.com/docs/install), [CLI](https://graphiffy.com/docs/cli). Verify upstream requirements when adopting because they can change.

## Project-specific

The integration step must detect and document the actual project tools. Examples:
- JavaScript/TypeScript: Node.js plus the repository's selected npm, pnpm, yarn, or bun lockfile and scripts.
- .NET: compatible .NET SDK and the solution/project's documented restore/build/test commands.
- Python: supported Python version and selected pip/uv/poetry/pipenv tooling.
- Go: compatible Go version.
- Other stacks: use the project's authoritative manifest and CI.

Do not install all examples. Document only the ones required by the target project.

## Chat and GitHub access

The AI assistant and GitHub integration are not dependencies installed by this repository. Chat-driven file changes and tracked handover updates require an assistant with access to the repository and permission to write the selected branch. If not available, generate the proposed content and ask the developer to commit/push it manually.

## Verify dependencies

For the starter CLI, run `node --version` and `git --version`. For Graphify, follow upstream install steps and run `graphify --version`. Then verify the project's own dependency/version checks.
