'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  async function handleSubmit() {
    setError('')
    setSuccess('')
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Email o contraseña incorrectos')
      else router.push('/')
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }, // guardado en auth metadata como fallback
      })
      if (error) {
        setError('Error al crear la cuenta: ' + error.message)
      } else {
        const user = data.user
        if (user) {
          // upsert por si ya existe el perfil
          await supabase.from('profiles').upsert({ id: user.id, username }, { onConflict: 'id' })
        }
        setSuccess('Cuenta creada. Revisa tu email para confirmarla.')
      }
    }
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', marginBottom: '2.5rem' }}>
        <span className="font-display" style={{ fontSize: '2rem', color: 'var(--text)', letterSpacing: '0.1em' }}>FILMET</span>
      </Link>

      {/* Card */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '400px',
      }}>
        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
          {['login', 'register'].map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }} style={{
              flex: 1,
              padding: '0.75rem',
              background: 'transparent',
              border: 'none',
              color: mode === m ? 'var(--accent)' : 'var(--muted)',
              borderBottom: mode === m ? '2px solid var(--accent)' : '2px solid transparent',
              fontSize: '0.85rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              marginBottom: '-1px',
            }}>
              {m === 'login' ? 'Entrar' : 'Registrarse'}
            </button>
          ))}
        </div>

        {/* Campos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Usuario</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Nombre de usuario"
                style={{
                  width: '100%',
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  color: 'var(--text)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Correo Electronico"
              style={{
                width: '100%',
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                color: 'var(--text)',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña"
              style={{
                width: '100%',
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                color: 'var(--text)',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#e05c5c', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>
          )}
          {success && (
            <p style={{ color: '#5ce07a', fontSize: '0.85rem', textAlign: 'center' }}>{success}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: 'var(--accent)',
              color: 'var(--bg)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.85rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: '0.5rem',
            }}
          >
            {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>

          {mode === 'login' && (
            <Link href="/forgot-password" style={{
              color: 'var(--muted)', fontSize: '0.78rem',
              textAlign: 'center', textDecoration: 'none',
              display: 'block',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}