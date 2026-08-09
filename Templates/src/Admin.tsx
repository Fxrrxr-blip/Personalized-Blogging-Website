import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type ChangeEvent,
} from 'react'
import type { AdminPost, MediaItem, PostDesign } from './types'
import { DEFAULT_DESIGN } from './types'

// ─── Storage ─────────────────────────────────────────────────────────────────

function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : initial
    } catch {
      return initial
    }
  })
  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      setValue(prev => {
        const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v
        try { localStorage.setItem(key, JSON.stringify(next)) } catch { /* quota */ }
        return next
      })
    },
    [key],
  )
  return [value, set]
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 64)
}

function calcReadTime(html: string) {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 200))} min`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function newPost(): AdminPost {
  const id = Date.now().toString()
  const now = new Date().toISOString()
  return {
    id,
    title: '',
    excerpt: '',
    content: '',
    category: 'Personal',
    tags: [],
    status: 'draft',
    coverImage: '',
    date: now,
    lastEdited: now,
    slug: id,
    metaTitle: '',
    metaDescription: '',
    visibility: 'public',
    design: { ...DEFAULT_DESIGN },
    views: 0,
    readTime: '1 min',
    size: 'medium',
    featured: false,
    image: '',
  }
}

// ─── Icons ───────────────────────────────────────────────────────────────────

const Icon = {
  grid: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  list: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  edit: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  check: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  plus: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  image: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  trash: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  copy: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  eye: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  back: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>,
  split: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>,
  desktop: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  tablet: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  mobile: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  upload: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  bold: <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>,
  italic: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>,
  underline: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>,
  ul: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>,
  ol: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="2" y="9" fontSize="8" fill="currentColor" stroke="none">1</text><text x="2" y="15" fontSize="8" fill="currentColor" stroke="none">2</text><text x="2" y="21" fontSize="8" fill="currentColor" stroke="none">3</text></svg>,
  quote: <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>,
  code: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  link: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  hr: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/></svg>,
  undo: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>,
  redo: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.49-4.95"/></svg>,
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

type AdminView = 'dashboard' | 'posts' | 'drafts' | 'published' | 'new' | 'edit' | 'media'

interface SidebarProps {
  view: AdminView
  setView: (v: AdminView) => void
  onExit: () => void
  draftCount: number
  publishedCount: number
}

function Sidebar({ view, setView, onExit, draftCount, publishedCount }: SidebarProps) {
  const items: { id: AdminView; label: string; icon: ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Overview', icon: Icon.grid },
    { id: 'posts', label: 'All Posts', icon: Icon.list },
    { id: 'drafts', label: 'Drafts', icon: Icon.edit, badge: draftCount },
    { id: 'published', label: 'Published', icon: Icon.check, badge: publishedCount },
    { id: 'media', label: 'Media Library', icon: Icon.image },
  ]
  return (
    <aside
      className="w-52 shrink-0 flex flex-col border-r"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', minHeight: '100vh' }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <p className="font-serif font-semibold text-sm" style={{ color: 'var(--foreground)' }}>a. nichols</p>
        <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--accent)' }}>Writer's Room</p>
      </div>

      {/* New post CTA */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={() => setView('new')}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-[5px] text-xs font-mono transition-opacity hover:opacity-80"
          style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
        >
          {Icon.plus} New Post
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-[5px] text-sm text-left transition-colors mb-0.5"
            style={{
              backgroundColor: view === item.id ? 'var(--muted)' : 'transparent',
              color: view === item.id ? 'var(--foreground)' : 'var(--muted-foreground)',
            }}
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="flex-1 font-light">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span
                className="text-[0.6rem] font-mono px-1.5 py-0.5 rounded-full"
                style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
              >
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Exit */}
      <div className="px-4 pb-5 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={onExit}
          className="w-full flex items-center gap-2 text-xs font-mono hover:opacity-70 transition-opacity"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {Icon.back} Back to Blog
        </button>
      </div>
    </aside>
  )
}

// ─── Dashboard View ───────────────────────────────────────────────────────────

function DashboardView({
  posts,
  setView,
  setEditingPost,
}: {
  posts: AdminPost[]
  setView: (v: AdminView) => void
  setEditingPost: (p: AdminPost) => void
}) {
  const published = posts.filter(p => p.status === 'published')
  const drafts = posts.filter(p => p.status === 'draft')
  const totalViews = posts.reduce((a, p) => a + p.views, 0)
  const recent = [...posts].sort((a, b) => b.lastEdited.localeCompare(a.lastEdited)).slice(0, 5)

  const stats = [
    { label: 'Total Posts', value: posts.length },
    { label: 'Published', value: published.length },
    { label: 'Drafts', value: drafts.length },
    { label: 'Total Views', value: totalViews.toLocaleString() },
  ]

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <p className="category-label mb-1">Writer's Room</p>
        <h1 className="font-serif text-3xl font-semibold" style={{ color: 'var(--foreground)' }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}.
        </h1>
        <p className="text-sm font-light mt-1" style={{ color: 'var(--muted-foreground)' }}>
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="p-5 rounded-[6px]" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
            <p className="text-2xl font-serif font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{s.value}</p>
            <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setView('new')}
          className="flex items-center gap-2 px-4 py-2 rounded-[5px] text-sm font-mono transition-opacity hover:opacity-80"
          style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
        >
          {Icon.plus} New Post
        </button>
        <button
          onClick={() => setView('media')}
          className="flex items-center gap-2 px-4 py-2 rounded-[5px] text-sm font-mono border transition-colors hover:opacity-70"
          style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
        >
          {Icon.image} Media Library
        </button>
      </div>

      {/* Recent posts */}
      {recent.length > 0 && (
        <div>
          <h2 className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--accent)' }}>Recently Edited</h2>
          <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {recent.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-4 px-4 py-3 hover:opacity-80 transition-opacity cursor-pointer"
                style={{
                  backgroundColor: 'var(--card)',
                  borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : undefined,
                }}
                onClick={() => { setEditingPost(p); setView('edit') }}
              >
                <div
                  className="w-10 h-10 rounded-[4px] shrink-0 overflow-hidden"
                  style={{ background: 'var(--muted)' }}
                >
                  {p.coverImage && <img src={p.coverImage} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
                    {p.title || 'Untitled'}
                  </p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                    Edited {fmtDate(p.lastEdited)}
                  </p>
                </div>
                <StatusPill status={p.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {posts.length === 0 && (
        <div className="text-center py-16" style={{ border: '1px dashed var(--border)', borderRadius: 8 }}>
          <p className="font-serif italic text-lg mb-3" style={{ color: 'var(--muted-foreground)' }}>
            No posts yet.
          </p>
          <button
            onClick={() => setView('new')}
            className="text-sm font-mono hover:opacity-70 transition-opacity"
            style={{ color: 'var(--accent)' }}
          >
            Write your first post →
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Status Pill ──────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: 'bg-[#8B9E7E]/15 text-[#5A7050]',
    draft: 'bg-amber-100 text-amber-700',
    archived: 'bg-gray-100 text-gray-500',
  }
  return (
    <span className={`inline-block text-[0.6rem] font-mono tracking-widest uppercase px-2 py-0.5 rounded-[3px] ${styles[status] ?? ''}`}>
      {status}
    </span>
  )
}

// ─── Posts List View ──────────────────────────────────────────────────────────

function PostsListView({
  posts,
  setPosts,
  statusFilter,
  setView,
  setEditingPost,
}: {
  posts: AdminPost[]
  setPosts: (fn: (prev: AdminPost[]) => AdminPost[]) => void
  statusFilter: 'all' | 'published' | 'draft' | 'archived'
  setView: (v: AdminView) => void
  setEditingPost: (p: AdminPost) => void
}) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>(statusFilter)

  const filtered = posts.filter(p => {
    const matchFilter = filter === 'all' || p.status === filter
    const matchQuery = !query || p.title.toLowerCase().includes(query.toLowerCase())
    return matchFilter && matchQuery
  })

  const deletePost = (id: string) => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  const duplicate = (post: AdminPost) => {
    const dup: AdminPost = {
      ...post,
      id: Date.now().toString(),
      title: post.title + ' (copy)',
      status: 'draft',
      date: new Date().toISOString(),
      lastEdited: new Date().toISOString(),
      slug: slugify(post.title + '-copy'),
    }
    setPosts(prev => [dup, ...prev])
  }

  const togglePublish = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== id) return p
      return { ...p, status: p.status === 'published' ? 'draft' : 'published', lastEdited: new Date().toISOString() }
    }))
  }

  const tabs: Array<{ id: typeof filter; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'published', label: 'Published' },
    { id: 'draft', label: 'Drafts' },
    { id: 'archived', label: 'Archived' },
  ]

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="category-label mb-1">Manage</p>
          <h1 className="font-serif text-3xl font-semibold" style={{ color: 'var(--foreground)' }}>My Posts</h1>
        </div>
        <button
          onClick={() => setView('new')}
          className="flex items-center gap-2 px-4 py-2 rounded-[5px] text-sm font-mono hover:opacity-80 transition-opacity"
          style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
        >
          {Icon.plus} New Post
        </button>
      </div>

      {/* Search + tabs */}
      <div className="flex flex-col sm:flex-row gap-4 mb-5">
        <div className="relative max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--muted-foreground)' }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="w-full pl-9 pr-4 py-2 text-sm rounded-[5px] outline-none"
            style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          />
        </div>
        <div className="flex gap-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className="px-3 py-1.5 text-xs font-mono rounded-[4px] border transition-all"
              style={{
                borderColor: filter === t.id ? 'var(--accent)' : 'var(--border)',
                background: filter === t.id ? 'var(--accent)' : 'transparent',
                color: filter === t.id ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        {filtered.length === 0 ? (
          <div className="py-12 text-center" style={{ backgroundColor: 'var(--card)' }}>
            <p className="font-serif italic" style={{ color: 'var(--muted-foreground)' }}>No posts found.</p>
          </div>
        ) : (
          filtered.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center gap-4 px-4 py-3"
              style={{
                backgroundColor: 'var(--card)',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : undefined,
              }}
            >
              {/* Thumb */}
              <div className="w-12 h-12 rounded-[4px] shrink-0 overflow-hidden" style={{ background: 'var(--muted)' }}>
                {p.coverImage && <img src={p.coverImage} alt="" className="w-full h-full object-cover" />}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
                  {p.title || 'Untitled'}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="category-label">{p.category}</span>
                  <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
                    {fmtDate(p.date)}
                  </span>
                  <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
                    {p.views} views
                  </span>
                </div>
              </div>

              <StatusPill status={p.status} />

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => { setEditingPost(p); setView('edit') }}
                  className="p-1.5 rounded hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--muted-foreground)' }}
                  title="Edit"
                >
                  {Icon.edit}
                </button>
                <button
                  onClick={() => duplicate(p)}
                  className="p-1.5 rounded hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--muted-foreground)' }}
                  title="Duplicate"
                >
                  {Icon.copy}
                </button>
                <button
                  onClick={() => togglePublish(p.id)}
                  className="p-1.5 rounded hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--muted-foreground)' }}
                  title={p.status === 'published' ? 'Unpublish' : 'Publish'}
                >
                  {Icon.eye}
                </button>
                <button
                  onClick={() => deletePost(p.id)}
                  className="p-1.5 rounded hover:opacity-70 transition-opacity"
                  style={{ color: '#C0504D' }}
                  title="Delete"
                >
                  {Icon.trash}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-xs font-mono mt-3" style={{ color: 'var(--muted-foreground)' }}>
        {filtered.length} {filtered.length === 1 ? 'post' : 'posts'}
      </p>
    </div>
  )
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

interface ToolbarProps {
  editorRef: React.RefObject<HTMLDivElement | null>
  onImageInsert: () => void
}

function Toolbar({ editorRef, onImageInsert }: ToolbarProps) {
  const exec = (cmd: string, value?: string) => {
    editorRef.current?.focus()
    document.execCommand(cmd, false, value)
  }

  const insertHTML = (html: string) => {
    editorRef.current?.focus()
    document.execCommand('insertHTML', false, html)
  }

  const groups: Array<Array<{ label: string; icon: ReactNode; action: () => void; title: string }>> = [
    [
      { label: 'H2', icon: <span className="text-xs font-mono font-bold">H2</span>, action: () => exec('formatBlock', 'h2'), title: 'Heading 2' },
      { label: 'H3', icon: <span className="text-xs font-mono font-bold">H3</span>, action: () => exec('formatBlock', 'h3'), title: 'Heading 3' },
      { label: 'P', icon: <span className="text-xs font-mono">¶</span>, action: () => exec('formatBlock', 'p'), title: 'Paragraph' },
    ],
    [
      { label: 'B', icon: Icon.bold, action: () => exec('bold'), title: 'Bold' },
      { label: 'I', icon: Icon.italic, action: () => exec('italic'), title: 'Italic' },
      { label: 'U', icon: Icon.underline, action: () => exec('underline'), title: 'Underline' },
    ],
    [
      { label: 'UL', icon: Icon.ul, action: () => exec('insertUnorderedList'), title: 'Bullet list' },
      { label: 'OL', icon: Icon.ol, action: () => exec('insertOrderedList'), title: 'Numbered list' },
    ],
    [
      { label: 'Q', icon: Icon.quote, action: () => exec('formatBlock', 'blockquote'), title: 'Blockquote' },
      {
        label: 'Code', icon: Icon.code,
        action: () => insertHTML('<pre><code contenteditable="true">// code here</code></pre><p><br></p>'),
        title: 'Code block',
      },
      {
        label: 'Link', icon: Icon.link,
        action: () => {
          const url = prompt('Enter URL:')
          if (url) exec('createLink', url)
        },
        title: 'Insert link',
      },
      { label: 'Image', icon: Icon.image, action: onImageInsert, title: 'Insert image' },
      {
        label: 'HR', icon: Icon.hr,
        action: () => insertHTML('<hr/><p><br></p>'),
        title: 'Divider',
      },
    ],
    [
      { label: 'Undo', icon: Icon.undo, action: () => exec('undo'), title: 'Undo' },
      { label: 'Redo', icon: Icon.redo, action: () => exec('redo'), title: 'Redo' },
    ],
  ]

  return (
    <div
      className="flex items-center gap-1 flex-wrap px-4 py-2 border-b"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
    >
      {groups.map((group, gi) => (
        <div key={gi} className="flex items-center gap-0.5">
          {gi > 0 && <div className="w-px h-4 mx-1" style={{ background: 'var(--border)' }} />}
          {group.map(btn => (
            <button
              key={btn.label}
              onMouseDown={e => { e.preventDefault(); btn.action() }}
              title={btn.title}
              className="w-7 h-7 flex items-center justify-center rounded-[3px] hover:opacity-70 transition-opacity"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {btn.icon}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

// ─── Post Design Preview ──────────────────────────────────────────────────────

function designCSS(design: PostDesign): React.CSSProperties {
  const themes: Record<string, React.CSSProperties> = {
    light: { backgroundColor: '#F7F5F0', color: '#1E1E1E' },
    dark: { backgroundColor: '#111110', color: '#EDE9E1' },
    paper: { backgroundColor: '#F5F1E8', color: '#2A2015' },
    minimal: { backgroundColor: '#FFFFFF', color: '#111111' },
  }
  const fontSizes: Record<string, string> = { sm: '0.9rem', md: '1rem', lg: '1.0875rem' }
  const lineHeights: Record<string, string> = { normal: '1.7', relaxed: '1.9' }
  const widths: Record<string, string> = { narrow: '520px', standard: '680px', wide: '880px' }
  return {
    ...themes[design.theme],
    maxWidth: widths[design.layout],
    fontSize: fontSizes[design.fontSize],
    lineHeight: lineHeights[design.lineHeight],
    textAlign: design.textAlign,
    fontFamily: design.bodyFont === 'inter' ? 'Inter, sans-serif' : "'DM Sans', sans-serif",
  }
}

// ─── Post Editor View ─────────────────────────────────────────────────────────

function PostEditorView({
  initialPost,
  onSave,
  onBack,
}: {
  initialPost: AdminPost
  onSave: (post: AdminPost) => void
  onBack: () => void
}) {
  const [post, setPost] = useState<AdminPost>({ ...initialPost })
  const [splitView, setSplitView] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile' | null>(null)
  const [settingsTab, setSettingsTab] = useState<'publish' | 'meta' | 'seo' | 'design'>('publish')
  const [tagInput, setTagInput] = useState('')
  const [saved, setSaved] = useState(false)
  const [coverInput, setCoverInput] = useState(post.coverImage)
  const editorRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Sync content to post state (debounced via save)
  const getContent = () => editorRef.current?.innerHTML ?? ''

  const handleSave = (status?: 'draft' | 'published') => {
    const content = getContent()
    const updated: AdminPost = {
      ...post,
      content,
      status: status ?? post.status,
      lastEdited: new Date().toISOString(),
      readTime: calcReadTime(content),
      image: post.coverImage,
      slug: post.slug || slugify(post.title) || post.id,
      metaTitle: post.metaTitle || post.title,
    }
    setPost(updated)
    onSave(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handlePublish = () => handleSave('published')

  const handleImageInsert = () => imageInputRef.current?.click()

  const onImageFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const src = ev.target?.result as string
      editorRef.current?.focus()
      document.execCommand(
        'insertHTML',
        false,
        `<figure><img src="${src}" alt="${file.name}" style="max-width:100%;border-radius:6px;" /><figcaption contenteditable="true" style="text-align:center;font-size:0.8rem;color:#777;margin-top:4px;">Caption</figcaption></figure><p><br></p>`,
      )
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const onCoverFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const url = ev.target?.result as string
      setPost(p => ({ ...p, coverImage: url, image: url }))
      setCoverInput(url)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (t && !post.tags.includes(t)) {
      setPost(p => ({ ...p, tags: [...p.tags, t] }))
    }
    setTagInput('')
  }

  const deviceWidth: Record<string, string> = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  }

  const CATEGORIES = ['Personal', 'Technology', 'Programming', 'Projects', 'College', 'Ideas', 'Lessons', 'Random']

  // Preview content
  const previewContent = () => (
    <div style={{ padding: '2rem', overflowY: 'auto', height: '100%' }}>
      <div style={{ margin: '0 auto', ...designCSS(post.design) }}>
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt="Cover"
            style={{
              width: '100%',
              aspectRatio: post.design.coverAspect,
              objectFit: 'cover',
              borderRadius: 6,
              marginBottom: '1.5rem',
            }}
          />
        )}
        <div style={{ maxWidth: designCSS(post.design).maxWidth, margin: '0 auto' }}>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8B9E7E', marginBottom: '0.5rem' }}>
            {post.category}
          </p>
          <h1 style={{
            fontFamily: post.design.headingFont === 'serif' ? "'Playfair Display', serif" : "'DM Sans', sans-serif",
            fontSize: '2rem', fontWeight: 600, lineHeight: 1.2, marginBottom: '0.75rem',
            color: designCSS(post.design).color as string,
          }}>
            {post.title || 'Untitled'}
          </h1>
          {post.excerpt && (
            <p style={{ color: '#777', marginBottom: '1.5rem', lineHeight: 1.6 }}>{post.excerpt}</p>
          )}
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: getContent() || post.content }}
            style={{ color: designCSS(post.design).color as string }}
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Header bar */}
      <div
        className="flex items-center gap-3 px-4 h-12 border-b shrink-0"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
      >
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-mono hover:opacity-70 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
          {Icon.back} Posts
        </button>
        <div className="w-px h-4" style={{ background: 'var(--border)' }} />

        <span className="text-xs font-mono truncate flex-1" style={{ color: 'var(--muted-foreground)' }}>
          {post.title || 'Untitled'}
        </span>

        <StatusPill status={post.status} />

        {/* Split / preview toggles */}
        <button
          onClick={() => { setSplitView(v => !v); setPreviewDevice(null) }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] text-xs font-mono border transition-all"
          style={{
            borderColor: splitView ? 'var(--accent)' : 'var(--border)',
            color: splitView ? 'var(--accent)' : 'var(--muted-foreground)',
          }}
        >
          {Icon.split} Split
        </button>

        <div className="flex items-center gap-1 border rounded-[4px] overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          {(['desktop', 'tablet', 'mobile'] as const).map(d => (
            <button
              key={d}
              onClick={() => { setPreviewDevice(previewDevice === d ? null : d); setSplitView(false) }}
              className="px-2 py-1.5 transition-colors"
              style={{
                backgroundColor: previewDevice === d ? 'var(--accent)' : 'transparent',
                color: previewDevice === d ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
              }}
              title={d}
            >
              {d === 'desktop' ? Icon.desktop : d === 'tablet' ? Icon.tablet : Icon.mobile}
            </button>
          ))}
        </div>

        {saved && <span className="text-xs font-mono" style={{ color: 'var(--accent)' }}>Saved ✓</span>}
        <button
          onClick={() => handleSave()}
          className="px-3 py-1.5 text-xs font-mono rounded-[4px] border hover:opacity-70 transition-opacity"
          style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
        >
          Save Draft
        </button>
        <button
          onClick={handlePublish}
          className="px-3 py-1.5 text-xs font-mono rounded-[4px] hover:opacity-80 transition-opacity"
          style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
        >
          {post.status === 'published' ? 'Update' : 'Publish'}
        </button>
      </div>

      {/* Preview device mode */}
      {previewDevice && (
        <div className="flex-1 overflow-auto flex items-start justify-center py-8" style={{ background: 'var(--muted)' }}>
          <div
            style={{
              width: deviceWidth[previewDevice],
              maxWidth: '100%',
              minHeight: '600px',
              background: 'var(--background)',
              borderRadius: 8,
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              overflow: 'hidden',
            }}
          >
            {previewContent()}
          </div>
        </div>
      )}

      {!previewDevice && (
        <div className="flex flex-1 overflow-hidden">
          {/* Editor area */}
          <div className={`flex flex-col overflow-hidden ${splitView ? 'w-1/2' : 'flex-1'}`} style={{ borderRight: splitView ? '1px solid var(--border)' : undefined }}>
            <Toolbar editorRef={editorRef} onImageInsert={handleImageInsert} />
            <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={onImageFile} />

            <div className="flex-1 overflow-y-auto px-8 py-6" style={{ backgroundColor: 'var(--background)' }}>
              <div style={{ maxWidth: 680, margin: '0 auto' }}>
                {/* Cover image section */}
                <div className="mb-4">
                  {post.coverImage ? (
                    <div className="relative group rounded-[6px] overflow-hidden mb-2" style={{ background: 'var(--muted)' }}>
                      <img
                        src={post.coverImage}
                        alt="Cover"
                        className="w-full object-cover"
                        style={{ maxHeight: 220 }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,0.4)' }}>
                        <label className="px-3 py-1.5 rounded text-xs font-mono cursor-pointer" style={{ background: 'white', color: '#111' }}>
                          Change
                          <input type="file" className="hidden" accept="image/*" onChange={onCoverFile} />
                        </label>
                        <button
                          onClick={() => { setPost(p => ({ ...p, coverImage: '', image: '' })); setCoverInput('') }}
                          className="px-3 py-1.5 rounded text-xs font-mono"
                          style={{ background: '#C0504D', color: 'white' }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center gap-2 rounded-[6px] py-6 border-dashed cursor-pointer hover:opacity-70 transition-opacity mb-2"
                      style={{ border: '2px dashed var(--border)', background: 'var(--muted)' }}
                    >
                      <label className="flex flex-col items-center gap-2 cursor-pointer">
                        <span style={{ color: 'var(--muted-foreground)' }}>{Icon.upload}</span>
                        <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>Upload cover image</span>
                        <input type="file" className="hidden" accept="image/*" onChange={onCoverFile} />
                      </label>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>or</span>
                      <div className="flex items-center gap-2 w-full max-w-xs px-4">
                        <input
                          value={coverInput}
                          onChange={e => setCoverInput(e.target.value)}
                          onBlur={() => { if (coverInput) setPost(p => ({ ...p, coverImage: coverInput, image: coverInput })) }}
                          placeholder="Paste image URL…"
                          className="flex-1 px-2 py-1 text-xs rounded-[4px] outline-none"
                          style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Title */}
                <textarea
                  value={post.title}
                  onChange={e => setPost(p => ({ ...p, title: e.target.value, slug: slugify(e.target.value) || p.slug }))}
                  placeholder="Give your post a title…"
                  rows={2}
                  className="w-full resize-none outline-none bg-transparent font-serif text-3xl font-semibold leading-tight mb-3"
                  style={{ color: 'var(--foreground)', border: 'none' }}
                />

                {/* Excerpt */}
                <textarea
                  value={post.excerpt}
                  onChange={e => setPost(p => ({ ...p, excerpt: e.target.value }))}
                  placeholder="Write a short introduction…"
                  rows={2}
                  className="w-full resize-none outline-none bg-transparent text-base font-light leading-relaxed mb-6 border-b pb-4"
                  style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}
                />

                {/* Content editor */}
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  className="prose-content outline-none min-h-64"
                  style={{ color: 'var(--foreground)' }}
                  data-placeholder="Start writing your post…"
                  onInput={() => {
                    // auto-update read time periodically
                  }}
                />
                {/* Placeholder styling */}
                <style>{`
                  [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: var(--muted-foreground);
                    font-style: italic;
                    pointer-events: none;
                  }
                  .prose-content h2 { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 600; margin: 2rem 0 0.75rem; }
                  .prose-content h3 { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 600; margin: 1.5rem 0 0.5rem; }
                  .prose-content blockquote { border-left: 2px solid var(--accent); padding: 0.5rem 1.25rem; font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.15rem; color: var(--muted-foreground); margin: 1.5rem 0; }
                  .prose-content pre { background: var(--muted); padding: 1rem 1.25rem; border-radius: 5px; font-family: 'DM Mono', monospace; font-size: 0.875rem; overflow-x: auto; margin: 1.25rem 0; }
                  .prose-content ul { list-style: disc; padding-left: 1.5rem; margin: 0.75rem 0; }
                  .prose-content ol { list-style: decimal; padding-left: 1.5rem; margin: 0.75rem 0; }
                  .prose-content li { margin-bottom: 0.3rem; }
                  .prose-content a { color: var(--accent); text-decoration: underline; }
                  .prose-content hr { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }
                  .prose-content figure { margin: 1.5rem 0; }
                  .prose-content figcaption { text-align: center; font-size: 0.8rem; color: var(--muted-foreground); margin-top: 0.5rem; }
                `}</style>
              </div>
            </div>
          </div>

          {/* Split preview */}
          {splitView && (
            <div className="w-1/2 overflow-y-auto" style={{ backgroundColor: 'var(--muted)' }}>
              <div style={{ padding: '2rem' }}>
                <div style={{ margin: '0 auto', ...designCSS(post.design) }}>
                  {post.coverImage && (
                    <img src={post.coverImage} alt="Cover" style={{ width: '100%', aspectRatio: post.design.coverAspect, objectFit: 'cover', borderRadius: 6, marginBottom: '1.5rem' }} />
                  )}
                  <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8B9E7E', marginBottom: '0.5rem' }}>{post.category}</p>
                  <h1 style={{
                    fontFamily: post.design.headingFont === 'serif' ? "'Playfair Display', serif" : "'DM Sans', sans-serif",
                    fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.2, marginBottom: '0.75rem',
                    color: designCSS(post.design).color as string,
                  }}>
                    {post.title || 'Untitled'}
                  </h1>
                  {post.excerpt && <p style={{ color: '#777', marginBottom: '1.25rem', lineHeight: 1.6 }}>{post.excerpt}</p>}
                  <div
                    className="prose-content"
                    dangerouslySetInnerHTML={{ __html: editorRef.current?.innerHTML || post.content }}
                    style={{ color: designCSS(post.design).color as string }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Settings sidebar */}
          {!splitView && (
            <div
              className="w-72 shrink-0 overflow-y-auto border-l"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
            >
              {/* Tabs */}
              <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
                {(['publish', 'meta', 'seo', 'design'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setSettingsTab(tab)}
                    className="flex-1 py-2.5 text-xs font-mono capitalize transition-colors"
                    style={{
                      borderBottom: settingsTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
                      color: settingsTab === tab ? 'var(--foreground)' : 'var(--muted-foreground)',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-4 space-y-5">
                {/* Publish tab */}
                {settingsTab === 'publish' && (
                  <>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>Publishing</p>
                      <div className="space-y-2">
                        <button onClick={() => handleSave('draft')} className="w-full py-2 text-sm font-mono border rounded-[4px] hover:opacity-70 transition-opacity" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>Save Draft</button>
                        <button onClick={handlePublish} className="w-full py-2 text-sm font-mono rounded-[4px] hover:opacity-80 transition-opacity" style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                          {post.status === 'published' ? 'Update Post' : 'Publish'}
                        </button>
                        {post.status === 'published' && (
                          <button onClick={() => handleSave('draft')} className="w-full py-2 text-sm font-mono border rounded-[4px] hover:opacity-70 transition-opacity" style={{ borderColor: 'var(--border)', color: '#C0504D' }}>Unpublish</button>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>Visibility</p>
                      {(['public', 'private'] as const).map(v => (
                        <label key={v} className="flex items-center gap-2 mb-2 cursor-pointer">
                          <input
                            type="radio"
                            name="visibility"
                            checked={post.visibility === v}
                            onChange={() => setPost(p => ({ ...p, visibility: v }))}
                            className="accent-[#8B9E7E]"
                          />
                          <span className="text-sm capitalize" style={{ color: 'var(--foreground)' }}>{v}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}

                {/* Meta tab */}
                {settingsTab === 'meta' && (
                  <>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>Category</label>
                      <select
                        value={post.category}
                        onChange={e => setPost(p => ({ ...p, category: e.target.value }))}
                        className="w-full px-3 py-2 text-sm rounded-[4px] outline-none"
                        style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                      >
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>Tags</label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {post.tags.map(t => (
                          <span
                            key={t}
                            className="tag-chip cursor-pointer"
                            onClick={() => setPost(p => ({ ...p, tags: p.tags.filter(x => x !== t) }))}
                          >
                            {t} ×
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        <input
                          value={tagInput}
                          onChange={e => setTagInput(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } }}
                          placeholder="Add tag…"
                          className="flex-1 px-2 py-1.5 text-xs rounded-[4px] outline-none"
                          style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                        />
                        <button onClick={addTag} className="px-2 py-1.5 text-xs rounded-[4px]" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}>+</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>URL Slug</label>
                      <input
                        value={post.slug}
                        onChange={e => setPost(p => ({ ...p, slug: e.target.value }))}
                        className="w-full px-3 py-2 text-xs font-mono rounded-[4px] outline-none"
                        style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>Post Size (card)</label>
                      <select
                        value={post.size}
                        onChange={e => setPost(p => ({ ...p, size: e.target.value as AdminPost['size'] }))}
                        className="w-full px-3 py-2 text-sm rounded-[4px] outline-none"
                        style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                      >
                        {['small', 'medium', 'large', 'tall'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {/* SEO tab */}
                {settingsTab === 'seo' && (
                  <>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>Meta Title</label>
                      <input
                        value={post.metaTitle}
                        onChange={e => setPost(p => ({ ...p, metaTitle: e.target.value }))}
                        placeholder={post.title}
                        className="w-full px-3 py-2 text-sm rounded-[4px] outline-none"
                        style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                      />
                      <p className="text-xs mt-1 font-mono" style={{ color: (post.metaTitle || post.title).length > 60 ? '#C0504D' : 'var(--muted-foreground)' }}>
                        {(post.metaTitle || post.title).length}/60
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>Meta Description</label>
                      <textarea
                        value={post.metaDescription}
                        onChange={e => setPost(p => ({ ...p, metaDescription: e.target.value }))}
                        placeholder={post.excerpt}
                        rows={3}
                        className="w-full px-3 py-2 text-sm rounded-[4px] outline-none resize-none"
                        style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                      />
                      <p className="text-xs mt-1 font-mono" style={{ color: post.metaDescription.length > 155 ? '#C0504D' : 'var(--muted-foreground)' }}>
                        {post.metaDescription.length}/155
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>Social Image URL</label>
                      <input
                        value={post.coverImage}
                        onChange={e => setPost(p => ({ ...p, coverImage: e.target.value, image: e.target.value }))}
                        placeholder="https://…"
                        className="w-full px-3 py-2 text-sm rounded-[4px] outline-none"
                        style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                      />
                    </div>
                  </>
                )}

                {/* Design tab */}
                {settingsTab === 'design' && (
                  <>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>Layout</p>
                      <div className="flex gap-2">
                        {(['narrow', 'standard', 'wide'] as const).map(l => (
                          <button
                            key={l}
                            onClick={() => setPost(p => ({ ...p, design: { ...p.design, layout: l } }))}
                            className="flex-1 py-2 text-xs font-mono rounded-[4px] border capitalize transition-all"
                            style={{
                              borderColor: post.design.layout === l ? 'var(--accent)' : 'var(--border)',
                              background: post.design.layout === l ? 'var(--accent)' : 'transparent',
                              color: post.design.layout === l ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
                            }}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>Theme</p>
                      <div className="grid grid-cols-2 gap-2">
                        {(['light', 'dark', 'paper', 'minimal'] as const).map(t => (
                          <button
                            key={t}
                            onClick={() => setPost(p => ({ ...p, design: { ...p.design, theme: t } }))}
                            className="py-2 text-xs font-mono rounded-[4px] border capitalize transition-all"
                            style={{
                              borderColor: post.design.theme === t ? 'var(--accent)' : 'var(--border)',
                              background: post.design.theme === t ? 'var(--accent)' : 'transparent',
                              color: post.design.theme === t ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>Heading Font</p>
                      <div className="flex gap-2">
                        {(['serif', 'sans'] as const).map(f => (
                          <button
                            key={f}
                            onClick={() => setPost(p => ({ ...p, design: { ...p.design, headingFont: f } }))}
                            className="flex-1 py-2 text-xs border rounded-[4px] capitalize transition-all"
                            style={{
                              fontFamily: f === 'serif' ? "'Playfair Display', serif" : "'DM Sans', sans-serif",
                              borderColor: post.design.headingFont === f ? 'var(--accent)' : 'var(--border)',
                              background: post.design.headingFont === f ? 'var(--accent)' : 'transparent',
                              color: post.design.headingFont === f ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
                            }}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>Font Size</p>
                      <div className="flex gap-2">
                        {(['sm', 'md', 'lg'] as const).map(s => (
                          <button
                            key={s}
                            onClick={() => setPost(p => ({ ...p, design: { ...p.design, fontSize: s } }))}
                            className="flex-1 py-2 text-xs font-mono border rounded-[4px] uppercase transition-all"
                            style={{
                              borderColor: post.design.fontSize === s ? 'var(--accent)' : 'var(--border)',
                              background: post.design.fontSize === s ? 'var(--accent)' : 'transparent',
                              color: post.design.fontSize === s ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>Line Height</p>
                      <div className="flex gap-2">
                        {(['normal', 'relaxed'] as const).map(lh => (
                          <button
                            key={lh}
                            onClick={() => setPost(p => ({ ...p, design: { ...p.design, lineHeight: lh } }))}
                            className="flex-1 py-2 text-xs font-mono border rounded-[4px] capitalize transition-all"
                            style={{
                              borderColor: post.design.lineHeight === lh ? 'var(--accent)' : 'var(--border)',
                              background: post.design.lineHeight === lh ? 'var(--accent)' : 'transparent',
                              color: post.design.lineHeight === lh ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
                            }}
                          >
                            {lh}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>Cover Aspect</p>
                      <div className="flex gap-2 flex-wrap">
                        {(['16/9', '4/3', '1/1'] as const).map(a => (
                          <button
                            key={a}
                            onClick={() => setPost(p => ({ ...p, design: { ...p.design, coverAspect: a } }))}
                            className="flex-1 py-2 text-xs font-mono border rounded-[4px] transition-all"
                            style={{
                              borderColor: post.design.coverAspect === a ? 'var(--accent)' : 'var(--border)',
                              background: post.design.coverAspect === a ? 'var(--accent)' : 'transparent',
                              color: post.design.coverAspect === a ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
                            }}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Media Library ────────────────────────────────────────────────────────────

function MediaLibraryView({
  media,
  setMedia,
}: {
  media: MediaItem[]
  setMedia: (fn: (prev: MediaItem[]) => MediaItem[]) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => {
        const url = ev.target?.result as string
        const item: MediaItem = {
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          url,
          filename: file.name,
          date: new Date().toISOString(),
          size: `${(file.size / 1024).toFixed(0)} KB`,
        }
        setMedia(prev => [item, ...prev])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const copyURL = (url: string, id: string) => {
    navigator.clipboard.writeText(url).catch(() => { })
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const deleteMedia = (id: string) => setMedia(prev => prev.filter(m => m.id !== id))

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="category-label mb-1">Assets</p>
          <h1 className="font-serif text-3xl font-semibold" style={{ color: 'var(--foreground)' }}>Media Library</h1>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 rounded-[5px] text-sm font-mono hover:opacity-80 transition-opacity"
          style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
        >
          {Icon.upload} Upload
        </button>
        <input ref={fileInputRef} type="file" className="hidden" accept="image/*" multiple onChange={handleUpload} />
      </div>

      {media.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-[8px] border-dashed cursor-pointer hover:opacity-70 transition-opacity"
          style={{ border: '2px dashed var(--border)' }}
          onClick={() => fileInputRef.current?.click()}
        >
          <span style={{ color: 'var(--muted-foreground)' }}>{Icon.upload}</span>
          <p className="font-serif italic mt-3 text-base" style={{ color: 'var(--muted-foreground)' }}>
            No media yet. Click to upload images.
          </p>
        </div>
      ) : (
        <div className="masonry-grid">
          {media.map(item => (
            <div
              key={item.id}
              className="masonry-item rounded-[6px] overflow-hidden group"
              style={{ border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
            >
              <div className="relative overflow-hidden img-zoom" style={{ background: 'var(--muted)' }}>
                <img src={item.url} alt={item.filename} className="w-full object-cover" style={{ maxHeight: 240 }} />
                <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-full flex gap-1 p-2" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.5))' }}>
                    <button
                      onClick={() => copyURL(item.url, item.id)}
                      className="flex-1 py-1.5 text-xs font-mono rounded-[3px] text-white transition-opacity hover:opacity-80"
                      style={{ background: 'rgba(255,255,255,0.2)' }}
                    >
                      {copied === item.id ? 'Copied!' : 'Copy URL'}
                    </button>
                    <button
                      onClick={() => deleteMedia(item.id)}
                      className="py-1.5 px-2.5 text-xs rounded-[3px] text-white"
                      style={{ background: '#C0504D99' }}
                    >
                      {Icon.trash}
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-3 py-2">
                <p className="text-xs font-mono truncate" style={{ color: 'var(--foreground)' }}>{item.filename}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{fmtDate(item.date)}</p>
                  <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{item.size}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Admin Root ───────────────────────────────────────────────────────────────

export default function Admin({ onExit }: { onExit: () => void }) {
  const [posts, setPosts] = useLocalStorage<AdminPost[]>('blog_admin_posts', [])
  const [media, setMedia] = useLocalStorage<MediaItem[]>('blog_media', [])
  const [view, setView] = useState<AdminView>('dashboard')
  const [editingPost, setEditingPost] = useState<AdminPost | null>(null)

  const handleNewPost = () => {
    const p = newPost()
    setEditingPost(p)
    setView('new')
  }

  const handleSetView = (v: AdminView) => {
    if (v === 'new') { handleNewPost(); return }
    setView(v)
  }

  const handleSavePost = (post: AdminPost) => {
    setPosts(prev => {
      const exists = prev.find(p => p.id === post.id)
      if (exists) return prev.map(p => p.id === post.id ? post : p)
      return [post, ...prev]
    })
    setEditingPost(post)
  }

  const draftCount = posts.filter(p => p.status === 'draft').length
  const publishedCount = posts.filter(p => p.status === 'published').length

  const isEditing = view === 'edit' || view === 'new'

  return (
    <div className="flex" style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {!isEditing && (
        <Sidebar
          view={view}
          setView={handleSetView}
          onExit={onExit}
          draftCount={draftCount}
          publishedCount={publishedCount}
        />
      )}

      <main className="flex-1 overflow-auto">
        {view === 'dashboard' && (
          <DashboardView
            posts={posts}
            setView={handleSetView}
            setEditingPost={p => { setEditingPost(p); setView('edit') }}
          />
        )}
        {(view === 'posts' || view === 'drafts' || view === 'published') && (
          <PostsListView
            posts={posts}
            setPosts={setPosts}
            statusFilter={view === 'drafts' ? 'draft' : view === 'published' ? 'published' : 'all'}
            setView={handleSetView}
            setEditingPost={p => { setEditingPost(p); setView('edit') }}
          />
        )}
        {isEditing && editingPost && (
          <PostEditorView
            key={editingPost.id}
            initialPost={editingPost}
            onSave={handleSavePost}
            onBack={() => setView('posts')}
          />
        )}
        {view === 'media' && (
          <MediaLibraryView media={media} setMedia={setMedia} />
        )}
      </main>
    </div>
  )
}

export { type AdminPost }
