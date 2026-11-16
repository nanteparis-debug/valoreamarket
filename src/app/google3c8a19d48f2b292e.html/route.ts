export const dynamic = "force-static";

export function GET() {
  return new Response("google-site-verification: google3c8a19d48f2b292e.html\n", {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
