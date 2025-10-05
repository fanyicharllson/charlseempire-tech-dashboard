export interface Category {
  id: string
  name: string
  slug: string
  createdAt: Date
  updatedAt: Date
  _count?: {
    software: number
  }
}

export interface CreateCategoryPayload {
  name: string
  slug: string
}

export interface UpdateCategoryPayload {
  name: string
  slug: string
}