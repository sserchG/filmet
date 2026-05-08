'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    const redirectTo = typeof window !== 'undefined'
      ? `${window.location.origin}/reset-password`
      : '/reset-password'
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo })
    if (error) {
      setError('No se pudo enviar el email. Verifica que la dirección sea correcta.')
    } else {
      setSent(true)
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
        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✉️</div>
            <h2 className="font-display" style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Email enviado</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Revisa tu bandeja de entrada. El enlace expira en 1 hora.
            </p>
            <Link href="/login" style={{
              color: 'var(--accent)', fontSize: '0.82rem', textDecoration: 'none',
            }}>← Volver a iniciar sesión</Link>
          </div>
        ) : (
          <>
            <h2 className="font-display" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
              Recuperar cuenta
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                  Email
                </label>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
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
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </button>

              <Link href="/login" style={{
                color: 'var(--muted)', fontSize: '0.8rem', textAlign: 'center', textDecoration: 'none',
              }}>
                ← Volver a iniciar sesión
              </Link>
            </form>
          </>
        )}
      </div>
    </main>
  )
}
