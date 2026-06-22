import { db } from "./db/index";
import { pastes } from "./db/schema";
import { eq, desc, and, isNull, isNotNull } from "drizzle-orm";

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
    return await db
      .select()
      .from(pastes)
      .where(and(eq(pastes.userId, userId), isNull(pastes.deletedAt)))
      .orderBy(desc(pastes.createdAt));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchSoftDeletedUserPastes = async (userId: string) => {
  try {
    return await db
      .select()
      .from(pastes)
      .where(and(eq(pastes.userId, userId), isNotNull(pastes.deletedAt)))
      .orderBy(desc(pastes.deletedAt));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const softDeletePaste = async (id: string, userId: string) => {
  try {
    const paste = await fetchPaste(id);
    if (!paste || paste.userId !== userId) {
      throw new Error("Unauthorized or Paste not found");
    }
    await db
      .update(pastes)
      .set({ deletedAt: Date.now() })
      .where(eq(pastes.id, id));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const restorePaste = async (id: string, userId: string) => {
  try {
    const paste = await fetchPaste(id);
    if (!paste || paste.userId !== userId) {
      throw new Error("Unauthorized or Paste not found");
    }
    await db
      .update(pastes)
      .set({ deletedAt: null })
      .where(eq(pastes.id, id));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const permanentDeletePaste = async (id: string, userId: string) => {
  try {
    const paste = await fetchPaste(id);
    if (!paste || paste.userId !== userId) {
      throw new Error("Unauthorized or Paste not found");
    }
    await db.delete(pastes).where(eq(pastes.id, id));
  } catch (error) {
    console.error(error);
    throw error;
  }
};
