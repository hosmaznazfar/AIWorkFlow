#!/usr/bin/env node
/**
 * Portable starter CLI for a project-local ./pj command.
 * Customize detected checks and Graphify integration for the target project.
 * Intentionally performs no staging, commits, pushes, merges, deployment, or migrations.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const configPath = resolve(root, "project-workflow.json");
const config = existsSync(configPath) ? JSON.parse(readFileSync(configPath, "utf8")) : {};
const args = process.argv.slice(2);
const [group = "help", sub = "", ...rest] = args;

function run(command, commandArgs = [], options = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    stdio: "inherit",
    shell: false,
    ...options
  });
  if (result.error) {
    console.error(`[pj] Could not run ${command}: ${result.error.message}`);
    return 127;
  }
  return result.status ?? 1;
}
function git(...gitArgs) {
  try { return execFileSync("git", gitArgs, { cwd: root, encoding: "utf8" }).trim(); }
  catch { return null; }
}
function help() {
  console.log(`Project CLI
Usage:
  ./pj help
  ./pj status
  ./pj check frontend|backend|all
  ./pj graph refresh|review|query "question"|path "source" "target"|explain "symbol"
  ./pj traces update
  ./pj sync
  ./pj handover

Project: ${config.projectName || "(configure project-workflow.json)"}
Local only: no commit, push, merge, deployment, or database migrations.
Configure checks and graph support in project-workflow.json and scripts/pj.mjs.`);
}
function status() {
  console.log(`Branch: ${git("branch", "--show-current") || "unknown"}`);
  console.log(`HEAD: ${git("rev-parse", "--short", "HEAD") || "unknown"}`);
  console.log("Worktree:");
  console.log(git("status", "--short") || "(clean or Git unavailable)");
  if (!git("rev-parse", "--is-inside-work-tree")) return 1;
  return 0;
}
function check(target) {
  const checks = config.checks?.[target];
  if (!Array.isArray(checks) || checks.length === 0) {
    console.log(`[pj check] No checks configured for '${target}'. Edit project-workflow.json after inspecting this project's real scripts.`);
    return 2;
  }
  let failed = false;
  for (const item of checks) {
    if (!item || typeof item.command !== "string" || !Array.isArray(item.args)) {
      console.error("[pj check] Invalid check entry; expected { command, args, name? }.");
      failed = true; continue;
    }
    console.log(`\n[pj check] ${item.name || item.command}`);
    if (run(item.command, item.args) !== 0) failed = true;
  }
  return failed ? 1 : 0;
}
function graph(action, params) {
  if (!config.graph?.enabled) {
    console.error("[pj graph] Graphify is disabled. Enable it in project-workflow.json after installing/configuring Graphify.");
    return 2;
  }
  const commands = {
    refresh: [".", "--update"],
    review: null,
    query: ["query", params.join(" ")],
    path: ["path", params[0] || "", params[1] || ""],
    explain: ["explain", params.join(" ")]
  };
  const mapped = commands[action];
  if (action === "review") {
    console.error("[pj graph review] Configure project-specific review checks before enabling this command.");
    return 2;
  }
  if (!mapped) return 2;
  return run(config.graph.command || "graphify", mapped);
}
function traces(action) {
  if (action !== "update") return 2;
  console.error("[pj traces] Configure trace regeneration for this project's actual graph/query format before enabling it.");
  return 2;
}
function sync() {
  let failed = false;
  console.log("[pj sync] Refresh graph, regenerate traces, run checks/review and inspect diff.");
  if (config.graph?.enabled && graph("refresh", []) !== 0) failed = true;
  if (config.graph?.enabled && traces("update") !== 0) failed = true;
  if (Array.isArray(config.checks?.all) && config.checks.all.length && check("all") !== 0) failed = true;
  if (status() !== 0) failed = true;
  const diff = git("diff", "--check");
  if (diff === null) failed = true;
  else if (diff) { console.error(diff); failed = true; }
  console.log(failed ? "[pj sync] Finished with failures; inspect output." : "[pj sync] Completed. Review the full diff before staging.");
  return failed ? 1 : 0;
}
function handover() {
  const path = config.handover || "docs/handover/current.md";
  if (!existsSync(resolve(root, path))) {
    console.error(`[pj handover] Missing tracked handover: ${path}`);
    return 2;
  }
  console.log(`Handover file: ${path}`);
  console.log("Update and commit this tracked file through your approved GitHub workflow. This CLI does not write to GitHub.");
  return 0;
}
let code = 0;
if (group === "help" || group === "--help" || group === "-h") help();
else if (group === "status") code = status();
else if (group === "check") code = check(sub);
else if (group === "graph") code = graph(sub, rest);
else if (group === "traces") code = traces(sub);
else if (group === "sync") code = sync();
else if (group === "handover") code = handover();
else { console.error(`Unknown command: ${group}`); help(); code = 2; }
process.exitCode = code;
