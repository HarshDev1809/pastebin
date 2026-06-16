import { fetchPaste, updateView } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const testTime = req.headers.get("x-test-now-ms");
    if (!id)
      return Response.json({ error: "Invalid id passed" }, { status: 404 });
    const data = await fetchPaste(id);
    if(!data)
        return Response.json({ error: "Invalid id passed" }, { status: 404 });
    const { max_views, content, remaining_views, expires_at } = data;

    let currentTime = Date.now();

    if (process.env.TEST_MODE === "1" && testTime) {
      currentTime = testTime;
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
        content,
        remaining_views,
        expires_at: expires_at === null ? null : new Date(expires_at/1000).toISOString(),
        expires_at_epoch: expires_at,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
