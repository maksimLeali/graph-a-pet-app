type Theme = { [key: string]: any }

/**
 * 
 * @param val - unit by which the container or margin or padding will be set. 
 *              in this case the screen is divideb by 48  
 * @returns 
 */


const uw = (val: number) => `calc(var(--max-grid-size) / var(--grid-columns-number) * ${val})`

export const $uw = (val: number) => ({ }) => uw(val);

/**
 * Get color from the theme based on the provided color name.
 * @param {string} color - The name of the color to retrieve from the theme.
 *                         Should be one of the keys in the 'light' or 'dark' theme.
 * @example
 * // Returns "#F7ECE1" for light theme and "#0c0d12" for dark theme
 * $color('black')
 */
export const $color = (color: string) => ({ theme }: { theme: Theme }) => theme.colors[color]

/**
 * return 4 valures like css ordered by top, right, bottom and left in the unit mesure uw
 * @param {number} top - if only this params is passed every other will have the same
 *                       value as this, if is in pair with right, it will set vertical alignment
 * @param {number} right - if this is passed without left param then it will set horizontal alignment
 * 
 * @param {number} bottom - set bottom alignment
 * 
 * @param {number} left - set left alignment
 * 
 * @example
 * // Returns `${uw(2)} ${uw(4)} ${uw(2)} ${uw(4)}` 
 * $cssTRBL(2, 4)
 */
export const $cssTRBL = (
    top: number,
    right: number = top,
    bottom: number = top,
    left: number = right
) => () => `${uw(top)} ${uw(right)} ${uw(bottom)} ${uw(left)}`

export const $break_point = (val: number) => ({ }) => `@media only screen and (max-width: ${val}px)`;