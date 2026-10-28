#!/usr/bin/env node
// Hook PreToolUse (Bash y PowerShell): bloquea `git commit` en main y `git push` hacia main.
// GitHub ya lo impide en el servidor; este hook avisa al agente antes de equivocarse.
// Salida 2 = bloquear; el mensaje de stderr se devuelve al agente.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const RAMA_PROTEGIDA = "main";

function leerEntrada() {
  try {
    return JSON.parse(readFileSync(0, "utf8"));
  } catch {
    return null;
  }
}

function ramaActual(cwd) {
  try {
    return execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

// Divide un comando compuesto (a && b; c | d) en órdenes simples.
function segmentos(comando) {
  return comando.split(/&&|\|\||[;|\n]/).map((s) => s.trim());
}

// Devuelve el subcomando de git ("commit", "push"…) y sus argumentos, o null.
function subcomandoGit(segmento) {
  const tokens = segmento.split(/\s+/).filter(Boolean);
  const i = tokens.findIndex((t) => /(^|[\\/])git(\.exe)?$/.test(t));
  if (i === -1) return null;
  // Salta opciones globales como `-C ruta` o `-c clave=valor`.
  let j = i + 1;
  while (j < tokens.length && tokens[j].startsWith("-")) {
    j += tokens[j] === "-C" || tokens[j] === "-c" ? 2 : 1;
  }
  if (j >= tokens.length) return null;
  return { nombre: tokens[j], args: tokens.slice(j + 1) };
}

function empujaARamaProtegida(args) {
  const refspec = new RegExp(`(^|[:+])${RAMA_PROTEGIDA}$`);
  return args.some((a) => !a.startsWith("-") && refspec.test(a));
}

function bloquear(motivo) {
  process.stderr.write(
    `${motivo}\nSegún CONTRIBUTING.md, los cambios llegan a ${RAMA_PROTEGIDA} solo mediante Pull Request. ` +
      `Crea una rama <tipo>/<descripcion> desde ${RAMA_PROTEGIDA} actualizada y trabaja en ella.\n`,
  );
  process.exit(2);
}

const entrada = leerEntrada();
const comando = entrada?.tool_input?.command;
if (typeof comando !== "string" || !/\bgit\b/.test(comando)) process.exit(0);

const cwd = entrada.cwd || process.cwd();

for (const segmento of segmentos(comando)) {
  const git = subcomandoGit(segmento);
  if (!git) continue;

  if (git.nombre === "commit" && ramaActual(cwd) === RAMA_PROTEGIDA) {
    bloquear(`Bloqueado: no se hace commit directamente en ${RAMA_PROTEGIDA}.`);
  }

  if (git.nombre === "push") {
    const sinRefspec = git.args.filter((a) => !a.startsWith("-")).length <= 1;
    if (
      empujaARamaProtegida(git.args) ||
      (sinRefspec && ramaActual(cwd) === RAMA_PROTEGIDA)
    ) {
      bloquear(`Bloqueado: no se hace push directamente a ${RAMA_PROTEGIDA}.`);
    }
  }
}

process.exit(0);
