import React, { useState, useEffect, useRef, useCallback } from 'react';
import { API_BASE_URL } from "./api";
import { AuthModal as RemoteAuthModal } from "./AuthModal";
import Admin, { type AdminPost } from './Admin';

interface Milestone {
  year: string;
  text: string;
  color?: string;
}

interface UserProfile {
  email: string;
  username: string;
  displayName: string;
  locationRole: string; // e.g. "Edinburgh, Scotland · CS Student"
  bio1: string;
  bio2: string;
  avatarUrl: string;
  currently: string[];
  learning: string[];
  techStack: string[];
  philosophy: string;
  milestones: Milestone[];
}

function useAdminPosts(): AdminPost[] {
  const [posts, setPosts] = useState<AdminPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/posts`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPosts(data as AdminPost[]);
            return;
          }
        }
      } catch (err) {
        console.error("Error loading posts from API:", err);
      }

      try {
        const raw = localStorage.getItem('blog_admin_posts');
        if (raw) {
          setPosts(JSON.parse(raw));
        } else {
          setPosts(INITIAL_POSTS as AdminPost[]);
        }
      } catch {
        setPosts(INITIAL_POSTS as AdminPost[]);
      }
    };

    fetchPosts();
  }, []);

  return posts.filter(p => p.status === 'published' && p.visibility === 'public');
}
// ─── Data ───────────────────────────────────────────────────────────────────

const INITIAL_POSTS = [
  {
    id: '1',
    title: 'On the quiet discipline of keeping a journal',
    excerpt: 'Three years ago I started writing every morning before opening my laptop. I never expected it would change how I think.',
    category: 'Personal',
    date: 'July 28, 2026',
    readTime: '6 min',
    tags: ['habits', 'writing', 'reflection'],
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&h=600&fit=crop&auto=format',
    featured: true,
    size: 'large',
    content: `There is something quietly radical about sitting down each morning with a blank page before the day has had a chance to fill your head with its noise.

I started this habit in the winter of 2023 — not because I read about it in some productivity book, but because I was anxious and needed somewhere to put it. The first entries were mostly complaints. About the cold. About deadlines. About a conversation that hadn't gone the way I'd hoped.

But over time, something shifted.

<blockquote>Writing daily is not about capturing your life. It's about understanding it while it's happening to you.</blockquote>

The journal became less of a complaint log and more of a thinking space. A place where ideas could arrive half-formed and leave a little more solid. Where I could argue with myself without anyone watching.

## What it changed

The most surprising effect was on my memory. Not in a mystical way — I simply started noticing more, because I knew I'd be writing about it later. A walk became a set of details worth collecting. A conversation left echoes worth recording.

The second effect was slower but more important: I got better at knowing what I actually thought. Before the journal, my opinions were mostly borrowed — assembled from whatever I'd last read or heard. Writing forced me to locate the source, to ask: *do I actually believe this, or did I just encounter it recently?*

\`\`\`
The question I ask myself most often in the journal:
"What do I actually think — not what I've been told to think?"
\`\`\`

That single question has probably saved me more confusion than anything else.`,
  },
  {
    id: 2,
    title: 'Building a Python tool that reads my bookmarks',
    excerpt: 'A weekend project that started as a small script and turned into something I actually use every day.',
    category: 'Projects',
    date: 'July 14, 2026',
    readTime: '8 min',
    tags: ['python', 'tools', 'automation'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop&auto=format',
    featured: false,
    size: 'medium',
    content: `Every time I save a link to read later, I fully intend to return to it. I don't. My bookmark folder is a graveyard of good intentions.

So I built a script that actually does something with them.

## The problem

I had 847 bookmarks accumulated across three years of using the browser. Most were articles, documentation pages, and GitHub repos. A small fraction were things I'd actually read. The rest were digital hoarding — kept because deleting felt like losing something.

The script reads the browser's exported bookmarks HTML, extracts all URLs, and runs a quick relevance sort based on a small set of keywords I care about right now.

\`\`\`python
def score_bookmark(url, title, keywords):
    score = 0
    for keyword in keywords:
        if keyword.lower() in title.lower():
            score += 2
        if keyword.lower() in url.lower():
            score += 1
    return score
\`\`\`

Simple. But it turns out that's all I needed. The top 20 results are almost always things I actually want to revisit.

<blockquote>The best tools are the ones you build for yourself — they fit exactly because they were never designed for anyone else.</blockquote>`,
  },
  {
    id: 3,
    title: 'What I learned from a semester of barely sleeping',
    excerpt: 'Notes from the edge of burnout, and the few things that actually helped.',
    category: 'College',
    date: 'June 30, 2026',
    readTime: '5 min',
    tags: ['college', 'health', 'lessons'],
    image: 'https://images.unsplash.com/photo-1414124488080-0188dcbb8834?w=800&h=550&fit=crop&auto=format',
    featured: false,
    size: 'medium',
    content: `There was a stretch of about six weeks last semester where I averaged maybe five hours of sleep a night. Not because I was being disciplined — because I kept saying "one more hour" until suddenly it was 3am.

I'm writing this partly as a record, partly as a warning to myself for next time.

## What actually happened

My grades didn't collapse. My performance looked fine from the outside. But internally I was running on a kind of hollow energy — the kind that gets things done but doesn't retain them. I read papers and forgot them. I had conversations and couldn't recall them an hour later.

The worst part was the emotional flatness. Nothing felt particularly bad, but nothing felt particularly good either. Just neutral, slightly tired, getting through it.

<blockquote>Sleep deprivation doesn't make you fail. It makes you succeed badly — efficiently moving through experiences without actually having them.</blockquote>

## What helped

Three things, in order of impact: stopping caffeine after 2pm, keeping my room genuinely dark, and — surprisingly — writing in my journal before bed instead of looking at my phone.`,
  },
  {
    id: 4,
    title: 'The forest path I walk every Sunday',
    excerpt: 'A short photo essay from my weekly walk through the woods near campus.',
    category: 'Personal',
    date: 'June 21, 2026',
    readTime: '3 min',
    tags: ['photography', 'nature', 'weekly'],
    image: 'https://images.unsplash.com/photo-1597201423947-3e0028337902?w=800&h=1000&fit=crop&auto=format',
    featured: false,
    size: 'tall',
    content: `Every Sunday morning, weather permitting, I walk the same 4km loop through the forest near campus. I've done it maybe sixty times now. It's never exactly the same.

This is a small record of one of those walks — July 6th, overcast, a light breeze from the east.

The path starts at a gap in a low stone wall. There's no sign. You just have to know it's there, or stumble into it. I stumbled into it in my first week here and kept coming back.

<blockquote>I don't bring headphones. The point is specifically to not be entertained — to let the mind do whatever it wants to do with silence and trees.</blockquote>

About a kilometer in, the path opens into a small clearing that catches morning light when there is any. On overcast days like this one, it's just a slightly brighter gray — but still distinct enough to feel like a pause.

I always stop there for a few minutes. Sometimes I take a photo. Sometimes I just stand and look and let the week finish dissolving.`,
  },
  {
    id: 5,
    title: 'Notes on learning Rust after years of Python',
    excerpt: 'The ownership model broke my brain in exactly the ways it was supposed to.',
    category: 'Programming',
    date: 'June 10, 2026',
    readTime: '9 min',
    tags: ['rust', 'python', 'learning'],
    image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&h=500&fit=crop&auto=format',
    featured: false,
    size: 'medium',
    content: `I'd been meaning to learn Rust for two years. The barrier wasn't motivation — it was the sense that I'd need to unlearn things, and unlearning is harder than learning.

I was right. It was harder. And worth it.

## The ownership model

The first week was mostly frustration. The borrow checker rejected code that felt obviously correct. I kept writing Python in my head and translating it into Rust syntax, which is entirely the wrong approach.

\`\`\`rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // s1 is moved, no longer valid
    // println!("{}", s1); // This would fail to compile
    println!("{}", s2);
}
\`\`\`

The compiler error messages are genuinely excellent — they don't just tell you what's wrong, they often tell you what to do instead. After a few days of reading them carefully, I started to understand what the model was actually protecting me from.

<blockquote>Rust doesn't prevent you from making mistakes by restricting what you can express — it prevents them by making the implications of what you're expressing explicit.</blockquote>

## What changed after two weeks

The frustration faded around week two, replaced by something that felt like respect. The language was asking me to think about things I'd always left implicit, and once I started thinking about them, I couldn't un-see them even in my Python code.`,
  },
  {
    id: 6,
    title: 'City walks and what they teach',
    excerpt: 'I\'ve started walking without a destination. Here\'s what I\'ve been finding.',
    category: 'Ideas',
    date: 'May 25, 2026',
    readTime: '4 min',
    tags: ['cities', 'wandering', 'observation'],
    image: 'https://images.unsplash.com/photo-1488034976201-ffbaa99cbf5c?w=800&h=600&fit=crop&auto=format',
    featured: false,
    size: 'medium',
    content: `I started taking long walks without a destination sometime in April. Not for exercise, not for podcasts — just walking and paying attention to what I pass.

The city is stranger up close than it looks from a moving vehicle. The storefront that's been boarded up for three years but still has the original menu taped inside the window. The back alley that opens unexpectedly into a small garden someone planted and tends without any sign explaining why.

<blockquote>Walking without a purpose gives the city permission to surprise you. When you're headed somewhere, everything else is an obstacle. When you're not, everything is a discovery.</blockquote>

## What I've been noticing

The texture of a city is its small decisions. The way someone painted their front door a very specific shade of green. The handwritten sign in a window that's been there so long it's faded to near-illegibility. The cat that sits in the same spot every afternoon at the same bookshop.

These things accumulate into something that isn't exactly knowledge but is adjacent to it — a feeling of having genuinely seen a place rather than merely been in it.`,
  },
  {
    id: 7,
    title: 'A strange afternoon in the university library',
    excerpt: 'Found a section I\'d never noticed. Spent three hours in it.',
    category: 'Random',
    date: 'May 12, 2026',
    readTime: '3 min',
    tags: ['books', 'discovery', 'library'],
    image: 'https://images.unsplash.com/photo-1600818797017-d6e5027210bb?w=800&h=500&fit=crop&auto=format',
    featured: false,
    size: 'small',
    content: `The east wing of the library has a section on the history of scientific illustration — anatomical drawings, botanical plates, maps of coastlines that were never entirely accurate. I found it by accident, following a call number that led me to the wrong shelf.

I stayed for three hours.

There's something about historical illustration that stops me. The combination of scientific intent and manual craft. The knowledge that someone spent weeks rendering a single plant or bone or coastline with absolute attention, knowing the image would outlast them.

<blockquote>Before photography, accuracy required patience. The illustration was the instrument of record.</blockquote>

I borrowed two of the volumes. They're currently sitting on my desk next to my laptop, slightly incongruous — the handmade next to the machined.`,
  },
  {
    id: 8,
    title: 'Three months with the same daily todo list format',
    excerpt: 'An experiment in reducing friction by removing choice from the daily planning process.',
    category: 'Lessons',
    date: 'April 29, 2026',
    readTime: '5 min',
    tags: ['productivity', 'systems', 'habits'],
    image: 'https://images.unsplash.com/photo-1654785419681-6f8415d8ec6d?w=800&h=600&fit=crop&auto=format',
    featured: false,
    size: 'medium',
    content: `For the last three months I've used exactly the same format for my daily list: three columns, three rows, no more than nine items total, grouped by context.

The constraint was intentional. I used to spend too long deciding how to organize my list each morning, which is a beautifully efficient way to feel busy while doing nothing useful.

## The format

\`\`\`
[ deep work ]    [ admin ]    [ personal ]
   task 1            task 4       task 7
   task 2            task 5       task 8
   task 3            task 6       task 9
\`\`\`

Deep work: things that require sustained focus — writing, building, reading closely.
Admin: email, logistics, scheduling.
Personal: health, relationships, things that make me a person rather than a productivity object.

<blockquote>Nine items. Three per column. If it doesn't fit in nine items, it's not today's problem.</blockquote>

The results were quietly significant. I stopped carrying guilt about undone tasks as much, because the format made it structurally clear that I'd made explicit choices about what today was for.`,
  },
] as unknown as AdminPost[];

