export interface Category {
  id: string
  name: string
  description: string
  color: string
}

export interface Tag {
  id: string
  name: string
}

export interface DaxMeasure {
  id: string
  name: string
  displayName: string
  description: string
  daxExpression: string
  tableName: string
  formatString?: string
  displayFolder?: string
  categoryId: string
  tagIds: string[]
  isHidden: boolean
  createdAt: string
  updatedAt: string
}

export interface DaxUdf {
  id: string
  name: string
  displayName: string
  description: string
  daxExpression: string
  tableName: string
  parameters?: string
  returnDescription?: string
  categoryId: string
  tagIds: string[]
  createdAt: string
  updatedAt: string
}

export interface DaxPackage {
  id: string
  name: string
  displayName: string
  description: string
  categoryId: string
  tagIds: string[]
  measureIds: string[]
  udfIds: string[]
  createdAt: string
  updatedAt: string
}
