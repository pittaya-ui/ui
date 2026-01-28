import { defineConfig } from "tsup";
import { copyFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  shims: false,
  onSuccess: async () => {
    await mkdir(join(__dirname, "dist/assets"), { recursive: true });
    await copyFile(
      join(__dirname, "src/assets/pittaya-logo.png"),
      join(__dirname, "dist/assets/pittaya-logo.png")
    );
  },
});

