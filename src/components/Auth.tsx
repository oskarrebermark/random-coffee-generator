import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

interface Props {
  user: { displayName: string | null; email: string | null } | null
}

export default function Auth({ user }: Props) {
  const handleLogin = () => signInWithPopup(auth, googleProvider)
  const handleLogout = () => signOut(auth)

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <>
          <span className="text-sm text-stone-400">
            {user.displayName ?? user.email}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm border border-stone-600 text-stone-400 hover:border-amber-500 hover:text-amber-400 px-3 py-1 rounded-full transition-all"
          >
            Sign out
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          className="text-sm bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold px-4 py-1.5 rounded-full transition-all"
        >
          Sign in with Google
        </button>
      )}
    </div>
  )
}
