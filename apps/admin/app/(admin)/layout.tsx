import { Sidebar } from "../../src/components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-neutral-50">
      <Sidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
