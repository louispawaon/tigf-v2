import Dexie, { type EntityTable } from 'dexie'
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

function isSameCalendarDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

export async function getTodayEntry(): Promise<Entry | null> {
  const today = new Date()
  const allEntries = await db.entries.toArray()
  const todayEntry = allEntries.find((entry) => isSameCalendarDay(entry.createdAt, today))
  return todayEntry ?? null
}

export async function saveTodayEntry(body: string): Promise<Entry | null> {
  const now = new Date()
  const existing = await getTodayEntry()

  if (!body.trim() && !existing) {
    return null
  }

  if (existing) {
    const updatedEntry: Entry = {
      ...existing,
      body,
      updatedAt: now,
      wordCount: countWords(body),
    }
    await db.entries.update(existing.id, {
      body: updatedEntry.body,
      updatedAt: updatedEntry.updatedAt,
      wordCount: updatedEntry.wordCount,
    })
    return updatedEntry
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
