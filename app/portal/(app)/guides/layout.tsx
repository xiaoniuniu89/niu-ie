import { GuidesNav } from "@/components/portal/GuidesNav";

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-6 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10">
      <aside>
        <GuidesNav />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
