import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        The requested ProjectScope AI page does not exist.
      </p>
      <Link href="/">
        <Button className="mt-6">Return home</Button>
      </Link>
    </div>
  );
}
