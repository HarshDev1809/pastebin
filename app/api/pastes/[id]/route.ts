import { fetchPaste, updateView } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const testTime = req.headers.get("x-test-now-ms");
    if (!id)
      return Response.json({ error: "Invalid id passed" }, { status: 404 });
    const data = await fetchPaste(id);
    if(!data)
        return Response.json({ error: "Invalid id passed" }, { status: 404 });
    const { maxViews: max_views, content, heading, remainingViews: remaining_views, expiresAt: expires_at } = data;

    let currentTime = Date.now();

    if (process.env.TEST_MODE === "1" && testTime) {
      currentTime = Number(testTime);
    }

    if (expires_at !== null)
      if (Number(currentTime) >= Number(expires_at)) {
        return Response.json(
          { error: "Paste has been expired." },
          { status: 404 }
        );
      }

    if (remaining_views !== null) {
      if (Number(remaining_views) === 0)
        return Response.json(
          { error: "Maximum Views reached for this paste" },
          { status: 404 }
        );

      await updateView(id, Number(remaining_views - 1));
    }

    return Response.json(
      {
        heading,
        content,
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
