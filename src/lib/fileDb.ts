import { promises as fs } from "fs";
import path from "path";

export async function ensureJsonFile<T>(
  filePath: string,
  seed: T
): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(seed, null, 2), {
      encoding: "utf-8",
    });
  }
}

export async function readJsonFile<T>(
  filePath: string,
  seed: T
): Promise<unknown> {
  await ensureJsonFile(filePath, seed);
  const raw = await fs.readFile(filePath, { encoding: "utf-8" });
  return JSON.parse(raw);
}

export async function writeJsonFile<T>(
  filePath: string,
  data: T
): Promise<void> {
  await ensureJsonFile(filePath, data);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), {
    encoding: "utf-8",
  });
}
