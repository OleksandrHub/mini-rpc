import "dotenv/config";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { tmpdir } from "node:os";

const AUTH_TOKEN = process.env.MINI_RPC_AUTH_TOKEN;

export function ensureTypesCompiled(apiSourcePath: string, typesPath: string) {
  console.log("Compiling types...");

  const tempDir = mkdtempSync(join(tmpdir(), "mini-rpc-types-"));
  try {
    execFileSync(
      "npx",
      [
        "tsc",
        apiSourcePath,
        "--declaration",
        "--emitDeclarationOnly",
        "--module",
        "nodenext",
        "--moduleResolution",
        "nodenext",
        "--target",
        "esnext",
        "--outDir",
        tempDir,
        "--rootDir",
        dirname(apiSourcePath),
        "--ignoreConfig",
      ],
      { stdio: "inherit" },
    );

    const declarationName = basename(apiSourcePath).replace(/\.tsx?$/, ".d.ts");
    const declarationContent = readFileSync(
      join(tempDir, declarationName),
      "utf-8",
    );
    writeFileSync(typesPath, declarationContent, "utf-8");

    console.log("Types compiled successfully.");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error compiling types.";
    console.warn(message);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }

  if (!AUTH_TOKEN) {
    console.warn(
      "Warning: MINI_RPC_AUTH_TOKEN is not set. The types API will be unprotected.",
    );
  } else {
    console.log("Types API is protected with authentication.");
  }
}
