import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

type Variant = 'filled' | 'tonal' | 'outlined' | 'text' | 'elevated'
type Size = 'sm' | 'md' | 'lg'

const base =
  'md-state inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 select-none'

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
}

const variants: Record<Variant, string> = {
  filled: 'bg-primary text-on-primary md-elevation-1 hover:md-elevation-2',
  tonal: 'bg-secondary-container text-on-secondary-container',
  outlined:
    'border border-outline text-primary bg-transparent hover:bg-primary/5',
  text: 'text-primary bg-transparent px-4',
  elevated:
    'bg-surface-low text-primary md-elevation-1 hover:md-elevation-2',
}

type BaseProps = {
  variant?: Variant
  size?: Size
  children: ReactNode
  className?: string
}

export function MdButton({
  variant = 'filled',
  size = 'md',
  className = '',
  children,
  ...props
}: BaseProps & ComponentProps<'button'>) {
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function MdLinkButton({
  variant = 'filled',
  size = 'md',
  className = '',
  children,
  href,
  ...props
}: BaseProps & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  )
}
