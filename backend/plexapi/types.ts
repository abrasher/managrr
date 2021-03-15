export enum LibraryType {
  movie = 'movie',
  music = 'music',
  photo = 'photo',
  show = 'show',
}

export interface IPlexAccount {
  id: number
  uuid: string
  username: string
  email: string
}
