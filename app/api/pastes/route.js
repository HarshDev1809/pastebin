import { savePaste } from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(req) {
  try {
    const body = await req.json();
    const { content = null, ttl_seconds = null, max_views = null } = body;
    const testTime = req.headers.get("x-test-now-ms");

    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      return Response.json(
        { error: "Content is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (
      ttl_seconds !== null &&
      ttl_seconds !== undefined &&
      ttl_seconds !== ""
    ) {
      const ttl = Number(ttl_seconds);
      if (isNaN(ttl) || ttl < 1) {
        return Response.json(
          { error: "ttl_seconds must be a positive integer >= 1" },
          { status: 400 }
        );
      }
    }

    if (max_views !== null && max_views !== undefined && max_views !== "") {
      const views = Number(max_views);
      if (isNaN(views) || views < 1) {
        return Response.json(
          { error: "max_views must be a positive integer >= 1" },
          { status: 400 }
        );
      }
    }

    const id = nanoid(10);
    let currentTime = Date.now();

    if (process.env.TEST_MODE === "1" && testTime) {
      currentTime = Number(testTime);
    }

    let expiryTime = null;
    let ttlVal = null;
    if (ttl_seconds && ttl_seconds !== "") {
      ttlVal = Number(ttl_seconds);
      expiryTime = Number(currentTime) + ttlVal * 1000;
    }

    let maxViewsVal = null;
    if (max_views && max_views !== "") {
      maxViewsVal = Number(max_views);
    }

    await savePaste(
      id,
      content,
      currentTime,
      expiryTime,
      ttlVal,
      maxViewsVal,
      maxViewsVal
    );

    return Response.json(
      { id, url: `${process.env.NEXT_PUBLIC_APP_URL}/p/${id}` },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json({ error: error.message }, { status: 500 });
  }
}
