import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth, googleProvider } from './firebase'


import type { Participant } from './utils/parseCSV'
import type { Pair } from './utils/matchmaker'
import { generatePairs } from './utils/matchmaker'
import FileUpload from './components/FileUpload'
import ParticipantList from './components/ParticipantList'
import PairResult from './components/PairResult'

import PillNav from './components/PillNav';
import logo from './assets/coffebean.svg';
import SplitText from './components/SplitText'
import TrueFocus from './components/TrueFocus'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [pairs, setPairs] = useState<Pair[]>([])
  const [fileName, setFileName] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser)
    return unsubscribe // cleans up listener on unmount
  }, [])

  // const handleLogin = () => signInWithPopup(auth, googleProvider)
  // const handleLogout = () => signOut(auth)

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
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center px-4 py-16">
      {/* Navigation */}
      <div className="w-full max-w-2xl mb-8 flex items-center justify-between">
        <PillNav
          logoAlt="Random Coffee"
          logo={logo}
          items={[
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
            { label: user ? 'Sign Out' : 'Login', 
              onClick: () => user
                 ? signOut(auth)
                 : signInWithPopup(auth, googleProvider) }
          ]}
          activeHref="/"
          ease="power2.easeOut"
          baseColor="#1c1917"
          pillColor="#f59e0b"
          hoveredPillTextColor="#f59e0b"
          pillTextColor="#1c1917"
          initialLoadAnimation={false}
        />
      </div>

      <div className="mb-12 text-center">
        <span className="text-5xl">☕ </span>
        <TrueFocus 
          sentence="Random Coffee"
          manualMode={false}
          blurAmount={5}
          borderColor="#fda21b"
          animationDuration={0.5}
          pauseBetweenAnimations={1}
        />
        <SplitText
          text="Upload your team list and generate coffee meetup pairs"
          className="text-stone-400 mt-2 text-lg"
          delay={40}
          duration={0.5}
        />

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
          disabled={participants.length < 2}
          className="mt-6 w-full bg-amber-500 hover:bg-amber-400 disabled:bg-stone-700 disabled:text-stone-500 disabled:cursor-not-allowed text-stone-950 font-semibold py-3 rounded-xl transition-all"
        >
          Generate Coffee Pairs ☕
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

export default App
