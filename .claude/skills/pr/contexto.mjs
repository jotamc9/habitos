#!/usr/bin/env node
// Reúne el estado de la rama actual para preparar un Pull Request hacia main.
// Uso: node .claude/skills/pr/contexto.mjs
// Imprime un informe y termina con código 1 si hay algún bloqueo.

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

const BASE = "main";
const TIPOS = ["feat", "fix", "refactor", "docs", "test", "style", "chore", "ci"];
const GH_WINDOWS = "C:/Program Files/GitHub CLI/gh.exe";

function git(...args) {
  return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
}

function intentar(fn) {
  try {
    return fn();
  } catch {
    return null;
  }
}

function rutaGh() {
  if (intentar(() => execFileSync("gh", ["--version"], { stdio: "ignore" })) !== null) return "gh";
  return existsSync(GH_WINDOWS) ? GH_WINDOWS : null;
}

const bloqueos = [];
const avisos = [];

intentar(() => git("fetch", "--quiet", "origin", BASE));

const rama = git("rev-parse", "--abbrev-ref", "HEAD");
const tipoRama = rama.split("/")[0];
if (rama === BASE) bloqueos.push(`Estás en ${BASE}. Crea una rama <tipo>/<descripcion> primero.`);
else if (!/^[a-z]+\/[a-z0-9-]+$/.test(rama) || !TIPOS.includes(tipoRama)) {
  avisos.push(`La rama "${rama}" no sigue <tipo>/<descripcion> con tipos ${TIPOS.join(", ")}.`);
}

const sinConfirmar = git("status", "--porcelain");
if (sinConfirmar) bloqueos.push("Hay cambios sin commit:\n" + sinConfirmar);

const commits = git("log", "--format=%s", `origin/${BASE}..HEAD`).split("\n").filter(Boolean);
if (commits.length === 0) bloqueos.push(`La rama no tiene commits nuevos respecto a origin/${BASE}.`);

const atrasados = Number(git("rev-list", "--count", `HEAD..origin/${BASE}`));
if (atrasados > 0) {
  avisos.push(`La rama va ${atrasados} commit(s) por detrás de origin/${BASE}. Conviene actualizarla antes del PR.`);
}

const upstream = intentar(() => git("rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"));
const gh = rutaGh();
if (!gh) bloqueos.push("No se encuentra GitHub CLI (gh).");
const prExistente = gh
  ? intentar(() =>
      execFileSync(gh, ["pr", "view", rama, "--json", "url,state", "--jq", '.url + " (" + .state + ")"'], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim(),
    )
  : null;
if (prExistente) avisos.push(`Ya existe un PR para esta rama: ${prExistente}`);

const estadistica = git("diff", "--stat", `origin/${BASE}...HEAD`);

console.log(`Rama: ${rama} (tipo: ${tipoRama})`);
console.log(`Base: origin/${BASE}`);
console.log(`Rama remota: ${upstream ?? "no subida todavía"}`);
console.log(`GitHub CLI: ${gh ?? "no encontrado"}`);
console.log(`\nCommits (${commits.length}):`);
for (const c of commits) console.log(`  - ${c}`);
console.log(`\nFicheros:\n${estadistica || "  (sin cambios)"}`);
if (avisos.length) console.log(`\nAVISOS:\n${avisos.map((a) => `  - ${a}`).join("\n")}`);
if (bloqueos.length) {
  console.log(`\nBLOQUEOS:\n${bloqueos.map((b) => `  - ${b}`).join("\n")}`);
  process.exit(1);
}
