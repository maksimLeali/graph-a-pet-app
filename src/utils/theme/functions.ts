import { ColorKeys, colors, isColorKey } from "./colors";

export const $uw = (val: number) => `calc(var(--max-grid-size) / var(--grid-columns-number) * ${val})`

export const $color = (color: ColorKeys | string) => {
    if (isColorKey(color)) return colors[color]
    return color
}
export const $cssTRBL = (
    top: number,
    right: number = top,
    bottom: number = top,
    left: number = right
) => `${$uw(top)} ${$uw(right)} ${$uw(bottom)} ${$uw(left)}`

export const $breakPoint = (val: number)=> `@media only screen and (max-width: ${val}px)`;