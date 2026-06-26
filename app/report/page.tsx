import Link from "next/link";
import { loadReport, type MarketReport } from "@/lib/report";

function ReportBlock({ report }: { report: MarketReport }) {
  const generatedAtLabel = new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(report.generatedAt));

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6">
      <h2 className="text-lg font-semibold">{report.title}</h2>
      <p className="mt-1 text-xs text-zinc-400">{generatedAtLabel} 作成</p>
      <div className="mt-4 flex flex-col gap-4">
        {report.sections.map((s) => (
          <div key={s.heading}>
            <h3 className="text-sm font-semibold text-zinc-700">{s.heading}</h3>
            <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-600">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReportPage() {
  const { jp, us } = loadReport();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">市場レポート</h1>
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900 hover:underline">
          ダッシュボードへ
        </Link>
      </div>

      {jp ? (
        <ReportBlock report={jp} />
      ) : (
        <p className="text-sm text-zinc-500">日本市場レポートはまだありません。</p>
      )}

      {us ? (
        <ReportBlock report={us} />
      ) : (
        <p className="text-sm text-zinc-500">米国市場レポートはまだありません。</p>
      )}
    </div>
  );
}
