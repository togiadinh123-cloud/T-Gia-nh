import { homeCopy } from "@/lib/copy";

export function AppFooter() {
  return (
    <footer className="border-t border-[#dcebea] py-8">
      <div className="flex flex-col gap-4 text-sm text-[#5c747b] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-black text-[#12333f]">{homeCopy.appName}</p>
          <p className="mt-1">{homeCopy.footerLine}</p>
        </div>
        <p>Học ít mỗi ngày, tiến bộ đều mỗi tuần.</p>
      </div>
    </footer>
  );
}
