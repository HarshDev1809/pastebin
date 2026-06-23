import { db } from "./db/index";
import { snippets } from "./db/schema";
import { eq, desc, and, isNull, isNotNull } from "drizzle-orm";

export const saveSnippet = async (
  id: string,
  heading: string | null,
  content: string,
  language: string,
  userId: string | null,
  currentTime: number,
  expiryTime: number | null,
  ttl_seconds: number | null = null,
  max_views: number | null = null
) => {
  try {
    await db.insert(snippets).values({
      id,
      heading,
      content,
      language,
      userId,
      createdAt: currentTime,
      expiresAt: expiryTime,
      ttlSeconds: ttl_seconds,
      remainingViews: max_views,
      maxViews: max_views,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchSnippet = async (id: string) => {
  try {
    const data = await db.select().from(snippets).where(eq(snippets.id, id));
    return data[0] || null;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateView = async (id: string, updatedView: number) => {
  try {
    await db.update(snippets).set({ remainingViews: updatedView }).where(eq(snippets.id, id));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchUserSnippets = async (userId: string) => {
  try {
    return await db
      .select()
      .from(snippets)
      .where(and(eq(snippets.userId, userId), isNull(snippets.deletedAt)))
      .orderBy(desc(snippets.createdAt));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchSoftDeletedUserSnippets = async (userId: string) => {
  try {
    return await db
      .select()
      .from(snippets)
      .where(and(eq(snippets.userId, userId), isNotNull(snippets.deletedAt)))
      .orderBy(desc(snippets.deletedAt));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const softDeleteSnippet = async (id: string, userId: string) => {
  try {
    const snippet = await fetchSnippet(id);
    if (!snippet || snippet.userId !== userId) {
      throw new Error("Unauthorized or Snippet not found");
    }
    await db
      .update(snippets)
      .set({ deletedAt: Date.now() })
      .where(eq(snippets.id, id));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const restoreSnippet = async (id: string, userId: string) => {
  try {
    const snippet = await fetchSnippet(id);
    if (!snippet || snippet.userId !== userId) {
      throw new Error("Unauthorized or Snippet not found");
    }
    await db
      .update(snippets)
      .set({ deletedAt: null })
      .where(eq(snippets.id, id));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const permanentDeleteSnippet = async (id: string, userId: string) => {
  try {
    const snippet = await fetchSnippet(id);
    if (!snippet || snippet.userId !== userId) {
      throw new Error("Unauthorized or Snippet not found");
    }
    await db.delete(snippets).where(eq(snippets.id, id));
  } catch (error) {
    console.error(error);
    throw error;
  }
};
