// Reads the local asset-tracker / family-tracker SQLite databases directly
// and writes an aggregate-only snapshot.json (no tickers, no broker names)
// for combined-dashboard to display. Run manually whenever the numbers
// should be refreshed; redeploy afterwards to publish the update.
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

// Family individual-stock holdings aren't fully tracked in family-tracker yet;
// per the user this is a placeholder target figure, not derived from live data.
const FAMILY_INDIVIDUAL_STOCKS_OVERRIDE_JPY = 3_000_000;

function sumHoldingsJpy(dbPath, { purpose, assetTypeFilter }) {
  if (!fs.existsSync(dbPath)) {
    console.warn(`warning: ${dbPath} not found, treating as 0`);
    return 0;
  }
  const db = new DatabaseSync(dbPath, { readOnly: true });
  try {
    const holdings = db.prepare("SELECT * FROM holdings WHERE purpose = ?").all(purpose);
    const priceCache = new Map(
      db
        .prepare("SELECT * FROM price_cache")
        .all()
        .map((row) => [row.ticker, row])
    );
    const usdJpyRate = priceCache.get("JPY=X")?.price ?? null;

    let total = 0;
    for (const h of holdings) {
      if (!assetTypeFilter(h.asset_type)) continue;
      const fxRate = h.currency === "USD" ? usdJpyRate : 1;
      if (fxRate == null) continue;
      const price = h.manual_price ?? priceCache.get(h.ticker)?.price ?? null;
      if (price == null) continue;
      total += h.quantity * price * fxRate;
    }
    return total;
  } finally {
    db.close();
  }
}

const personalDb = path.join(ROOT, "asset-tracker", "data", "portfolio.db");
const familyDb = path.join(ROOT, "family-tracker", "data", "portfolio.db");

const personalEducationFund = sumHoldingsJpy(personalDb, {
  purpose: "教育資金",
  assetTypeFilter: () => true,
});
const personalInvestmentTrust = sumHoldingsJpy(personalDb, {
  purpose: "教育資金",
  assetTypeFilter: (t) => t === "fund",
});
const personalLivingExpenses = sumHoldingsJpy(personalDb, {
  purpose: "生活費",
  assetTypeFilter: () => true,
});
const familyInvestmentTrust = sumHoldingsJpy(familyDb, {
  purpose: "教育資金",
  assetTypeFilter: (t) => t === "fund",
});

const snapshot = {
  categories: [
    { label: "中長期", valueJpy: Math.round(personalEducationFund - personalInvestmentTrust) },
    { label: "生活費(スイング)", valueJpy: Math.round(personalLivingExpenses) },
    { label: "投資信託(私)", valueJpy: Math.round(personalInvestmentTrust) },
    { label: "投資信託(家族)", valueJpy: Math.round(familyInvestmentTrust) },
    { label: "個別株(家族)", valueJpy: FAMILY_INDIVIDUAL_STOCKS_OVERRIDE_JPY },
  ],
  updatedAt: new Date().toISOString(),
};

const outPath = path.join(__dirname, "..", "data", "snapshot.json");
fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2) + "\n");
console.log("snapshot written:", outPath);
console.log(JSON.stringify(snapshot, null, 2));
