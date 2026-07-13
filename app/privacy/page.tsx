export default function Page() {
  return (
    <article className="prose prose-slate mx-auto max-w-3xl px-4 py-12 dark:prose-invert">
      <h1>Privacy</h1>
      <p>
        The first version stores search history and saved results in your browser local storage.
        Search input is sent to enabled third-party providers through server-side routes. Review
        each provider’s privacy terms before enabling it.
      </p>
      <p>ProjectScope AI does not ask users to enter secret API keys in the browser.</p>
    </article>
  );
}
