"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatJpy } from "@/lib/format";

const COLORS = ["#2563eb", "#16a34a", "#d97706", "#dc2626", "#7c3aed"];

export interface AllocationDatum {
  name: string;
  value: number;
}

export default function AllocationChart({ data }: { data: AllocationDatum[] }) {
  const hasData = data.some((d) => d.value > 0);

  if (!hasData) {
    return (
      <div className="flex h-[360px] items-center justify-center text-sm text-zinc-500">
        表示できるデータがありません
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={360}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={85}
          label={({ name, value, percent }) =>
            `${name} ${formatJpy(typeof value === "number" ? value : Number(value))} (${((percent ?? 0) * 100).toFixed(0)}%)`
          }
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatJpy(typeof value === "number" ? value : Number(value))} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
