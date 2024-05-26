export type Mode = "kz_timer" | "kz_simple" | "kz_vanilla"

export interface SearchItem {
  mode: Mode
  name: string
  steamid: string
  avatar_hash: string
}