const THOUGHTS = [
  { id: 1, text: 'The best way to understand something is to try to explain it to someone who doesn\'t already agree with you.', date: 'Aug 3', tags: ['ideas'] },
  { id: 2, text: 'I\'ve started measuring the quality of a week not by what I finished but by whether I had at least one genuinely uninterrupted hour of thinking.', date: 'Jul 29', tags: ['productivity', 'habits'] },
  { id: 3, text: 'Rust makes you feel dumb in exactly the right ways.', date: 'Jul 22', tags: ['programming'] },
  { id: 4, text: 'There\'s a version of being productive that is just a way of avoiding the thing you actually need to do. I live there sometimes.', date: 'Jul 17', tags: ['reflection'] },
  { id: 5, text: 'The best codebases read like they were written by someone who didn\'t need to prove anything.', date: 'Jul 9', tags: ['programming', 'craft'] },
  { id: 6, text: 'Reading before bed is the closest thing I have to a consistent practice. Everything else in my life is negotiable. This is not.', date: 'Jul 4', tags: ['books', 'habits'] },
  { id: 7, text: 'I keep starting projects and stopping them. I\'ve decided this is research, not failure.', date: 'Jun 27', tags: ['projects', 'ideas'] },
  { id: 8, text: 'A problem you understand well enough to explain simply is almost never as hard as it looked from a distance.', date: 'Jun 20', tags: ['ideas'] },
  { id: 9, text: 'College is mostly about learning how to exist in proximity to people who think differently than you. The coursework is secondary.', date: 'Jun 13', tags: ['college', 'reflection'] },
  { id: 10, text: 'I\'ve been trying to stop using the word "basically" when I don\'t understand something basically at all.', date: 'Jun 8', tags: ['language', 'honesty'] },
  { id: 11, text: 'The city looks completely different at 6am. I recommend it at least once.', date: 'Jun 1', tags: ['cities'] },
]

