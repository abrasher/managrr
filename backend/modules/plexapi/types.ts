export enum LibraryType {
  MOVIE = 'movie',
  MUSIC = 'music',
  PHOTO = 'photo',
  SHOW = 'show',
}

export interface IPlexAccount {
  id: number
  uuid: string
  username: string
  email: string
}

export interface IPlexPath {
  path: string
}
