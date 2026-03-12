import { useState } from 'react'
import type { User } from 'firebase/auth'
import type { Participant } from '../utils/parseCSV'
import type { Pair } from '../utils/matchmaker'
import { generatePairs, extractPairKeys } from '../utils/matchmaker'
import { saveRound, loadHistory, getPastPairKeys } from '../utils/firestoreHelpers.ts'
import type { PairingRound } from '../utils/firestoreHelpers.ts'
import FileUpload from '../components/FileUpload'
import ParticipantList from '../components/ParticipantList'
import PairResult from '../components/PairResult'

interface Props {
  user: User | null
}

export default function Home({ user }: Props) {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [pairs, setPairs] = useState<Pair[]>([])
  const [fileName, setFileName] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [history, setHistory] = useState<PairingRound[]>([])
  const [saving, setSaving] = useState(false)

  const handleParsed = (data: Participant[]) => {
    setParticipants(data)
    setPairs([])
    setError('')

    // Load history when file is uploaded and user is signed in
    if (user) {
      loadHistory(user.uid).then(setHistory).catch(console.error)
    }
  }

  const handleGenerate = async () => {
    if (participants.length < 2 || !user) return

    setSaving(true)
    try {
      const pastKeys = await getPastPairKeys(user.uid)
      const newPairs = generatePairs(participants, pastKeys)
      const pairKeys = extractPairKeys(newPairs)

      await saveRound(user.uid, newPairs, pairKeys)

      setPairs(newPairs)
      const updated = await loadHistory(user.uid)
      setHistory(updated)
    } catch (e) {
      setError('Failed to save pairings. Please try again.')
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full flex flex-col items-center">

      {/* Hero */}
      <div className="mb-12 text-center">
        <span className="text-5xl">☕</span>
        <h1 className="text-4xl font-bold mt-4 text-amber-400">Random Coffee</h1>
        <p className="text-stone-400 mt-2 text-lg">
          Upload your team list and generate coffee meetup pairs
        </p>
      </div>

      {/* Upload Card */}
      <div className="w-full bg-stone-900 border border-stone-700 rounded-2xl p-8 shadow-xl">
        <FileUpload
          onParsed={handleParsed}
          onError={setError}
          fileName={fileName}
          setFileName={setFileName}
        />

        {error && (
          <p className="mt-4 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <ParticipantList participants={participants} />

        <button
          onClick={handleGenerate}
          disabled={participants.length < 2 || !user || saving}
          className="mt-6 w-full bg-amber-500 hover:bg-amber-400 disabled:bg-stone-700 disabled:text-stone-500 disabled:cursor-not-allowed text-stone-950 font-semibold py-3 rounded-xl transition-all"
        >
          {saving ? 'Saving...' : !user ? 'Sign in to Generate Pairs' : 'Generate Coffee Pairs ☕'}
        </button>
      </div>

      {/* Current round results */}
      <PairResult
        pairs={pairs}
        oddParticipant={participants.length % 2 !== 0}
        onRegenerate={handleGenerate}
      />

      {/* Pairing history */}
      {history.length > 0 && (
        <div className="w-full mt-12">
          <h2 className="text-xl font-semibold text-amber-400 mb-4 text-center">
            📋 Past Rounds
          </h2>
          <div className="flex flex-col gap-4">
            {history.map((round, index) => (
              <div
                key={round.id}
                className="bg-stone-900 border border-stone-700 rounded-2xl p-6"
              >
                <p className="text-sm text-stone-400 mb-3">
                  Round {history.length - index} —{' '}
                  {round.date.toDate().toLocaleDateString('sv-SE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <div className="flex flex-col gap-2">
                  {round.pairs.map((pair, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-stone-200">{pair.person1.name}</span>
                      <span className="text-amber-400 mx-2">☕</span>
                      <span className="text-stone-200">{pair.person2.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
