import { Card } from "@/components/Card";

export default function LearnLoading() {
  return (
    <main className="min-h-screen bg-[#f7fbfa]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <div className="h-12 w-48 animate-pulse rounded-2xl bg-[#d8f2ef]" />
        <Card className="p-6 sm:p-8">
          <p className="text-sm font-extrabold uppercase tracking-wide text-[#0e9f91]">
            Đang tải tiến độ
          </p>
          <div className="mt-4 h-12 max-w-xl animate-pulse rounded-2xl bg-[#edf7f6]" />
          <div className="mt-3 h-5 max-w-md animate-pulse rounded-2xl bg-[#edf7f6]" />
          <div className="mt-6 h-12 w-40 animate-pulse rounded-2xl bg-[#ffded9]" />
        </Card>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="h-28 animate-pulse rounded-3xl bg-white shadow-sm" />
          <div className="h-28 animate-pulse rounded-3xl bg-white shadow-sm" />
          <div className="h-28 animate-pulse rounded-3xl bg-white shadow-sm" />
        </div>
      </div>
    </main>
  );
}
