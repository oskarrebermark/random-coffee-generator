import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import PillNav from '../components/PillNav'
import About from '../pages/About'
import Home from '../pages/Home'
import coffeebean from '../assets/coffebean.svg'

export default function MainLayout() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser)
    return unsubscribe
  }, [])

  const handleLogin = () => signInWithPopup(auth, googleProvider)
  const handleLogout = () => signOut(auth)

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">

        {/* Navigation — always visible on all pages */}
        <div className="w-full flex justify-center px-4 py-6">
            <PillNav
            logo={coffeebean}
            logoAlt="Random Coffee"
            items={[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                {
                label: user ? 'Sign Out' : 'Login',
                onClick: user ? handleLogout : handleLogin
                }
            ]}
            activeHref="/"
            baseColor="#1c1917"
            pillColor="#f59e0b"
            hoveredPillTextColor="#f59e0b"
            pillTextColor="#1c1917"
            //theme="dark"
            initialLoadAnimation={false}
            />
        </div>

        {/* Page content here */}
            <div className="flex flex-col items-center px-4 pb-16">
            <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </div>

    </div>
  )
}
