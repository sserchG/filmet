'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Footer() {
  const [form, setForm]       = useState({ nombre: '', email: '', mensaje: '' })
  const [sent, setSent]       = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre.trim() || !form.email.trim() || !form.mensaje.trim()) {
      setError('Por favor rellena todos los campos.')
      return
    }
    setSending(true)
    setError('')
    // Simulación de envío (puedes conectar un servicio como Resend o Formspree)
    await new Promise(r => setTimeout(r, 800))
    setSent(true)
    setSending(false)
  }

  return (
    <footer style={{
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      marginTop: '6rem',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '4rem 2.5rem 2rem',
      }}>

        {/* Top grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}>

          {/* Brand */}
          <div>
            <span className="font-display" style={{ fontSize: '2rem', color: 'var(--text)', letterSpacing: '0.14em' }}>
              FILMET
            </span>
            <p style={{ marginTop: '0.75rem', fontSize: '0.83rem', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '240px' }}>
              Tu guía de cine. Descubre, guarda y comenta las mejores películas.
            </p>
            <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--muted)', opacity: 0.6 }}>
              Datos proporcionados por{' '}
              <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer"
                style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                TMDB
              </a>
            </p>
          </div>

          {/* Nav */}
          <div>
            <p style={{ fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
              Explorar
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                ['/', 'Inicio'],
                ['/cartelera', 'Cartelera'],
                ['/popular', 'Popular'],
                ['/buscar', 'Buscar películas'],
                ['/mi-lista', 'Mi lista'],
              ].map(([href, label]) => (
                <Link key={href} href={href} style={{
                  textDecoration: 'none', fontSize: '0.85rem',
                  color: 'var(--muted)', transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
              Contacto
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <a href="mailto:contactofilmet@gmail.com" style={{
                textDecoration: 'none', fontSize: '0.85rem', color: 'var(--muted)',
                display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
              >
                ✉ contactofilmet@gmail.com
              </a>
              <p style={{ fontSize: '0.83rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                ¿Tienes alguna sugerencia o petición de película? Escríbenos.
              </p>
            </div>
          </div>

          {/* Formulario de peticiones */}
          <div>
            <p style={{ fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
              Enviar petición
            </p>

            {sent ? (
              <div style={{
                background: 'rgba(92,224,122,0.08)',
                border: '1px solid rgba(92,224,122,0.3)',
                borderRadius: '10px', padding: '1rem',
                fontSize: '0.85rem', color: '#5ce07a', lineHeight: 1.6,
              }}>
                ✓ ¡Mensaje enviado! Te responderemos pronto.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  style={inputStyle}
                />
                <input
                  type="email"
                  placeholder="Tu email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={inputStyle}
                />
                <textarea
                  placeholder="Tu petición o mensaje..."
                  value={form.mensaje}
                  onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                />
                {error && (
                  <p style={{ color: '#e05c5c', fontSize: '0.78rem' }}>⚠ {error}</p>
                )}
                <button type="submit" disabled={sending} style={{
                  background: 'var(--accent)', color: 'var(--bg)',
                  border: 'none', borderRadius: '8px',
                  padding: '0.6rem 1.2rem',
                  fontSize: '0.82rem', fontWeight: 600,
                  cursor: sending ? 'not-allowed' : 'pointer',
                  opacity: sending ? 0.7 : 1,
                  transition: 'opacity 0.2s',
                  alignSelf: 'flex-start',
                }}>
                  {sending ? 'Enviando...' : 'Enviar →'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '0.5rem',
        }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--muted)', opacity: 0.6 }}>
            © {new Date().getFullYear()} Filmet. Todos los derechos reservados.
          </p>
          <p style={{ fontSize: '0.72rem', color: 'var(--muted)', opacity: 0.6 }}>
            Hecho con ♥ para los amantes del cine
          </p>
        </div>
      </div>
    </footer>
  )
}

const inputStyle = {
  width: '100%',
  background: 'var(--surface2)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '0.6rem 0.85rem',
  color: 'var(--text)',
  fontSize: '0.83rem',
  outline: 'none',
  boxSizing: 'border-box',
}
