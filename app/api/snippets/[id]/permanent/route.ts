import { fetchSnippet, permanentDeleteSnippet } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) return Response.json({ error: "Invalid id passed" }, { status: 400 });

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const snippet = await fetchSnippet(id);
    if (!snippet) return Response.json({ error: "Snippet not found" }, { status: 404 });
    if (snippet.userId !== session.user.id) return Response.json({ error: "Unauthorized" }, { status: 403 });

    await permanentDeleteSnippet(id, session.user.id);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
