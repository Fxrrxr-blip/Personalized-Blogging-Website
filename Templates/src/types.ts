export interface PostDesign {
  layout: 'narrow' | 'standard' | 'wide'
  theme: 'light' | 'dark' | 'paper' | 'minimal'
  headingFont: 'serif' | 'sans'
  bodyFont: 'dm-sans' | 'inter'
  fontSize: 'sm' | 'md' | 'lg'
  lineHeight: 'normal' | 'relaxed'
  textAlign: 'left' | 'justify'
  coverAspect: '16/9' | '4/3' | '1/1'
}

export interface AdminPost {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  status: 'published' | 'draft' | 'archived'
  coverImage: string
  date: string
  lastEdited: string
  slug: string
  metaTitle: string
  metaDescription: string
  visibility: 'public' | 'private'
  design: PostDesign
  views: number
  readTime: string
  size: 'small' | 'medium' | 'large' | 'tall'
  featured: boolean
  image: string
}

export interface MediaItem {
  id: string
  url: string
  filename: string
  date: string
  size: string
}

export const DEFAULT_DESIGN: PostDesign = {
  layout: 'standard',
  theme: 'light',
  headingFont: 'serif',
  bodyFont: 'dm-sans',
  fontSize: 'md',
  lineHeight: 'relaxed',
  textAlign: 'left',
  coverAspect: '16/9',
}
