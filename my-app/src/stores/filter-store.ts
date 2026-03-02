import { create } from "zustand"

type ActiveTab = "all" | "measures" | "functions" | "packages"

interface FilterState {
  query: string
  categoryId: string | null
  tagIds: string[]
  activeTab: ActiveTab
  setQuery: (query: string) => void
  setCategoryId: (categoryId: string | null) => void
  toggleTag: (tagId: string) => void
  setTab: (tab: ActiveTab) => void
  reset: () => void
}

export const useFilterStore = create<FilterState>()((set) => ({
  query: "",
  categoryId: null,
  tagIds: [],
  activeTab: "all",

  setQuery(query) {
    set({ query })
  },

  setCategoryId(categoryId) {
    set({ categoryId })
  },

  toggleTag(tagId) {
    set((state) => {
      const existing = state.tagIds.includes(tagId)
      return {
        tagIds: existing
          ? state.tagIds.filter((t) => t !== tagId)
          : [...state.tagIds, tagId],
      }
    })
  },

  setTab(activeTab) {
    set({ activeTab })
  },

  reset() {
    set({ query: "", categoryId: null, tagIds: [], activeTab: "all" })
  },
}))
