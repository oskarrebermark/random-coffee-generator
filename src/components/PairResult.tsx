import type { Pair } from '../utils/matchmaker'

interface Props {
  pairs: Pair[]
  oddParticipant: boolean
  onRegenerate: () => void
}

export default function PairResult({ pairs, oddParticipant, onRegenerate }: Props) {
  if (pairs.length === 0) return null

  return (
    <div className="w-full max-w-2xl lg:max-w-4xl">
      <h2 className="text-xl font-semibold text-amber-400 mb-6 text-center">
        ☕ This Round's Pairs
      </h2>
      <div className="flex flex-col gap-4">
        {pairs.map((pair, index) => (
          <div
            key={index}
            className="bg-stone-900 border border-stone-700 rounded-2xl p-6 shadow-md"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-stone-100">{pair.person1.name}</p>
                <p className="text-xs text-stone-400">{pair.person1.email}</p>
                <p className="text-xs text-amber-600 mt-1">{pair.person1.department}</p>
              </div>
              <span className="text-2xl">🤝</span>
              <div className="flex-1 text-right">
                <p className="font-semibold text-stone-100">{pair.person2.name}</p>
                <p className="text-xs text-stone-400">{pair.person2.email}</p>
                <p className="text-xs text-amber-600 mt-1">{pair.person2.department}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {oddParticipant && (
        <p className="text-center text-sm text-stone-500 mt-4">
          * 1 person left unpaired this round due to odd number of participants
        </p>
      )}

      <button
        onClick={onRegenerate}
        className="mt-6 w-full border border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-stone-950 font-semibold py-3 rounded-xl transition-all"
      >
        Regenerate Pairs
      </button>
    </div>
  )
}
