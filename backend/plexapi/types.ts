export type LibraryType = 'movie' | 'music' | 'photo' | 'show'

export interface IPlexAccount {
  id: number
  uuid: string
  username: string
  email: string
}
