export interface Software {
  id: string
  name: string
  slug: string
  description: string
  version: string | null
  platform: string[]
  price: number
  imageUrl: string
  downloadUrl: string //for mobile apps
  featured: boolean
  categoryId: string
  category?: Category
  createdAt: Date
  updatedAt: Date
  webUrl?: string
  tags?: string[] //programmming language e.g java, python
  repoUrl?: string //github
}

export interface Category {
  id: string
  name: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateSoftwarePayload {
  name: string
  description: string
  version: string
  category: string
  price: string
  platform: string[]
  image?: File
  webUrl?: string
  tags?: string | string[]  // Form can send tags as string or array
  repoUrl?: string
  downloadUrl?: string
}