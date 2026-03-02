import { useNavigate } from "react-router-dom"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSelectionStore } from "@/stores/selection-store"

export function SelectionBasket() {
  const navigate = useNavigate()
  const { totalCount } = useSelectionStore()
  const count = totalCount()

  if (count === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        size="lg"
        className="shadow-lg gap-2 pr-4"
        onClick={() => navigate("/generate")}
      >
        <ShoppingCart className="h-4 w-4" />
        Generate TMDL
        <span className="ml-1 bg-white text-primary rounded-full text-xs font-bold h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      </Button>
    </div>
  )
}
