import type { CSSProperties } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { type VariantProps, cva } from 'class-variance-authority'

export const inputVariants = cva(
  '',
  {
    variants: {
      size: {
        regular: 'px-3 radius-md system-sm-regular',
        large: 'px-4 radius-lg system-md-regular',
      },
    },
    defaultVariants: {
      size: 'regular',
    },
  },
)

export type InputProps = {
  showLeftIcon?: boolean
  showClearIcon?: boolean
  onClear?: () => void
  disabled?: boolean
  destructive?: boolean
  wrapperClassName?: string
  styleCss?: CSSProperties
} & React.InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof inputVariants>

const Checkbox = ({
  disabled,
  wrapperClassName,
  styleCss,
  checked,
  onChange,
  ...props
}: InputProps) => {
  const { t } = useTranslation()
  return (
    <input
      style={styleCss}
      onChange={onChange}
      disabled={disabled}
      {...props}
      checked={checked}
    />
  )
}

export default Checkbox
