import type { Participant } from '../utils/parseCSV'

interface Props {
  participants: Participant[]
}

export default function ParticipantList({ participants }: Props) {
  if (participants.length === 0) return null

  return (
    <div className="mt-4">
      <p className="text-sm text-green-400 mb-2">✓ {participants.length} participants loaded</p>
      <div className="max-h-40 overflow-y-auto rounded-xl border border-stone-700 divide-y divide-stone-800">
        {participants.map((p, i) => (
          <div key={i} className="flex justify-between px-4 py-2 text-xs text-stone-400">
            <span className="text-stone-200">{p.name}</span>
            <span>{p.department}</span>
            <span>{p.email}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
