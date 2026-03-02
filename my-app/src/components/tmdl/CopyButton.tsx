import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface CopyButtonProps {
  text: string
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("TMDL copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="outline" className="gap-2" onClick={handleCopy}>
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied!" : "Copy to clipboard"}
    </Button>
  )
}
