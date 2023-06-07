import React, { useContext } from 'react'

import { IconSelect, iconNames as _iconNames } from './'
import { SpecialIconName } from './SpecialIcons'

export type IconNames = SpecialIconName

type Props = {
  name: SpecialIconName
  color?: string
  size?: string
  style?: Record<string, unknown>
  className?: string
}
export const SpecialIcon = ({ name, color = 'white', size = '1em', style, className }: Props) => {
  return (
    <IconSelect
      name={name}
      iconProps={{
        color:color,
        style: { width: size, height: size, ...style },
        className,
      }}
    />
  )
}
