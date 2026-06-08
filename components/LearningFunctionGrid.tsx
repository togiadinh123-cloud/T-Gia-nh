import { CustomImage as Image } from "@/components/CustomImage";
import Link from "next/link";

type LearningFunctionGridProps = {
  totalLessons: number;
  totalWords: number;
};

const functionCards = [
  {
    title: "Từ vựng B1",
    description: "Xem ảnh, nghe phát âm, đọc nghĩa và ví dụ ngắn.",
    href: "/practice?mode=vocab",
    imageSrc: "/vocab/opportunity.svg",
    accent: "bg-[#d8f2ef]",
    ink: "text-[#0c756d]",
    action: "Học từ",
  },
  {
    title: "Đoán hình",
    description: "Nhìn ảnh minh họa rồi chọn đúng từ tiếng Anh.",
    href: "/practice?mode=image",
    imageSrc: "/vocab/environment.svg",
    accent: "bg-[#fff1ba]",
    ink: "text-[#876100]",
    action: "Đoán ngay",
  },
  {
    title: "Nối từ",
    description: "Ghép từ tiếng Anh với nghĩa tiếng Việt tương ứng.",
    href: "/practice?mode=match",
    imageSrc: "/vocab/agreement.svg",
    accent: "bg-[#ffe0db]",
    ink: "text-[#b74438]",
    action: "Nối nghĩa",
  },
  {
    title: "Nghe & ngữ pháp",
    description: "Nghe câu B1, chọn nghĩa và xem mẫu câu.",
    href: "/practice?mode=listening",
    imageSrc: "/vocab/presentation.svg",
    accent: "bg-[#e6ebff]",
    ink: "text-[#4152a5]",
    action: "Bấm nghe",
  },
  {
    title: "Mẫu câu B1",
    description: "Luyện khung câu để nói và viết tự nhiên hơn.",
    href: "/practice?mode=patterns",
    imageSrc: "/vocab/research.svg",
    accent: "bg-[#eaf7e9]",
    ink: "text-[#2f7a3c]",
    action: "Luyện câu",
  },
] as const;

export function LearningFunctionGrid({
  totalLessons,
  totalWords,
}: LearningFunctionGridProps) {
  return (
    <section className="space-y-5" id="learning-functions">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-[#ff6f61]">
            Chọn cách học
          </p>
          <h2 className="mt-2 max-w-3xl text-3xl font-black leading-tight text-[#12333f] sm:text-4xl">
            Học theo từng trò nhỏ, vui hơn và dễ bấm hơn.
          </h2>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#5c747b] ring-1 ring-[#dcebea]">
          <span className="grid size-8 place-items-center rounded-xl bg-[#12333f] text-white">
            B1
          </span>
          {totalWords} từ / {totalLessons} bài
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {functionCards.map((card, index) => (
          <Link
            className={`group flex min-h-[15rem] flex-col overflow-hidden rounded-[2rem] border border-[#dcebea] bg-white p-4 shadow-[0_16px_42px_rgba(18,51,63,0.07)] transition duration-200 hover:-translate-y-1 hover:border-[#9fc9c6] hover:shadow-[0_22px_56px_rgba(18,51,63,0.12)] ${
              index < 2 ? "lg:col-span-3" : "lg:col-span-2"
            }`}
            href={card.href}
            key={card.title}
          >
            <div
              className={`grid aspect-[1.55] place-items-center rounded-[1.55rem] ${card.accent}`}
            >
              <Image
                alt={`Minh họa ${card.title}`}
                className="h-auto w-28 transition duration-300 group-hover:scale-110 sm:w-32"
                height={176}
                src={card.imageSrc}
                width={176}
              />
            </div>
            <div className="mt-4 flex flex-1 flex-col">
              <h3 className="text-2xl font-black leading-tight text-[#12333f]">
                {card.title}
              </h3>
              <p className="mt-2 text-sm font-bold leading-6 text-[#5c747b]">
                {card.description}
              </p>
              <span
                className={`mt-auto inline-flex w-fit items-center rounded-2xl px-4 py-3 text-sm font-black ${card.accent} ${card.ink}`}
              >
                {card.action}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
