import { useState } from 'react'
import type { User } from 'firebase/auth'
import type { Participant } from '../utils/parseCSV'
import type { Pair } from '../utils/matchmaker'
import { generatePairs } from '../utils/matchmaker'
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

  const handleParsed = (data: Participant[]) => {
    setParticipants(data)
    setPairs([])
    setError('')
  }

  const handleGenerate = () => {
    if (participants.length < 2) return
    setPairs(generatePairs(participants))
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col items-center">
      {/* Hero */}
      <div className="mb-12 text-center">
        <span className="text-5xl">☕</span>
        <h1 className="text-4xl font-bold mt-4 text-amber-400">Random Coffee</h1>
        <p className="text-stone-400 mt-2 text-lg">
          Upload your team list and generate coffee meetup pairs
        </p>
      </div>

      {/* Upload Card */}
      <div className="w-full max-w-lg bg-stone-900 border border-stone-700 rounded-2xl p-8 shadow-xl">
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
          disabled={participants.length < 2 || !user}
          className="mt-6 w-full bg-amber-500 hover:bg-amber-400 disabled:bg-stone-700 disabled:text-stone-500 disabled:cursor-not-allowed text-stone-950 font-semibold py-3 rounded-xl transition-all"
        >
          {!user ? 'Sign in to Generate Pairs' : 'Generate Coffee Pairs ☕'}
        </button>
      </div>

      {/* Results */}
      <PairResult
        pairs={pairs}
        oddParticipant={participants.length % 2 !== 0}
        onRegenerate={handleGenerate}
      />
    </div>
  )
}
