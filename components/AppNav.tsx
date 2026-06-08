import type { NavItem } from "@/types/learning";

type AppNavProps = {
  items: NavItem[];
};

export function AppNav({ items }: AppNavProps) {
  return (
    <nav aria-label="Main navigation" className="overflow-x-auto">
      <ul className="flex min-w-max items-center gap-2 rounded-2xl bg-white/80 p-1 shadow-sm ring-1 ring-[#dcebea] backdrop-blur">
        {items.map((item) => (
          <li key={item.href}>
            <a
              className={`block rounded-xl px-3 py-2 text-sm font-bold transition sm:px-4 ${
                item.isActive
                  ? "bg-[#12333f] text-white"
                  : "text-[#47626c] hover:bg-[#edf7f6] hover:text-[#12333f]"
              }`}
              href={item.href}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

