export interface Software {
  id: string
  name: string
  slug: string
  description: string
  version: string | null
  platform: string[]
  price: number
  imageUrl: string
  downloadUrl: string
  featured: boolean
  categoryId: string
  category?: Category
  createdAt: Date
  updatedAt: Date
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
}