'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const router  = useRouter()
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState(false)
  const [ready,     setReady]     = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleReset(e) {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError('Error al actualizar: ' + error.message)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/'), 2500)
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '0.75rem 1rem',
    color: 'var(--text)', fontSize: '0.9rem', outline: 'none',
  }

  return (
    <main style={{
      minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      <Link href="/" style={{ textDecoration: 'none', marginBottom: '2.5rem' }}>
        <span className="font-display" style={{ fontSize: '2rem', color: 'var(--text)', letterSpacing: '0.1em' }}>FILMET</span>
      </Link>

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '400px',
      }}>
        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
            <h2 className="font-display" style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>¡Contraseña actualizada!</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Redirigiendo al inicio...</p>
          </div>
        ) : !ready ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>Verificando enlace...</p>
            <p style={{ color: 'var(--muted)', fontSize: '0.78rem', opacity: 0.6 }}>
              Si esto tarda, el enlace puede haber expirado.{' '}
              <Link href="/forgot-password" style={{ color: 'var(--accent)' }}>Solicitar uno nuevo</Link>
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-display" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
              Nueva contraseña
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
              Elige una contraseña segura de al menos 6 caracteres.
            </p>

            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                  Nueva contraseña
                </label>
                <input
                  type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required style={inputStyle}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                  Confirmar contraseña
                </label>
                <input
                  type="password" value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repite la contraseña"
                  required style={inputStyle}
                />
              </div>

              {error && <p style={{ color: '#e05c5c', fontSize: '0.82rem', textAlign: 'center' }}>{error}</p>}

              <button type="submit" disabled={loading} style={{
                background: 'var(--accent)', color: 'var(--bg)',
                border: 'none', borderRadius: '8px', padding: '0.85rem',
                fontSize: '0.9rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1, marginTop: '0.25rem',
              }}>
                {loading ? 'Guardando...' : 'Guardar contraseña'}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  )
}
