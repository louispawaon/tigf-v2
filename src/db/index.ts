import Dexie from 'dexie'
import type { EntityTable } from 'dexie'
import { nanoid } from 'nanoid'

export interface Entry {
  id: string
  body: string
  createdAt: Date
  updatedAt: Date
  wordCount: number
}

export interface AppMeta {
  key: string
  value: unknown
}

class GratefulDB extends Dexie {
  entries!: EntityTable<Entry, 'id'>
  meta!: EntityTable<AppMeta, 'key'>

  constructor() {
    super('grateful-db')
    this.version(1).stores({
      entries: 'id, createdAt, updatedAt, wordCount',
      meta: 'key',
    })
  }
}

export const db = new GratefulDB()

export function countWords(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) {
    return 0
  }
  return trimmed.split(/\s+/).length
}

function getDayBounds(value: Date): { start: Date; end: Date } {
  const start = new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0)
  const end = new Date(value.getFullYear(), value.getMonth(), value.getDate(), 23, 59, 59, 999)
  return { start, end }
}

export async function getTodayEntry(): Promise<Entry | null> {
  const today = new Date()
  return getLatestEntryForDay(today)
}

export async function getEntriesForDay(day: Date): Promise<Entry[]> {
  const { start, end } = getDayBounds(day)
  return db.entries.where('createdAt').between(start, end, true, true).sortBy('createdAt')
}

export async function getLatestEntryForDay(day: Date): Promise<Entry | null> {
  const dayEntries = await getEntriesForDay(day)
  return dayEntries[dayEntries.length - 1] ?? null
}

export async function saveEntrySegment(body: string, entryId: string | null): Promise<Entry | null> {
  const now = new Date()
  const trimmedBody = body.trim()

  if (entryId) {
    const existingById = await db.entries.get(entryId)
    if (!existingById) {
      return null
    }

    const updatedEntry: Entry = {
      ...existingById,
      body,
      updatedAt: now,
      wordCount: countWords(body),
    }
    await db.entries.update(existingById.id, {
      body: updatedEntry.body,
      updatedAt: updatedEntry.updatedAt,
      wordCount: updatedEntry.wordCount,
    })
    return updatedEntry
  }

  if (!trimmedBody) {
    return null
  }

  const newEntry: Entry = {
    id: nanoid(),
    body,
    createdAt: now,
    updatedAt: now,
    wordCount: countWords(body),
  }
  await db.entries.add(newEntry)
  return newEntry
}

export async function saveTodayEntry(body: string): Promise<Entry | null> {
  const latestTodayEntry = await getTodayEntry()
  return saveEntrySegment(body, latestTodayEntry ? latestTodayEntry.id : null)
}

export async function getMemoryEntry(): Promise<Entry | null> {
  const today = new Date()
  const allEntries = await db.entries.orderBy('createdAt').toArray()

  if (allEntries.length < 2) {
    return null
  }

  const sameMonthDay = allEntries.filter((entry) => {
    return entry.createdAt.getDate() === today.getDate() && entry.createdAt.getMonth() === today.getMonth()
  })

  if (sameMonthDay.length > 0) {
    return sameMonthDay[sameMonthDay.length - 1] ?? null
  }

  const randomIndex = Math.floor(Math.random() * allEntries.length)
  return allEntries[randomIndex] ?? null
}

export async function getHistoryEntries(): Promise<Entry[]> {
  return db.entries.orderBy('createdAt').reverse().toArray()
}

export async function getMetaValue(key: string): Promise<unknown | null> {
  const meta = await db.meta.get(key)
  if (!meta) {
    return null
  }
  return meta.value
}

export async function setMetaValue(key: string, value: unknown): Promise<void> {
  const existing = await db.meta.get(key)
  if (existing) {
    await db.meta.update(key, { value })
    return
  }
  await db.meta.add({ key, value })
}
