import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore'
import { db } from '../firebase'
import type { Pair } from './matchmaker'

const HISTORY_LIMIT = 6

export interface PairingRound {
  id: string
  date: Timestamp
  pairs: Pair[]
  pairKeys: string[]
}

function roundsRef(userId: string) {
  return collection(db, 'users', userId, 'pairings')
}

export async function saveRound(userId: string, pairs: Pair[], pairKeys: string[]) {
  const ref = roundsRef(userId)

  // Save new round
  await addDoc(ref, {
    date: Timestamp.now(),
    pairs,
    pairKeys
  })

  // Fetch all rounds sorted oldest first
  const snapshot = await getDocs(query(ref, orderBy('date', 'asc')))

  // If over limit, delete oldest
  if (snapshot.size > HISTORY_LIMIT) {
    const excess = snapshot.size - HISTORY_LIMIT
    const toDelete = snapshot.docs.slice(0, excess)
    await Promise.all(toDelete.map(d => deleteDoc(doc(db, 'users', userId, 'pairings', d.id))))
  }
}

export async function loadHistory(userId: string): Promise<PairingRound[]> {
  const snapshot = await getDocs(
    query(roundsRef(userId), orderBy('date', 'desc'))
  )
  return snapshot.docs.map(d => ({
    id: d.id,
    ...(d.data() as Omit<PairingRound, 'id'>)
  }))
}

export async function getPastPairKeys(userId: string): Promise<Set<string>> {
  const history = await loadHistory(userId)
  const allKeys = history.flatMap(r => r.pairKeys)
  return new Set(allKeys)
}
