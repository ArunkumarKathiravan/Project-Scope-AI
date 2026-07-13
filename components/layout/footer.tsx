import Link from "next/link";
export function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 text-sm text-muted-foreground md:grid-cols-2">
        <p>
          ProjectScope AI helps compare public project information. It does not establish novelty,
          ownership or patentability.
        </p>
        <div className="flex gap-4 md:justify-end">
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
