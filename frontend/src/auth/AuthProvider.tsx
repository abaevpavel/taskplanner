import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { USE_MOCKS } from '../lib/utils'
import type { AppRole } from '../domain/types'

interface AuthUser {
  id: string
  email: string
  role: AppRole
  firstName?: string
  lastName?: string
}

interface AuthCtx {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

const MOCK_USER: AuthUser = {
  id: 'mock-pm', email: 'pm@todor3d.com', role: 'pm', firstName: 'Test', lastName: 'PM',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (USE_MOCKS || !supabase) {
      setUser(MOCK_USER)
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) await loadUser(data.session.user.id, data.session.user.email ?? '')
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) loadUser(session.user.id, session.user.email ?? '')
      else setUser(null)
    })
    return () => sub.subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadUser(id: string, email: string) {
    let role: AppRole = 'pm'
    if (supabase) {
      const { data } = await supabase.from('user_roles').select('role').eq('user_id', id).maybeSingle()
      if (data?.role) role = data.role as AppRole
    }
    setUser({ id, email, role })
  }

  async function signIn(email: string, password: string) {
    if (USE_MOCKS || !supabase) {
      setUser({ ...MOCK_USER, email })
      return
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signInWithGoogle() {
    if (USE_MOCKS || !supabase) {
      setUser(MOCK_USER)
      return
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) throw error
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <Ctx.Provider value={{ user, loading, signIn, signInWithGoogle, signOut }}>{children}</Ctx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
