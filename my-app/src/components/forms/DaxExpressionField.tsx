import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface DaxExpressionFieldProps {
  id?: string
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

export function DaxExpressionField({
  id = "dax-expression",
  label = "DAX Expression",
  value,
  onChange,
  placeholder = "Enter DAX expression…",
  required = false,
}: DaxExpressionFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="font-mono text-sm min-h-40 resize-y"
        spellCheck={false}
        required={required}
      />
      <p className="text-xs text-muted-foreground">Use standard DAX syntax. Indent with 4 spaces for readability.</p>
    </div>
  )
}
