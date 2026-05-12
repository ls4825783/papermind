export async function POST() {
  return new Response(JSON.stringify({ error: "Use client-side Gemini instead." }), { status: 410 });
}
