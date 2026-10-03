import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { mod } from '../../lib/bem'
import './Button.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'solid' | 'danger'
  icon?: ReactNode
}

export function Button({ variant = 'outline', icon, children, ...rest }: Props) {
  return (
    <button type="button" className={mod('button', { [variant]: true })} {...rest}>
      <span className="button__label">{children}</span>
      {icon && (
        <span className="button__icon" aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  )
}
