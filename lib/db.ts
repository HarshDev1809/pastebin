import { db } from "./db/index";
import { pastes } from "./db/schema";
import { eq, desc } from "drizzle-orm";

export const savePaste = async (
  id: string,
  heading: string | null,
  content: string,
  userId: string | null,
  currentTime: number,
  expiryTime: number | null,
  ttl_seconds: number | null = null,
  max_views: number | null = null
) => {
  try {
    await db.insert(pastes).values({
      id,
      heading,
      content,
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

export const fetchPaste = async (id: string) => {
  try {
    const data = await db.select().from(pastes).where(eq(pastes.id, id));
    return data[0] || null;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateView = async (id: string, updatedView: number) => {
  try {
    await db.update(pastes).set({ remainingViews: updatedView }).where(eq(pastes.id, id));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchUserPastes = async (userId: string) => {
  try {
    return await db.select().from(pastes).where(eq(pastes.userId, userId)).orderBy(desc(pastes.createdAt));
  } catch (error) {
    console.error(error);
    throw error;
  }
};
