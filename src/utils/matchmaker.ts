import type { Participant } from './parseCSV'

export interface Pair {
  person1: Participant
  person2: Participant
}

function pairKey(a: Participant, b: Participant): string {
  return [a.email, b.email].sort().join('|')
}

export function generatePairs(
  participants: Participant[],
  pastPairKeys: Set<string> = new Set()
): Pair[] {
  const shuffled = [...participants].sort(() => Math.random() - 0.5)
  const used = new Set<string>()
  const pairs: Pair[] = []
  const unpaired: Participant[] = []

  for (let i = 0; i < shuffled.length; i++) {
    if (used.has(shuffled[i].email)) continue

    let matched = false
    for (let j = i + 1; j < shuffled.length; j++) {
      if (used.has(shuffled[j].email)) continue

      const key = pairKey(shuffled[i], shuffled[j])
      if (!pastPairKeys.has(key)) {
        pairs.push({ person1: shuffled[i], person2: shuffled[j] })
        used.add(shuffled[i].email)
        used.add(shuffled[j].email)
        matched = true
        break
      }
    }

    if (!matched) unpaired.push(shuffled[i])
  }

  // If some people couldn't be paired due to history, pair them anyway
  for (let i = 0; i < unpaired.length - 1; i += 2) {
    pairs.push({ person1: unpaired[i], person2: unpaired[i + 1] })
  }

  return pairs
}

export function extractPairKeys(pairs: Pair[]): string[] {
  return pairs.map(p => pairKey(p.person1, p.person2))
}
