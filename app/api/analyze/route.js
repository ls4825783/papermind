// This route is no longer used — Gemini is called client-side to avoid Vercel 4.5MB limit
export async function POST() {
  return new Response(JSON.stringify({ error: "Use client-side Gemini instead." }), { status: 410 });
}
