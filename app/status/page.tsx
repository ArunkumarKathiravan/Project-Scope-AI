import { getProviderStatus } from "@/lib/provider-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export const dynamic = "force-dynamic";
export default function Page() {
  const status = getProviderStatus();
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">Provider status</h1>
      <p className="mt-2 text-muted-foreground">
        Lightweight configuration checks only. This page does not spend provider search quota.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {Object.entries(status).map(([name, value]) => (
          <Card key={name}>
            <CardHeader>
              <CardTitle className="capitalize">{name}</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-auto whitespace-pre-wrap text-sm text-muted-foreground">
                {JSON.stringify(value, null, 2)}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
