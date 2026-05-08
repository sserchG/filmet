'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function Header() {
  const [user, setUser]             = useState(null)
  const [username, setUsername]     = useState('')
  const [avatarUrl, setAvatarUrl]   = useState(null)
  const [open, setOpen]             = useState(false)
  const [stats, setStats]           = useState(null)
  const [uploading, setUploading]   = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname                    = usePathname()
  const router                      = useRouter()
  const dropdownRef                 = useRef(null)
  const fileRef                     = useRef(null)
  const searchInputRef              = useRef(null)

  async function loadProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', userId)
      .single()
    if (data) {
      setUsername(data.username || '')
      setAvatarUrl(data.avatar_url || null)
    }
  }

  async function loadStats(userId) {
    const { data } = await supabase.from('user_movies').select('status').eq('user_id', userId)
    if (data) setStats({
      total:     data.length,
      watched:   data.filter(m => m.status === 'watched').length,
      favorites: data.filter(m => m.status === 'favorite').length,
      pending:   data.filter(m => m.status === 'watchlist').length,
    })
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) { loadProfile(session.user.id); loadStats(session.user.id) }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) { loadProfile(session.user.id); loadStats(session.user.id) }
      else { setUsername(''); setAvatarUrl(null); setStats(null) }
    })
    return () => subscription.unsubscribe()
  }, [])

  /* Cerrar dropdown al hacer click fuera */
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  async function handleLogout() {
    setOpen(false)
    await supabase.auth.signOut()
    router.push('/')
  }

  function openSearch() {
    setSearchOpen(true)
    setSearchQuery('')
    setTimeout(() => searchInputRef.current?.focus(), 50)
  }

  function closeSearch() {
    setSearchOpen(false)
    setSearchQuery('')
  }

  function submitSearch(e) {
    e?.preventDefault()
    if (!searchQuery.trim()) return
    closeSearch()
    router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  // Cerrar búsqueda con ESC
  useEffect(() => {
    if (!searchOpen) return
    const handler = (e) => { if (e.key === 'Escape') closeSearch() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [searchOpen])

  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    try {
      const ext  = file.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true })
      if (upErr) throw upErr
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id)
      setAvatarUrl(publicUrl + '?t=' + Date.now()) // cache-bust
    } catch (err) {
      console.error('Avatar upload error:', err)
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const navLinks = [
    ['/', 'Inicio'],
    ['/cartelera', 'Cartelera'],
    ['/popular', 'Popular'],
  ]

  const initial = username?.charAt(0).toUpperCase() || '?'

  const avatarSmall = (
    <div style={{
      width: '28px', height: '28px', borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--accent), #a07830)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.7rem', fontWeight: 700, color: 'var(--bg)',
      flexShrink: 0, overflow: 'hidden',
    }}>
      {avatarUrl
        ? <img src={avatarUrl} alt={username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : initial}
    </div>
  )

  const avatarLarge = (
    <div
      onClick={() => fileRef.current?.click()}
      title="Cambiar foto"
      style={{
        width: '44px', height: '44px', borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--accent), #a07830)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem', fontWeight: 700, color: 'var(--bg)',
        flexShrink: 0, overflow: 'hidden', position: 'relative',
        cursor: 'pointer',
      }}
    >
      {avatarUrl
        ? <img src={avatarUrl} alt={username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : initial}
      <div
        className="avatar-overlay"
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(10,10,15,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.85rem', opacity: uploading ? 1 : 0,
          transition: 'opacity 0.2s', borderRadius: '50%',
        }}
        onMouseEnter={e => { if (!uploading) e.currentTarget.style.opacity = '1' }}
        onMouseLeave={e => { if (!uploading) e.currentTarget.style.opacity = '0' }}
      >
        {uploading ? '⟳' : '📷'}
      </div>
    </div>
  )

  return (
    <>
    <header className="header-inner" style={{
      padding: '0 2.5rem',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'fixed',
      top: 0, left: 0, right: 0,
      background: 'rgba(10,10,15,0.88)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      zIndex: 100,
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span className="font-display header-logo" style={{ fontSize: '1.4rem', color: 'var(--text)', letterSpacing: '0.14em' }}>
          FILMET
        </span>
      </Link>

      {/* Nav */}
      <nav className="nav-links" style={{ display: 'flex', gap: '0.1rem', alignItems: 'center' }}>
        {navLinks.map(([href, label]) => {
          const isActive = pathname === href
          return (
            <Link key={href} href={href} style={{
              textDecoration: 'none',
              fontSize: '0.78rem',
              fontWeight: 500,
              color: isActive ? 'var(--accent)' : 'var(--muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '0.4rem 0.9rem',
              borderBottom: isActive ? '1px solid var(--accent)' : '1px solid transparent',
            }}>
              {label}
            </Link>
          )
        })}

        {/* Search bar pill */}
        <button
          className="header-search-pill"
          onClick={openSearch}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            padding: '0.38rem 1rem 0.38rem 0.75rem',
            cursor: 'pointer',
            transition: 'border-color 0.2s, background 0.2s',
            marginRight: '0.25rem',
            minWidth: '180px',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'; e.currentTarget.style.background = 'var(--surface2)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)' }}
        >
          <span style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1 }}>⌕</span>
          <span className="header-search-text" style={{ fontSize: '0.78rem', color: 'var(--muted)', flex: 1, textAlign: 'left', letterSpacing: '0.02em' }}>
            Buscar películas...
          </span>
          <span className="header-search-kbd" style={{
            fontSize: '0.6rem', color: 'var(--muted)', opacity: 0.5,
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: '4px', padding: '0.1rem 0.35rem', letterSpacing: '0.04em',
          }}>⏎</span>
        </button>

        <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 0.75rem' }} />

        {/* Auth area */}
        {user ? (
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            {/* Hidden file input */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: 'none' }}
            />

            {/* Avatar button */}
            <button
              onClick={() => setOpen(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.55rem',
                background: open ? 'var(--surface2)' : 'transparent',
                border: `1px solid ${open ? 'rgba(201,168,76,0.3)' : 'var(--border)'}`,
                padding: '0.3rem 0.75rem 0.3rem 0.4rem',
                borderRadius: '24px', cursor: 'pointer',
                transition: 'background 0.2s, border-color 0.2s',
              }}
            >
              {avatarSmall}
              <span style={{ fontSize: '0.82rem', color: 'var(--text)', fontWeight: 500 }}>{username}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', marginLeft: '2px' }}>
                <path d="M2 3.5L5 6.5L8 3.5" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            {/* ── DROPDOWN ── */}
            {open && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                width: '240px',
                background: 'rgba(18,18,26,0.97)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
                animation: 'fadeUp 0.2s ease',
                zIndex: 200,
              }}>

                {/* User info */}
                <div style={{ padding: '1.1rem 1.2rem 1rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    {avatarLarge}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.15rem' }}>
                        {username || 'Usuario'}
                      </p>
                      <button
                        onClick={() => fileRef.current?.click()}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--accent)', fontSize: '0.68rem',
                          letterSpacing: '0.06em', padding: 0,
                          textDecoration: 'underline', textDecorationStyle: 'dotted',
                        }}
                      >
                        {uploading ? 'Subiendo...' : avatarUrl ? 'Cambiar foto' : 'Añadir foto'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                {stats && (
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.4rem', padding: '0.85rem 1rem',
                    borderBottom: '1px solid var(--border)',
                  }}>
                    {[
                      { label: 'Vistas',     value: stats.watched,   color: '#5ce07a' },
                      { label: 'Favoritas',  value: stats.favorites, color: '#e05c5c' },
                      { label: 'Pendientes', value: stats.pending,   color: 'var(--accent)' },
                    ].map(s => (
                      <div key={s.label} style={{
                        textAlign: 'center', padding: '0.55rem 0.25rem',
                        background: 'var(--surface2)', borderRadius: '8px',
                      }}>
                        <p className="font-display" style={{ fontSize: '1.35rem', color: s.color, lineHeight: 1 }}>{s.value}</p>
                        <p style={{ fontSize: '0.58rem', color: 'var(--muted)', marginTop: '0.2rem', letterSpacing: '0.05em' }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div style={{ padding: '0.4rem 0' }}>
                  <DropdownLink href="/mi-lista" onClick={() => setOpen(false)} icon="▤">
                    Mi lista
                  </DropdownLink>
                  <DropdownLink href="/buscar" onClick={() => setOpen(false)} icon="⌕">
                    Buscar películas
                  </DropdownLink>
                </div>

                {/* Logout */}
                <div style={{ borderTop: '1px solid var(--border)', padding: '0.4rem 0' }}>
                  <button onClick={handleLogout} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem',
                    padding: '0.6rem 1.1rem',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: '#e05c5c', fontSize: '0.82rem', textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,92,92,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: '0.85rem' }}>→</span>
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" style={{
            textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600,
            color: 'var(--bg)', background: 'var(--accent)',
            padding: '0.45rem 1.2rem', borderRadius: '6px',
            letterSpacing: '0.07em', textTransform: 'uppercase',
          }}>
            Entrar
          </Link>
        )}
      </nav>
    </header>

    {/* ── SEARCH OVERLAY ── */}
    {searchOpen && (
      <div
        onClick={closeSearch}
        style={{
          position: 'fixed', inset: 0, zIndex: 500,
          background: 'rgba(10,10,15,0.88)',
          backdropFilter: 'blur(12px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', paddingTop: '18vh',
          animation: 'fadeIn 0.18s ease',
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{ width: 'min(680px, 90vw)' }}
        >
          {/* Label */}
          <p style={{
            fontSize: '0.62rem', color: 'var(--accent)',
            letterSpacing: '0.35em', textTransform: 'uppercase',
            marginBottom: '1.2rem', textAlign: 'center',
          }}>Buscar película</p>

          {/* Input */}
          <form onSubmit={submitSearch} style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: '1.2rem', top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--muted)', fontSize: '1.2rem', pointerEvents: 'none',
            }}>⌕</span>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Título, director, saga..."
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'var(--surface)',
                border: '1px solid rgba(201,168,76,0.35)',
                borderRadius: '14px',
                padding: '1.1rem 4rem 1.1rem 3rem',
                color: 'var(--text)',
                fontSize: '1.15rem', outline: 'none',
                boxShadow: '0 0 0 3px rgba(201,168,76,0.08)',
              }}
            />
            {searchQuery && (
              <button
                type="submit"
                style={{
                  position: 'absolute', right: '0.8rem', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'var(--accent)', color: 'var(--bg)',
                  border: 'none', borderRadius: '8px',
                  padding: '0.45rem 1rem',
                  fontSize: '0.75rem', fontWeight: 700,
                  letterSpacing: '0.08em', cursor: 'pointer',
                }}
              >IR →</button>
            )}
          </form>

          {/* Hint */}
          <p style={{
            textAlign: 'center', marginTop: '1.2rem',
            fontSize: '0.7rem', color: 'var(--muted)', opacity: 0.6,
            letterSpacing: '0.08em',
          }}>
            Pulsa <kbd style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.1rem 0.4rem', fontSize: '0.68rem' }}>Enter</kbd> para buscar · <kbd style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.1rem 0.4rem', fontSize: '0.68rem' }}>ESC</kbd> para cerrar
          </p>
        </div>
      </div>
    )}
  </>
  )
}

function DropdownLink({ href, onClick, icon, children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={href} onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '0.65rem',
      padding: '0.6rem 1.1rem',
      textDecoration: 'none',
      color: hovered ? 'var(--text)' : 'var(--muted)',
      fontSize: '0.82rem',
      background: hovered ? 'var(--surface2)' : 'transparent',
      transition: 'background 0.15s, color 0.15s',
    }}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    >
      <span style={{ fontSize: '0.9rem', width: '16px', textAlign: 'center' }}>{icon}</span>
      {children}
    </Link>
  )
}
