import { create } from "zustand"

type ItemType = "measure" | "udf" | "package"

interface SelectionState {
  selectedMeasureIds: Set<string>
  selectedUdfIds: Set<string>
  selectedPackageIds: Set<string>
  toggle: (type: ItemType, id: string) => void
  clear: () => void
  totalCount: () => number
}

export const useSelectionStore = create<SelectionState>()((set, get) => ({
  selectedMeasureIds: new Set(),
  selectedUdfIds: new Set(),
  selectedPackageIds: new Set(),

  toggle(type, id) {
    set((state) => {
      const key =
        type === "measure"
          ? "selectedMeasureIds"
          : type === "udf"
            ? "selectedUdfIds"
            : "selectedPackageIds"
      const next = new Set(state[key])
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return { [key]: next }
    })
  },

  clear() {
    set({
      selectedMeasureIds: new Set(),
      selectedUdfIds: new Set(),
      selectedPackageIds: new Set(),
    })
  },

  totalCount() {
    const { selectedMeasureIds, selectedUdfIds, selectedPackageIds } = get()
    return selectedMeasureIds.size + selectedUdfIds.size + selectedPackageIds.size
  },
}))