const PROJECTS = [
  {
    id: 1,
    name: 'Bookmark Curator',
    description: 'A Python script that reads exported browser bookmarks, scores them by relevance to a set of current interests, and surfaces the most useful ones.',
    tech: ['Python', 'BeautifulSoup', 'CLI'],
    category: 'Automation',
    status: 'Active',
    date: 'Jun 2026',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=700&h=450&fit=crop&auto=format',
    link: '#',
  },
  {
    id: 2,
    name: 'Journal CLI',
    description: 'A terminal-based journaling tool that stores entries as plain markdown files, supports tagging, full-text search, and a weekly review prompt.',
    tech: ['Python', 'Typer', 'Markdown'],
    category: 'Personal Tools',
    status: 'Active',
    date: 'Apr 2026',
    image: 'https://images.unsplash.com/photo-1654785419449-7f0a9383a4fe?w=700&h=450&fit=crop&auto=format',
    link: '#',
  },
  {
    id: 3,
    name: 'Trail Notes',
    description: 'A minimal web app for logging and mapping weekly walks, storing route notes and photos. Built as an experiment in local-first data.',
    tech: ['React', 'TypeScript', 'SQLite (WASM)'],
    category: 'Web Development',
    status: 'Experimenting',
    date: 'Mar 2026',
    image: 'https://images.unsplash.com/photo-1597201423947-3e0028337902?w=700&h=450&fit=crop&auto=format',
    link: '#',
  },
  {
    id: 4,
    name: 'Reading Log',
    description: 'A tiny Rust CLI that parses my reading notes (plain text) and generates a structured archive with stats, themes, and cross-references.',
    tech: ['Rust', 'TOML', 'CLI'],
    category: 'Experiments',
    status: 'In Progress',
    date: 'Feb 2026',
    image: 'https://images.unsplash.com/photo-1414124488080-0188dcbb8834?w=700&h=450&fit=crop&auto=format',
    link: '#',
  },
  {
    id: 5,
    name: 'Headline Lens',
    description: 'An AI-assisted tool that reads RSS feeds and extracts patterns across headlines — useful for noticing how a story\'s framing shifts over time.',
    tech: ['Python', 'OpenAI API', 'FastAPI'],
    category: 'AI',
    status: 'Paused',
    date: 'Jan 2026',
    image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=700&h=450&fit=crop&auto=format',
    link: '#',
  },
  {
    id: 6,
    name: 'Daily Format',
    description: 'A minimal, opinionated todo app that enforces a 9-item three-column structure. No features. Just the format.',
    tech: ['React', 'localStorage'],
    category: 'Personal Tools',
    status: 'Complete',
    date: 'Dec 2025',
    image: 'https://images.unsplash.com/photo-1654785419681-6f8415d8ec6d?w=700&h=450&fit=crop&auto=format',
    link: '#',
  },
]

const CATEGORIES = ['All', 'Personal', 'Technology', 'Programming', 'Projects', 'College', 'Ideas', 'Lessons', 'Random']

// ─── Journal Page ────────────────────────────────────────────────────────────
function JournalPage({ setPage, setPost, extraPosts = INITIAL_POSTS, onDelete }: { setPage: (p: string) => void; setPost: (p: any) => void; extraPosts?: any[]; onDelete?: (id: string | number) => void; }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const filtered = (extraPosts || []).filter((p: any) => {
    if (!p) return false
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory
    const q = query.toLowerCase()
    
    const matchesTitle = p.title?.toLowerCase().includes(q)
    const matchesExcerpt = p.excerpt?.toLowerCase().includes(q)
    const matchesTags = Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase().includes(q))
    
    const matchesQuery = !q || matchesTitle || matchesExcerpt || matchesTags
    return matchesCategory && matchesQuery
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <div className="fade-in mb-10">
        <span className="category-label">Archive</span>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold mt-2 mb-3" style={{ color: 'var(--foreground)' }}>Journal</h1>
        <p className="text-base font-light" style={{ color: 'var(--muted-foreground)' }}>
          Things I've written down so I don't forget them.
        </p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--muted-foreground)' }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="w-full pl-9 pr-4 py-2 text-sm rounded-[6px] outline-none focus:ring-1"
            style={{
              background: 'var(--muted)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
            }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-3 py-1.5 text-xs font-mono rounded-[4px] border transition-all"
            style={{
              borderColor: activeCategory === cat ? 'var(--accent)' : 'var(--border)',
              backgroundColor: activeCategory === cat ? 'var(--accent)' : 'transparent',
              color: activeCategory === cat ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-xs font-mono mb-6" style={{ color: 'var(--muted-foreground)' }}>
        {filtered.length} {filtered.length === 1 ? 'post' : 'posts'}
      </p>

      <div className="masonry-grid stagger">
        {filtered.map(p => (
        <div key={p.id}>
          <PostCard key={p.id} post={p} onClick={() => { setPost(p); setPage('Post') }} />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("Delete this journal post?")) {
                onDelete?.(p.id);
              }
            }}
            className="text-xs font-mono text-red-500 hover:text-red-700 mt-2 text-right block w-full"
          >
            🗑 Delete
          </button>
        </div>
      ))}
        {filtered.length === 0 && (
          <p className="font-serif italic text-lg" style={{ color: 'var(--muted-foreground)' }}>Nothing matches that search.</p>
        )}
      </div>
    </div>
  )
}
// ─── Helpers ────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: 'bg-[#8B9E7E]/15 text-[#6A7E5E]',
    'In Progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Experimenting: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    Paused: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
    Complete: 'bg-[#8B9E7E]/15 text-[#6A7E5E]',
  }
  return (
    <span className={`inline-block text-[0.65rem] font-mono tracking-widest uppercase px-2 py-0.5 rounded-[3px] ${map[status] ?? ''}`}>
      {status}
    </span>
  )
}

