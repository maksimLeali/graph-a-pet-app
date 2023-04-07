// https://newbedev.com/typescript-deep-keyof-of-a-nested-object

import { I18NKey } from "../i18n"
import { Maybe } from "../types"

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never

type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[]
]

export type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number ? `${K}` | Join<K, Paths<T[K], Prev[D]>> : never
    }[keyof T]
  : ''

export type Leaves<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]
  : ''

  export type PaginatedResponse<T> = {
    items: Array<Maybe<T>>
    pagination: { current_page?: Maybe<number>; total_pages?: Maybe<number>; page_size?: Maybe<number>; total_items?: Maybe<number> }
  }


  export type SearchFilters = { key: string; name: I18NKey; selected: boolean }


  export enum OrderDirection {
    ASC = 'asc',
    DESC = 'desc',
  }

  export class Admin {
    id!: string
    email!: string
    first_name!: string
    last_name?: string
  }