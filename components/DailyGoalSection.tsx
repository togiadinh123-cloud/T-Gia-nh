import { dailyGoal, stats } from "@/data/mock/home";
import { homeCopy } from "@/lib/copy";
import { Card } from "./Card";
import { ProgressBar } from "./ProgressBar";

export function DailyGoalSection() {
  const progress = Math.round((dailyGoal.completed / dailyGoal.target) * 100);

  return (
    <section
      className="rounded-[2rem] bg-[#12333f] p-4 text-white sm:p-6 lg:p-8"
      id="goal"
    >
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#ffd166]">
            {homeCopy.goalTitle}
          </p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
            {homeCopy.goalDescription}
          </h2>
        </div>

        <Card className="p-5 text-[#12333f]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#5c747b]">
                {dailyGoal.label}
              </p>
              <p className="mt-1 text-4xl font-black">
                {dailyGoal.completed}/{dailyGoal.target}
              </p>
            </div>
            <div className="grid size-16 place-items-center rounded-3xl bg-[#ffd166] text-2xl font-black text-[#7c5700]">
              {progress}%
            </div>
          </div>
          <div className="mt-5">
            <ProgressBar value={progress} label={homeCopy.progressLabel} />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div className="rounded-2xl bg-[#f2fbfa] p-3" key={stat.label}>
                <p className="text-xs font-bold text-[#5c747b]">
                  {stat.label}
                </p>
                <p className="mt-1 text-xl font-black text-[#12333f]">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-[#6c8288]">{stat.helper}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

