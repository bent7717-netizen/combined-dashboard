import Link from "next/link";
import AllocationChart from "@/components/AllocationChart";
import LogoutButton from "@/components/LogoutButton";
import { formatJpy } from "@/lib/format";
import { loadSnapshot } from "@/lib/snapshot";

export default function DashboardPage() {
  const snapshot = loadSnapshot();
  const grandTotal = snapshot.categories.reduce((sum, c) => sum + c.valueJpy, 0);

  const updatedAtLabel = snapshot.updatedAt
    ? new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(snapshot.updatedAt)
      )
    : "未更新";

  const chartData = snapshot.categories.map((c) => ({ name: c.label, value: c.valueJpy }));

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">資産ダッシュボード</h1>
        <LogoutButton />
      </div>

      <Link
        href="/report"
        className="rounded-lg border border-zinc-200 bg-white p-4 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50"
      >
        📈 市場レポートを見る
      </Link>

      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        <div className="text-sm text-zinc-500">合計</div>
        <div className="mt-1 text-4xl font-bold">{formatJpy(grandTotal)}</div>
        <div className="mt-1 text-xs text-zinc-400">最終更新: {updatedAtLabel}</div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        <AllocationChart data={chartData} />
      </div>

      <div className="flex flex-col gap-3">
        {snapshot.categories.map((c) => (
          <div key={c.label} className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="text-sm text-zinc-500">{c.label}</div>
            <div className="mt-1 text-2xl font-bold">{formatJpy(c.valueJpy)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
