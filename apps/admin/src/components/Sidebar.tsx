import Link from "next/link";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/courses", label: "Courses" },
  { href: "/review", label: "Review & Publish" },
  { href: "/assets", label: "Assets" },
  { href: "/ai-generator", label: "AI Generator" },
  { href: "/analytics", label: "Analytics" },
  { href: "/users", label: "Users" },
  { href: "/subscriptions", label: "Subscriptions" },
];

export function Sidebar() {
  return (
    <nav className="w-56 shrink-0 border-r border-neutral-200 bg-white h-dvh sticky top-0 flex flex-col">
      <div className="px-5 py-5 border-b border-neutral-200">
        <div className="font-bold text-neutral-900">بصيرة CMS</div>
        <div className="text-xs text-neutral-500">Basirah content admin</div>
      </div>
      <div className="flex-1 py-3">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-5 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