// Helper function to trigger a file download in the browser
function downloadMarkdownFile(title: string, content: string) {
  const fileData = `# ${title}\n\n${content}`
  const blob = new Blob([fileData], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess
}: {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: (user: { email: string; username: string }) => void
}) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
    
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'login' ? { email, password } : { email, password, username })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Authentication failed')

      if (mode === 'register') {
        setMode('login')
        setError('Account created! Please log in.')
      } else {
        onLoginSuccess(data.user)
        onClose()
      }
    } catch (err: any) {
      // Offline fallback strategy
      if (mode === 'login') {
        onLoginSuccess({ email, username: email.split('@')[0] || 'User' })
        onClose()
      } else {
        setError(err.message || 'Error connecting to backend')
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="w-full max-w-md rounded-lg p-6 shadow-2xl"
        style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
      >
        <div className="flex items-center justify-between border-b pb-3 mb-5" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-serif text-xl font-semibold">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <button onClick={onClose} className="text-lg opacity-60 hover:opacity-100">✕</button>
        </div>

        {error && <p className="text-xs font-mono text-amber-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-mono uppercase mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full p-2.5 rounded border text-sm"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2.5 rounded border text-sm"
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2.5 rounded border text-sm"
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
          </div>

          <button
            type="submit"
            className="mt-2 py-2.5 rounded text-sm font-mono font-medium text-white bg-[#8B9E7E] hover:opacity-90"
          >
            {mode === 'login' ? 'Sign In' : 'Register'}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t text-center text-xs" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="opacity-70 hover:opacity-100 font-mono"
          >
            {mode === 'login' ? "Don't have an account? Register" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  )
}

function CreatePostModal({
  isOpen,
  onClose,
  onSave
}: {
  isOpen: boolean
  onClose: () => void
  onSave: (newPost: any) => void
}) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Personal')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')
  const [tags, setTags] = useState('')
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newPost = {
      id: Date.now(),
      title,
      category,
      excerpt,
      content,
      image: image || 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&h=600&fit=crop&auto=format',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: `${Math.max(1, Math.ceil(content.split(' ').length / 200))} min`,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      status: 'published',
      visibility: 'public',
      size: 'medium',
      featured: false
    }

    try {
      await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      })
    } catch { /* Fallback to local execution */ }

    onSave(newPost)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg p-6 shadow-2xl"
        style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
      >
        <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-serif text-2xl font-semibold">Draft New Post</h2>
          <button onClick={onClose} className="text-xl opacity-60 hover:opacity-100">✕</button>
        </div>

        <div className="flex gap-4 border-b mb-6 text-sm font-mono" style={{ borderColor: 'var(--border)' }}>
          <button 
            className={`pb-2 ${activeTab === 'write' ? 'border-b-2 font-semibold' : 'opacity-60'}`}
            style={{ borderColor: 'var(--accent)' }}
            onClick={() => setActiveTab('write')}
          >
            Editor
          </button>
          <button 
            className={`pb-2 ${activeTab === 'preview' ? 'border-b-2 font-semibold' : 'opacity-60'}`}
            style={{ borderColor: 'var(--accent)' }}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
        </div>

        {activeTab === 'write' ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-mono uppercase mb-1">Post Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="An intriguing headline..."
                className="w-full p-2.5 rounded border text-sm"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded border text-sm"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                >
                  {['Personal', 'Projects', 'College', 'Programming', 'Ideas', 'Lessons', 'Random'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
              <label className="block mb-1 text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>
                Cover Image (URL or Upload)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 p-2.5 border rounded text-sm outline-none"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
                <label 
                  className="cursor-pointer px-3 py-2.5 text-xs font-mono rounded border shrink-0 transition-opacity hover:opacity-80 flex items-center justify-center"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                >
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setImage(reader.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase mb-1">Excerpt</label>
              <input
                type="text"
                required
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                placeholder="Brief 1-2 sentence summary..."
                className="w-full p-2.5 rounded border text-sm"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="react, python, design"
                className="w-full p-2.5 rounded border text-sm"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase mb-1">Content (Markdown Supported)</label>
              <textarea
                required
                rows={10}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write your article body here..."
                className="w-full p-3 rounded border text-sm font-mono leading-relaxed"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>

            {/* APPEND INSIDE DRAFT MODAL FORM */}
            <div className="mb-4">
              <label className="block text-xs font-mono mb-2" style={{ color: 'var(--muted-foreground)' }}>
                Publish To:
              </label>
              <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 text-sm rounded border bg-transparent font-mono"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <option value="Journal">Journal Page</option>
                <option value="Projects">Projects Page</option>
                <option value="Thoughts">Thoughts Page</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-4 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded text-sm font-mono border"
                style={{ borderColor: 'var(--border)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded text-sm font-mono font-medium text-white bg-[#8B9E7E] hover:opacity-90"
              >
                Publish Post
              </button>
            </div>
          </form>
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            <h1 className="font-serif text-3xl font-semibold mb-2">{title || 'Untitled Post'}</h1>
            <p className="text-sm italic mb-6" style={{ color: 'var(--muted-foreground)' }}>{excerpt}</p>
            <div className="whitespace-pre-wrap leading-relaxed text-sm">{content || 'No content written yet.'}</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Nav ────────────────────────────────────────────────────────────────────

function Nav({ page, setPage, dark, setDark, currentUser, onOpenAuth }: {
  page: string
  setPage: (p: string) => void
  dark: boolean
  setDark: (d: boolean) => void
  currentUser: { email: string; username: string } | null
  onOpenAuth: () => void
}) {
  const [open, setOpen] = useState(false)
  const links = ['Home', 'Journal', 'Projects', 'Thoughts', 'About']

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => { setPage('Home'); setOpen(false) }}
          className="font-serif font-semibold text-base tracking-tight hover:opacity-70 transition-opacity"
          style={{ color: 'var(--foreground)' }}
        >
          Le.Scribere
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <button
              key={l}
              onClick={() => setPage(l)}
              className={`nav-link text-sm font-light ${page === l ? 'active' : ''}`}
              style={{ color: page === l ? 'var(--foreground)' : 'var(--muted-foreground)' }}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Auth Button */}
          <button
            onClick={onOpenAuth}
            className="text-xs font-mono px-3 py-1.5 rounded border hover:opacity-80 transition-opacity"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            {currentUser ? currentUser.username : 'Login'}
          </button>

          {/* Dark mode */}
          <button
            onClick={() => setDark(!dark)}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:opacity-70"
            style={{ color: 'var(--muted-foreground)' }}
            aria-label="Toggle dark mode"
          >
            {dark ? (
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <span className={`block h-px w-5 transition-all ${open ? 'rotate-45 translate-y-1.5' : ''}`} style={{ background: 'var(--foreground)' }} />
            <span className={`block h-px w-5 transition-all ${open ? 'opacity-0' : ''}`} style={{ background: 'var(--foreground)' }} />
            <span className={`block h-px w-5 transition-all ${open ? '-rotate-45 -translate-y-1.5' : ''}`} style={{ background: 'var(--foreground)' }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t px-6 py-4 flex flex-col gap-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
          {links.map(l => (
            <button
              key={l}
              onClick={() => { setPage(l); setOpen(false) }}
              className="text-sm text-left font-light"
              style={{ color: page === l ? 'var(--accent)' : 'var(--foreground)' }}
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

// ─── Post Card ───────────────────────────────────────────────────────────────

function PostCard({ post, onClick, variant = 'default' }: {
  post: typeof INITIAL_POSTS[0]
  onClick: () => void
  variant?: 'default' | 'featured' | 'small'
}) {
  if (variant === 'featured') {
    return (
      <button
        onClick={onClick}
        className="block w-full text-left card-hover rounded-[8px] overflow-hidden"
        style={{ border: '1px solid var(--border)' }}
      >
        <div className="overflow-hidden img-zoom" style={{ height: 320, background: 'var(--muted)' }}>
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-6" style={{ backgroundColor: 'var(--card)' }}>
          <span className="category-label">{post.category}</span>
          <h2 className="font-serif text-2xl font-semibold mt-2 mb-3 leading-snug" style={{ color: 'var(--foreground)' }}>
            {post.title}
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted-foreground)' }}>{post.excerpt}</p>
          <div className="flex items-center gap-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
            <span>{post.date}</span>
            <span style={{ color: 'var(--border)' }}>·</span>
            <span>{post.readTime} read</span>
          </div>
        </div>
      </button>
    )
  }

  if (variant === 'small') {
    return (
      <button onClick={onClick} className="block w-full text-left card-hover py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <span className="category-label">{post.category}</span>
        <h3 className="font-serif font-medium mt-1 mb-1.5 leading-snug text-base" style={{ color: 'var(--foreground)' }}>
          {post.title}
        </h3>
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
          <span>{post.date}</span><span>·</span><span>{post.readTime}</span>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className="block w-full text-left masonry-item card-hover rounded-[6px] overflow-hidden"
      style={{ border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
    >
      {post.image && (
        <div className="overflow-hidden img-zoom" style={{ background: 'var(--muted)' }}>
          <img
            src={post.image}
            alt={post.title}
            className="w-full object-cover"
            style={{ height: post.size === 'tall' ? 280 : post.size === 'large' ? 220 : 160 }}
          />
        </div>
      )}
      <div className="p-4">
        <span className="category-label">{post.category}</span>
        <h3 className="font-serif font-medium mt-1.5 mb-2 leading-snug" style={{ color: 'var(--foreground)', fontSize: post.size === 'large' ? '1.15rem' : '1rem' }}>
          {post.title}
        </h3>
        {post.size !== 'small' && (
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--muted-foreground)', fontSize: '0.825rem' }}>
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.slice(0, 3).map(t => (
              <span key={t} className="tag-chip">{t}</span>
            ))}
          </div>
        )}
      </div>
    </button>
  )
}

function PostPage({ post, setPage }: { post: typeof INITIAL_POSTS[0]; setPage: (p: string) => void }) {
  if (!post) return null

  return (
    <article className="max-w-3xl mx-auto px-6 py-14">
      {/* Back button and Download button */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setPage('Home')} className="text-xs font-mono opacity-70 hover:opacity-100">
          ← Back to home
        </button>

        <button
          onClick={() => downloadMarkdownFile(post.title, post.content)}
          className="flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-mono transition-opacity hover:opacity-80"
          style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
        >
          📥 Download .md
        </button>
      </div>

      <h1 className="font-serif text-4xl font-semibold mb-4">{post.title}</h1>
      <p className="text-lg leading-relaxed opacity-70 mb-8">{post.excerpt}</p>
      
      {/* Article Content */}
      <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
        {post.content}
      </div>
    </article>
  )
}

function HomePage({ setPage, setPost, extraPosts = INITIAL_POSTS }: { setPage: (p: string) => void; setPost: (p: typeof INITIAL_POSTS[0]) => void; extraPosts?: typeof INITIAL_POSTS }) {
  const allPosts = extraPosts
  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      {/* Hero */}
      <div className="fade-in mb-16 max-w-2xl">
        <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--accent)' }}>
          — Writing from The Philippines
        </p>
        <h1 className="font-serif text-5xl md:text-6xl font-semibold leading-[1.1] mb-5" style={{ color: 'var(--foreground)' }}>
          Welcome to my<br /><em>corner of the internet.</em>
        </h1>
        <p className="text-base font-light leading-relaxed max-w-xl" style={{ color: 'var(--muted-foreground)' }}>
          Thoughts, experiments, projects, lessons, and everything I happen to find interesting. Updated irregularly, but honestly.
        </p>
        <div className="flex items-center gap-4 mt-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8B9E7E] animate-pulse inline-block" />
            <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
              Currently learning Rust &amp; building in public
            </span>
          </div>
        </div>
      </div>

      {/* Featured */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--accent)' }}>Featured</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {allPosts[0] && (
            <PostCard
              post={allPosts[0]}
              onClick={() => { setPost(allPosts[0]); setPage('Post') }}
              variant="featured"
            />
          )}
          <div className="flex flex-col gap-0">
            {allPosts.slice(1, 5).map(p => (
              <PostCard key={p.id} post={p} onClick={() => { setPost(p); setPage('Post') }} variant="small" />
            ))}
          </div>
        </div>
      </div>

      {/* Masonry feed */}
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--accent)' }}>Recent Posts</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          <button onClick={() => setPage('Journal')} className="text-xs font-mono hover:opacity-70 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
            All posts →
          </button>
        </div>
        <div className="masonry-grid stagger">
          {allPosts.map(p => (
            <PostCard key={p.id} post={p} onClick={() => { setPost(p); setPage('Post') }} />
          ))}
        </div>
      </div>

      {/* Thoughts strip */}
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--accent)' }}>Recent Thoughts</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          <button onClick={() => setPage('Thoughts')} className="text-xs font-mono hover:opacity-70 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
            All thoughts →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger">
          {THOUGHTS.slice(0, 3).map(t => (
            <div key={t.id} className="p-5 rounded-[6px] card-hover" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
              <p className="font-serif italic text-base leading-relaxed mb-3" style={{ color: 'var(--foreground)' }}>
                "{t.text}"
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{t.date}</span>
                <div className="flex gap-1.5">
                  {t.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="tag-chip">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects preview */}
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--accent)' }}>Projects</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          <button onClick={() => setPage('Projects')} className="text-xs font-mono hover:opacity-70 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
            View all →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger">
          {PROJECTS.slice(0, 3).map(proj => (
            <div key={proj.id} className="card-hover rounded-[6px] overflow-hidden" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
              <div className="img-zoom overflow-hidden" style={{ height: 140, background: 'var(--muted)' }}>
                <img src={proj.image} alt={proj.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif font-medium text-base" style={{ color: 'var(--foreground)' }}>{proj.name}</h3>
                  <StatusBadge status={proj.status} />
                </div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--muted-foreground)' }}>{proj.description}</p>
                <div className="flex flex-wrap gap-1">
                  {proj.tech.map(t => (
                    <span key={t} className="tag-chip">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main App Shell ───────────────────────────────────────────────────────────

function AboutPage({ currentUser, setCurrentUser }: { currentUser: UserProfile | null; setCurrentUser: (user: UserProfile) => void }) {
  const [isEditing, setIsEditing] = useState(false)

  const userProfileKey = currentUser ? `blog_user_profile_${currentUser.email}` : 'blog_user_profile';

  useEffect(() => {
    try {
      const saved = localStorage.getItem(userProfileKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCurrentUser(parsed);
        setFormData(parsed);
      }
    } catch { /* ignore */ }
  }, [currentUser?.email]);

  const profile: UserProfile = currentUser || {
    email: 'user@example.com',
    username: 'LOGIN',
    displayName: 'Add your name',
    locationRole: 'Location / Roles',
    bio1: 'Add your Bio 1',
    bio2: 'Add your Bio 2',
    avatarUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    currently: [
      'Quae sunt istae imposturae et doli quos clam in tenebris paras',
      'Quid nam hoc tempore machinaris ut omnes ludos tui causa facias',
      'Quae sunt istae nugae ineptiaeque quibus tempus nostrum cotidie teris',
      'Quid mali ac calliditatis in illo animo tuo subdolo rursus occultas'
    ],
    learning: [
      'Varias res discere mentem excolit',
      'Cottidie res novas ac diversas disco',
      'Multas disciplinas cognoscere studeo',
      'Diversae res intellectum nostrum acuunt'
    ],
    techStack: ['Add your favourites'],
    philosophy: '"Build things you\'d actually use. Write things you\'d actually want to read. Walk somewhere without a destination at least once a week."',
    milestones: [
    { year: '2024', text: 'Hic mei progressus notantur.', color: '#8B9E7E' },
    { year: '2024', text: 'Mea gesta hic perscripta sunt', color: '#8B9E7E' },
    { year: '2025', text: 'Indices meorum successuum hic patent', color: '#8B9E7E' },
    { year: '2025', text: 'Hic habes metas a me tactas', color: '#8B9E7E' },
    { year: '2026', text: 'Mei honores hic enumerati sunt', color: '#8B9E7E' }
]
  }

  const [formData, setFormData] = useState<UserProfile>(profile)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser(formData);
    localStorage.setItem(userProfileKey, JSON.stringify(formData));
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <span className="category-label">A PERSON</span>
        <button 
          onClick={() => { setFormData(profile); setIsEditing(true); }}
          className="text-xs font-mono px-3 py-1.5 rounded border transition-colors hover:bg-stone-200 dark:hover:bg-stone-800"
          style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
        >
          Edit Profile
        </button>
      </div>

      <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-10" style={{ color: 'var(--foreground)' }}>
        About Me
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-14">
        <div className="md:col-span-4">
          <img 
            src={profile.avatarUrl} 
            alt={profile.displayName} 
            className="w-full aspect-square object-cover rounded-xl shadow-sm border"
            style={{ borderColor: 'var(--border)' }}
          />
        </div>
        <div className="md:col-span-8 space-y-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>{profile.displayName}</h2>
            <p className="text-xs font-mono mt-1" style={{ color: 'var(--muted-foreground)' }}>{profile.locationRole}</p>
          </div>
          <p className="text-sm leading-relaxed font-light" style={{ color: 'var(--muted-foreground)' }}>{profile.bio1}</p>
          <p className="text-sm leading-relaxed font-light" style={{ color: 'var(--muted-foreground)' }}>{profile.bio2}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
        <div className="p-6 rounded-xl" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
          <h3 className="category-label mb-4">CURRENTLY</h3>
          <ul className="space-y-2.5 text-xs font-light" style={{ color: 'var(--muted-foreground)' }}>
            {profile.currently.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-xl" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
          <h3 className="category-label mb-4">THINGS I'M LEARNING</h3>
          <ul className="space-y-2.5 text-xs font-light" style={{ color: 'var(--muted-foreground)' }}>
            {profile.learning.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-xl" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
          <h3 className="category-label mb-4">FAVOURITE TECHNOLOGIES</h3>
          <div className="flex flex-wrap gap-2">
            {profile.techStack.map((tech) => (
              <span key={tech} className="tag-chip" style={{ fontSize: '0.7rem' }}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl flex flex-col justify-between" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
          <h3 className="category-label mb-4">PERSONAL PHILOSOPHY</h3>
          <p className="font-serif italic text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
            {profile.philosophy}
          </p>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="category-label mb-6">MILESTONES</h3>
        <div className="space-y-4">
          {profile.milestones.map((ms, i) => (
            <div key={i} className="flex items-center gap-6 text-xs">
              <span className="font-mono w-10 text-right" style={{ color: 'var(--muted-foreground)' }}>{ms.year}</span>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ms.color || '#8B9E7E' }} />
              <span className="font-light" style={{ color: 'var(--foreground)' }}>{ms.text}</span>
            </div>
          ))}
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="border rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
            <h2 className="text-xl font-serif font-semibold mb-6" style={{ color: 'var(--foreground)' }}>Edit Profile Page</h2>
            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1" style={{ color: 'var(--muted-foreground)' }}>Display Name</label>
                  <input type="text" value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} className="w-full p-2 border rounded outline-none" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                </div>
                <div>
                  <label className="block mb-1" style={{ color: 'var(--muted-foreground)' }}>Location & Role</label>
                  <input type="text" value={formData.locationRole} onChange={e => setFormData({...formData, locationRole: e.target.value})} className="w-full p-2 border rounded outline-none" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                </div>
              </div>

                <div>
                <label className="block mb-1" style={{ color: 'var(--muted-foreground)' }}>
                Avatar Image URL or Upload
                </label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={formData.avatarUrl} 
                    onChange={e => setFormData({...formData, avatarUrl: e.target.value})} 
                    className="flex-1 p-2 border rounded outline-none text-xs" 
                    style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }} 
                    placeholder="https://..."
                  />
                  <label 
                    className="cursor-pointer px-3 py-2 text-xs font-mono rounded border shrink-0 transition-opacity hover:opacity-80 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  >
                    Upload
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }))
                          }
                          reader.readAsDataURL(file)
                        }
                      }} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block mb-1" style={{ color: 'var(--muted-foreground)' }}>Bio Paragraph 1</label>
                <textarea rows={2} value={formData.bio1} onChange={e => setFormData({...formData, bio1: e.target.value})} className="w-full p-2 border rounded outline-none font-sans text-xs" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>

              <div>
                <label className="block mb-1" style={{ color: 'var(--muted-foreground)' }}>Bio Paragraph 2</label>
                <textarea rows={2} value={formData.bio2} onChange={e => setFormData({...formData, bio2: e.target.value})} className="w-full p-2 border rounded outline-none font-sans text-xs" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>

              <div>
                <label className="block mb-1" style={{ color: 'var(--muted-foreground)' }}>Currently List (comma-separated)</label>
                <input type="text" value={formData.currently.join(', ')} onChange={e => setFormData({...formData, currently: e.target.value.split(',').map(s => s.trim())})} className="w-full p-2 border rounded outline-none" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>

              <div>
                <label className="block mb-1" style={{ color: 'var(--muted-foreground)' }}>Learning List (comma-separated)</label>
                <input type="text" value={formData.learning.join(', ')} onChange={e => setFormData({...formData, learning: e.target.value.split(',').map(s => s.trim())})} className="w-full p-2 border rounded outline-none" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>

              <div>
                <label className="block mb-1" style={{ color: 'var(--muted-foreground)' }}>Technologies (comma-separated)</label>
                <input type="text" value={formData.techStack.join(', ')} onChange={e => setFormData({...formData, techStack: e.target.value.split(',').map(s => s.trim().toUpperCase())})} className="w-full p-2 border rounded outline-none" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>

              <div>
                <label className="block mb-1" style={{ color: 'var(--muted-foreground)' }}>Personal Philosophy</label>
                <textarea rows={2} value={formData.philosophy} onChange={e => setFormData({...formData, philosophy: e.target.value})} className="w-full p-2 border rounded outline-none font-serif italic text-xs" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>

              <div className="space-y-3 mt-4">

              <label className="block text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                Milestones
              </label>
              {formData.milestones.map((ms, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ms.year}
                    onChange={(e) => {
                      const updated = [...formData.milestones]
                      updated[index].year = e.target.value
                      setFormData({ ...formData, milestones: updated })
                    }}
                    placeholder="Year"
                    className="w-16 px-2 py-1 text-xs rounded border outline-none"
                    style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                  <input
                    type="text"
                    value={ms.text}
                    onChange={(e) => {
                      const updated = [...formData.milestones]
                      updated[index].text = e.target.value
                      setFormData({ ...formData, milestones: updated })
                    }}
                    placeholder="Event description"
                    className="flex-1 px-2 py-1 text-xs rounded border outline-none"
                    style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                  <input
                    type="color"
                    value={ms.color || '#8B9E7E'}
                    onChange={(e) => {
                      const updated = [...formData.milestones]
                      updated[index].color = e.target.value
                      setFormData({ ...formData, milestones: updated })
                    }}
                    className="w-7 h-7 p-0 border-0 rounded cursor-pointer bg-transparent shrink-0"
                    title="Choose dot color"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.milestones.filter((_, i) => i !== index)
                      setFormData({ ...formData, milestones: updated })
                    }}
                    className="text-xs text-red-500 hover:opacity-70 px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    milestones: [...formData.milestones, { year: '2026', text: 'New milestone', color: '#8B9E7E' }]
                  })
                }}
                className="text-xs font-mono hover:opacity-70 mt-1 block"
                style={{ color: 'var(--accent)' }}
              >
                + Add Milestone
              </button>
            </div>

              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2" style={{ color: 'var(--muted-foreground)' }}>Cancel</button>
                <button type="submit" className="px-4 py-2 border rounded font-bold" style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('Home')
  const [dark, setDark] = useState(false)
  const [selectedPost, setSelectedPost] = useState<typeof INITIAL_POSTS[0] | null>(null)

  // Dynamic posts state and modal visibility
  const [posts, setPosts] = useState(INITIAL_POSTS)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)

// User-scoped key: null when logged out, unique key when logged in
const storageKey = currentUser ? `blog_deleted_ids_${currentUser.email}` : null;
  const [deletedIds, setDeletedIds] = useState<Array<string | number>>(() => {
    if (currentUser && storageKey) {
      try {
        return JSON.parse(localStorage.getItem(storageKey) || '[]');
      } catch {
        return [];
      }
    }
    return [];
  });

  // Re-sync deleted IDs whenever auth state changes
  useEffect(() => {
    if (currentUser && storageKey) {
      try {
        setDeletedIds(JSON.parse(localStorage.getItem(storageKey) || '[]'));
      } catch {
        setDeletedIds([]);
      }
    } else {
      setDeletedIds([]);
    }
  }, [currentUser, storageKey]);

  const handleDeletePost = (id: string | number) => {
    setDeletedIds((prev) => {
      const updated = [...prev, id];
      // Only persist to localStorage if an account is logged in
      if (currentUser && storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      return updated;
    });
    setPosts((prevPosts: any[]) => prevPosts.filter((p: any) => p.id !== id));
  };

useEffect(() => {
  if (currentUser) {
    try {
      const userKey = `blog_admin_posts_${currentUser.email}`;
      const saved = JSON.parse(localStorage.getItem(userKey) || '[]');
      if (saved.length > 0) {
        setPosts((prev) => [...saved, ...prev]);
      }
    } catch { /* ignore */ }
  }
}, [currentUser]);

  const handleSavePost = (newPost: any) => {
    setPosts((prev) => [newPost, ...prev]);
    try {
      const userKey = currentUser ? `blog_admin_posts_${currentUser.email}` : 'blog_admin_posts';
      const existing = JSON.parse(localStorage.getItem(userKey) || '[]');
      localStorage.setItem(userKey, JSON.stringify([newPost, ...existing]));
    } catch { /* ignore */ }
  };

  return (
    <div className={`min-h-screen ${dark ? 'dark' : ''}`} style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Nav
        page={page}
        setPage={setPage}
        dark={dark}
        setDark={setDark}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <main className="container mx-auto px-4 py-8">
        {page === 'Home' && <HomePage setPage={setPage} setPost={setSelectedPost} extraPosts={posts} />}
        {page === 'Journal' && <JournalPage setPage={setPage} setPost={setSelectedPost} extraPosts={posts.filter((p: any) => !deletedIds.includes(p.id))} onDelete={handleDeletePost} />}
        {page === 'Projects' && (
  <div className="max-w-6xl mx-auto px-6 py-14">
    <h1 className="font-serif text-4xl font-semibold mb-6" style={{ color: 'var(--foreground)' }}>Projects</h1>
    <div className="grid gap-6 md:grid-cols-2">
      {[...posts.filter((p: any) => p.category === 'Projects'), ...PROJECTS]
        .filter((item: any) => !deletedIds.includes(item.id))
        .map((item: any) => (
          <div key={item.id} className="p-6 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
            <h2 className="font-semibold text-lg mb-2">{item.title || item.name}</h2>
            <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>{item.excerpt || item.description}</p>
            <div className="flex flex-wrap gap-2">
              {(item.tech || item.tags || []).map((t: string) => (
                <span key={t} className="px-2 py-0.5 text-xs font-mono rounded" style={{ border: '1px solid var(--border)' }}>{t}</span>
              ))}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Delete this project?")) {
                  handleDeletePost(item.id);
                }
              }}
              className="text-xs font-mono text-red-500 hover:text-red-700 mt-3 text-right block w-full"
            >
              🗑 Delete Project
            </button>
          </div>
        ))}
    </div>
  </div>
)}

{page === 'Thoughts' && (
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="fade-in mb-10">
            <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--accent)' }}>
              SHORT NOTES
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
              Thoughts
            </h1>
            <p className="text-base font-light" style={{ color: 'var(--muted-foreground)' }}>
              Things I was thinking about at 2am.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...posts.filter((p: any) => p.category === 'Thoughts').map((p: any) => ({ id: p.id, text: p.content || p.excerpt || p.title, date: p.date, tags: p.tags || [] })), ...THOUGHTS].filter((t: any) => !deletedIds.includes(t.id)).map((t: any) => (
              <div
                key={t.id}
                className="p-6 rounded-[6px] flex flex-col justify-between card-hover"
                style={{ border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
              >
                <p className="font-serif italic text-base leading-relaxed mb-6" style={{ color: 'var(--foreground)' }}>
                  "{t.text}"
                </p>
                <div className="flex items-center justify-between gap-2 mt-auto">
                  <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
                    {t.date}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {t.tags.map((tag: string) => (
                      <span key={tag} className="tag-chip uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button

                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Delete this thought?")) {
                    handleDeletePost(t.id);
                  }
                }}
                className="text-xs font-mono text-red-500 hover:text-red-700 mt-3 text-right block w-full"
              >
                🗑 Delete Thought
              </button>

              </div>
            ))}
          </div>
        </div>
      )}

{page === 'About' && (
  <AboutPage 
    currentUser={currentUser} 
    setCurrentUser={setCurrentUser} 
  />
)}

        {page === 'Post' && selectedPost && <PostPage post={selectedPost} setPage={setPage} />}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsCreateOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg font-mono text-xs tracking-wider uppercase text-white bg-[#8B9E7E] hover:scale-105 transition-transform"
      >
        <span className="text-base font-bold">+</span> Write Post
      </button>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleSavePost}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          const userProfileKey = `blog_user_profile_${user.email}`;
          // 1. Try email-specific saved profile
          // 2. Try generic saved profile (if created before logging in)
          const savedProfile = localStorage.getItem(userProfileKey) || localStorage.getItem('blog_user_profile');
          
          if (savedProfile) {
            try {
              const parsed = JSON.parse(savedProfile);
              // Ensure email and username match the logged in account
              const updatedProfile = { ...parsed, email: user.email, username: user.username };
              setCurrentUser(updatedProfile);
              // Migrate/persist to user-scoped key so it stays linked to this login
              localStorage.setItem(userProfileKey, JSON.stringify(updatedProfile));
              return;
            } catch { /* ignore */ }
          }

          setCurrentUser({
            email: user.email,
            username: user.username,
            displayName: user.username,
            locationRole: 'Edinburgh, Scotland · CS Student',
            bio1: 'I study computer science by day and build small personal tools by night.',
            bio2: 'This website is my corner of the internet.',
            avatarUrl: '',
            currently: ['Building projects'],
            learning: ['TypeScript', 'React'],
            techStack: ['TYPESCRIPT', 'REACT'],
            philosophy: '"Build things you\'d actually use."',
            milestones: [{ year: '2026', text: 'Joined the platform' }]
          });
        }}
      />
      <Footer setPage={setPage} />
    </div>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer({ setPage }: { setPage: (p: string) => void }) {
  return (
    <footer className="mt-20 border-t py-10" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand & Credentials */}
        <div>
          <p className="font-serif font-semibold text-base mb-0.5" style={{ color: 'var(--foreground)' }}>
            B.T. Ferrer
          </p>
          <p className="text-xs font-light" style={{ color: 'var(--muted-foreground)' }}>
            Built and written by Bennett Christoff T. Ferrer
          </p>
          <a 
            href="mailto:bennettchristoff@gmail.com" 
            className="text-xs font-mono transition-opacity hover:opacity-70 mt-1 inline-block"
            style={{ color: 'var(--accent)' }}
          >
            bennettchristoff@gmail.com
          </a>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-5">
          {['Home', 'Journal', 'Thoughts', 'Projects', 'About'].map(l => (
            <button
              key={l}
              onClick={() => setPage(l)}
              className="text-xs font-mono transition-opacity hover:opacity-70"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {l}
            </button>
          ))}
          <button
            onClick={() => setPage('Admin')}
            className="text-xs font-mono transition-opacity hover:opacity-70"
            style={{ color: 'var(--border)' }}
            title="Writer's Room"
          >
            ✦
          </button>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          {/* GitHub */}
          <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="transition-opacity hover:opacity-70" style={{ color: 'var(--muted-foreground)' }}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </a>
          {/* Twitter / X */}
          <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" className="transition-opacity hover:opacity-70" style={{ color: 'var(--muted-foreground)' }}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          {/* RSS Feed */}
          <a href="#" aria-label="RSS" className="transition-opacity hover:opacity-70" style={{ color: 'var(--muted-foreground)' }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1" fill="currentColor"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}