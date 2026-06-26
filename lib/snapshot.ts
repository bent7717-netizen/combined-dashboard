import fs from "node:fs";
import path from "node:path";

export interface SnapshotCategory {
  label: string;
  valueJpy: number;
}

export interface Snapshot {
  categories: SnapshotCategory[];
  updatedAt: string | null;
}

export function loadSnapshot(): Snapshot {
  const filePath = path.join(process.cwd(), "data", "snapshot.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as Snapshot;
}
