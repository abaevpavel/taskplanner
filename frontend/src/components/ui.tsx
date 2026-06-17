/** Лёгкие UI-примитивы на Tailwind (без внешнего UI-кита). */
import { type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../lib/utils'

type Variant = 'primary' | 'amber' | 'green' | 'blue' | 'danger' | 'ghost' | 'outline'

const variants: Record<Variant, string> = {
  primary: 'bg-gray-900 text-white hover:bg-gray-800',
  amber: 'bg-brand-amber text-black hover:brightness-95',
  green: 'bg-green-600 text-white hover:bg-green-700',
  blue: 'bg-blue-600 text-white hover:bg-blue-700',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  outline: 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50',
}

export function Button({
  variant = 'outline', className, ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50',
        variants[variant], className,
      )}
      {...props}
    />
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-xl border border-gray-200 bg-white shadow-sm', className)}>{children}</div>
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn('w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500', className)}
      {...props}
    />
  )
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', className)}>
      {children}
    </span>
  )
}

export function Modal({
  open, title, children, footer, onClose,
}: {
  open: boolean
  title: string
  children: ReactNode
  footer?: ReactNode
  onClose: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <div className="text-sm text-gray-600">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle && <p className="mt-1 text-gray-500">{subtitle}</p>}
    </div>
  )
}
