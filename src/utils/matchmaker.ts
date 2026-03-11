import type { Participant } from './parseCSV'

export interface Pair {
  person1: Participant
  person2: Participant
}

export function generatePairs(participants: Participant[]): Pair[] {
  const shuffled = [...participants].sort(() => Math.random() - 0.5)
  const pairs: Pair[] = []
  for (let i = 0; i < shuffled.length - 1; i += 2) {
    pairs.push({ person1: shuffled[i], person2: shuffled[i + 1] })
  }
  return pairs
}
