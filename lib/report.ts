import fs from "node:fs";
import path from "node:path";

export interface ReportSection {
  heading: string;
  body: string;
}

export interface MarketReport {
  title: string;
  generatedAt: string;
  sections: ReportSection[];
}

export interface ReportData {
  jp: MarketReport | null;
  us: MarketReport | null;
}

export function loadReport(): ReportData {
  const filePath = path.join(process.cwd(), "data", "report.json");
  if (!fs.existsSync(filePath)) {
    return { jp: null, us: null };
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as ReportData;
}
