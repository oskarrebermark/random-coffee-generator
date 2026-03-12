import { useState, useEffect } from 'react'
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

type Tab = 'upload' | 'round' | 'history'

export default function Home({ user }: Props) {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [pairs, setPairs] = useState<Pair[]>([])
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [history, setHistory] = useState<PairingRound[]>([])
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('upload')

  useEffect(() => {
    if (!user) {
      setHistory([])
      return
    }
    loadHistory(user.uid).then(setHistory).catch(console.error)
  }, [user])

  const handleParsed = (data: Participant[]) => {
    setParticipants(data)
    setPairs([])
    setError('')
  }

  const handleGenerate = async () => {
    if (participants.length < 2 || !user) return
    setSaving(true)
    try {
      const pastKeys = await getPastPairKeys(user.uid)
      const newPairs = generatePairs(participants, pastKeys)
      setOddParticipant(participants.length % 2 !== 0)
      const pairKeys = extractPairKeys(newPairs)
      await saveRound(user.uid, newPairs, pairKeys)
      setPairs(newPairs)
      const updated = await loadHistory(user.uid)
      setHistory(updated)
      setActiveTab('round') // auto-switch to results tab
    } catch (e) {
      setError('Failed to save pairings. Please try again.')
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const [oddParticipant, setOddParticipant] = useState<boolean>(false)

  const tabs: { id: Tab; label: string; disabled?: boolean }[] = [
    { id: 'upload', label: '📂 Upload' },
    { id: 'round', label: '☕ This Round', disabled: pairs.length === 0 },
    { id: 'history', label: '📋 History', disabled: history.length === 0 },
  ]

  return (
    <div className="w-full min-h-screen text-stone-100 flex flex-col items-center px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Random Coffee</h1>
        <p className="text-stone-400">Upload your team list and generate coffee meetup pairs</p>
      </div>

      {/* Browser-style tab container */}
      <div className="w-full max-w-4xl">
        {/* Tab bar */}
        <div className="flex gap-1 bg-stone-800 rounded-t-xl px-3 pt-3">
          {tabs.map(tab => (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2 rounded-t-lg text-sm font-medium transition-colors
                ${tab.disabled ? 'opacity-30 cursor-not-allowed text-stone-400' : 'cursor-pointer'}
                ${activeTab === tab.id
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-400 hover:text-white hover:bg-stone-700'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content panel */}
        <div className="w-full max-w-4xl lg:max-w-4xl mx-auto bg-stone-900 rounded-b-xl rounded-tr-xl p-6 shadow-lg">

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="flex flex-col gap-4">
              <FileUpload onParsed={handleParsed} onError={setError} fileName={fileName} setFileName={setFileName}/>
              {participants.length > 0 && <ParticipantList participants={participants} />}
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                onClick={handleGenerate}
                disabled={saving || participants.length < 2 || !user}
                className="mt-2 w-full py-3 rounded-full bg-amber-500 text-stone-900 font-bold text-sm uppercase tracking-wide disabled:opacity-40 hover:bg-amber-400 transition-colors"
              >
                {saving ? 'Saving...' : !user ? 'Sign in to Generate Pairs' : 'Generate Coffee Pairs ☕'}
              </button>
            </div>
          )}

          {/* This Round Tab */}
          {activeTab === 'round' && (
            <div>
              {pairs.length > 0
                ? <PairResult pairs={pairs} oddParticipant={oddParticipant} onRegenerate={handleGenerate}/>
                : <p className="text-stone-400 text-sm">No pairs generated yet.</p>
              }
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="flex flex-col gap-4">
              {history.length === 0
                ? <p className="text-stone-400 text-sm">No history yet.</p>
                : history.map((round, index) => (
                  <div key={round.id} className="bg-stone-800 rounded-lg p-4">
                    <p className="text-sm text-center font-semibold text-amber-400 mb-2">
                      Round {history.length - index} — {round.date.toDate().toLocaleDateString('sv-SE', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                    <div className="flex flex-col gap-1">
                      {round.pairs.map((pair, i) => (
                        <div key={i} className="flex items-center justify-between gap-4 text-sm text-stone-300 px-4 py-1">
                          <span className="flex-1 text-right">{pair.person1.name}</span>
                          <span className="text-stone-500">☕</span>
                          <span className="flex-1 text-left">{pair.person2.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              }
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
