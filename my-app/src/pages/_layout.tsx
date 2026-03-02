import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { ShoppingCart, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useSelectionStore } from "@/stores/selection-store"

const isAdmin = import.meta.env.VITE_ADMIN_MODE === "true"

function navClass({ isActive }: { isActive: boolean }) {
  return `text-sm text-muted-foreground hover:text-foreground transition-colors ${isActive ? "text-foreground font-medium" : ""}`
}

export default function Layout() {
  const navigate = useNavigate()
  const { totalCount } = useSelectionStore()
  const count = totalCount()

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="h-14 border-b flex items-center shrink-0">
        <div className="mx-auto w-full max-w-7xl px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-sm">DAX Library</span>
            <nav className="flex items-center gap-4">
              <NavLink to="/" end className={navClass}>
                Library
              </NavLink>
              <NavLink to="/generate" className={navClass}>
                <span className="flex items-center gap-1.5">
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Generate
                  {count > 0 && (
                    <span className="bg-primary text-primary-foreground rounded-full text-xs font-bold h-4 w-4 flex items-center justify-center leading-none">
                      {count}
                    </span>
                  )}
                </span>
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin/categories" className={navClass}>
                  Admin
                </NavLink>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            {!isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                title="Admin mode (set VITE_ADMIN_MODE=true)"
                onClick={() => navigate("/admin/categories")}
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 flex">
        <div className="flex-1 mx-auto w-full max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
