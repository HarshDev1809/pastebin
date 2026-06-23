import { fetchSnippet, updateView, softDeleteSnippet, restoreSnippet, permanentDeleteSnippet } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const testTime = req.headers.get("x-test-now-ms");
    if (!id)
      return Response.json({ error: "Invalid id passed" }, { status: 404 });
    const data = await fetchSnippet(id);
    if(!data)
        return Response.json({ error: "Invalid id passed" }, { status: 404 });
    const { maxViews: max_views, content, heading, language, remainingViews: remaining_views, expiresAt: expires_at, deletedAt: deleted_at } = data;

    if (deleted_at !== null) {
      return Response.json({ error: "Snippet not found" }, { status: 404 });
    }

    let currentTime = Date.now();

    if (process.env.TEST_MODE === "1" && testTime) {
      currentTime = Number(testTime);
    }

    if (expires_at !== null)
      if (Number(currentTime) >= Number(expires_at)) {
        return Response.json(
          { error: "Snippet has been expired." },
          { status: 404 }
        );
      }

    if (remaining_views !== null) {
      if (Number(remaining_views) === 0)
        return Response.json(
          { error: "Maximum Views reached for this snippet" },
          { status: 404 }
        );

      await updateView(id, Number(remaining_views - 1));
    }

    return Response.json(
      {
        heading,
        content,
        language,
        remaining_views,
        expires_at: expires_at === null ? null : new Date(Number(expires_at)).toISOString(),
        expires_at_epoch: expires_at,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) return Response.json({ error: "Invalid id passed" }, { status: 400 });

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const snippet = await fetchSnippet(id);
    if (!snippet) return Response.json({ error: "Snippet not found" }, { status: 404 });
    if (snippet.userId !== session.user.id) return Response.json({ error: "Unauthorized" }, { status: 403 });

    await softDeleteSnippet(id, session.user.id);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) return Response.json({ error: "Invalid id passed" }, { status: 400 });

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    if (body.action !== "restore") {
        return Response.json({ error: "Invalid action" }, { status: 400 });
    }

    const snippet = await fetchSnippet(id);
    if (!snippet) return Response.json({ error: "Snippet not found" }, { status: 404 });
    if (snippet.userId !== session.user.id) return Response.json({ error: "Unauthorized" }, { status: 403 });

    await restoreSnippet(id, session.user.id);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
