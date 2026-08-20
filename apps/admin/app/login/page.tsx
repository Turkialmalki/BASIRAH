import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <main style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF6EF" }}>
      <form
        action={login}
        style={{
          background: "#FFFFFF",
          border: "1px solid #E7DFD1",
          borderRadius: 16,
          padding: 32,
          width: 320,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 20 }}>Basirah CMS</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#4A443D" }}>Admin access code required.</p>
        </div>
        <input type="hidden" name="next" value={params.next ?? "/dashboard"} />
        <input
          name="code"
          type="password"
          placeholder="Access code"
          autoFocus
          style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #E7DFD1", fontSize: 14 }}
        />
        {params.error && <p style={{ color: "#B34632", fontSize: 13, margin: 0 }}>Wrong code — try again.</p>}
        <button
          type="submit"
          style={{ padding: "10px 12px", borderRadius: 8, border: "none", background: "#C08A3E", color: "white", fontSize: 14, cursor: "pointer" }}
        >
          Continue
        </button>
      </form>
    </main>
  );
}
