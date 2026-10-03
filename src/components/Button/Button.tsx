import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode
}

export function Button({ icon, children, ...rest }: Props) {
  return (
    <button type="button" className="button" {...rest}>
      <span className="button__label">{children}</span>
      {icon && (
        <span className="button__icon" aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  )
}
