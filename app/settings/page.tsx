import { getProviderStatus } from "@/lib/provider-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSetting } from "@/components/settings/theme-setting";
export const dynamic = "force-dynamic";
export default function Page() {
  const s = getProviderStatus();
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="mt-2 text-muted-foreground">
        Secret keys cannot be entered here. Configure them in <code>.env.local</code> for local
        development or Vercel Environment Variables for deployment.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Setting
          title="GitHub"
          value={s.github.status}
          detail={
            s.github.authenticated
              ? "Authenticated API access"
              : "Unauthenticated public access with lower rate limits"
          }
        />
        <Setting title="YouTube" value={s.youtube.status} />
        <Setting title={`Web search · ${s.web.provider}`} value={s.web.status} />
        <Setting
          title={`AI · ${s.ai.provider}`}
          value={s.ai.status}
          detail="Local keyword scoring remains available as fallback."
        />
        <Setting title="Demo mode" value={s.demoMode ? "Configured" : "Not configured"} />
        <Setting
          title="Cache"
          value={s.cache.status}
          detail={`${s.cache.durationSeconds} second duration`}
        />
        <Card>
          <CardHeader>
            <CardTitle>Theme setting</CardTitle>
          </CardHeader>
          <CardContent>
            <ThemeSetting />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
function Setting({ title, value, detail }: { title: string; value: string; detail?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-medium">{value}</p>
        {detail && <p className="mt-1 text-sm text-muted-foreground">{detail}</p>}
      </CardContent>
    </Card>
  );
}
