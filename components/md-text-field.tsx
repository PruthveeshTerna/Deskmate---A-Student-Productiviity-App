'use client'

import { useId, useState, type ComponentProps, type ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'

type Props = Omit<ComponentProps<'input'>, 'placeholder'> & {
  label: string
  leadingIcon?: ReactNode
  isPassword?: boolean
}

/**
 * Material Design 3 outlined text field with a floating label that sits in a
 * notch on the outline when focused or filled.
 */
export function MdTextField({
  label,
  leadingIcon,
  isPassword,
  className = '',
  type = 'text',
  id,
  ...props
}: Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const [show, setShow] = useState(false)

  const inputType = isPassword ? (show ? 'text' : 'password') : type

  return (
    <div className={`group relative h-14 ${className}`}>
      {leadingIcon && (
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-on-surface-variant">
          {leadingIcon}
        </span>
      )}

      <input
        id={fieldId}
        type={inputType}
        placeholder=" "
        className={`peer h-14 w-full rounded-md border border-outline bg-transparent px-4 pt-1 text-on-surface outline-none transition-colors placeholder-transparent focus:border-2 focus:border-primary ${
          leadingIcon ? 'pl-11' : ''
        } ${isPassword ? 'pr-11' : ''}`}
        {...props}
      />

      <label
        htmlFor={fieldId}
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 bg-surface-container px-1 text-base leading-none text-on-surface-variant transition-all duration-150 peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs ${
          leadingIcon ? 'left-10 peer-focus:left-3 peer-[:not(:placeholder-shown)]:left-3' : 'left-3'
        }`}
      >
        {label}
      </label>

      {isPassword && (
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-2 my-auto grid h-9 w-9 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/8"
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      )}
    </div>
  )
}
