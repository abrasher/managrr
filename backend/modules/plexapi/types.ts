export enum LibraryType {
  MOVIE = 'movie',
  PHOTO = 'photo',
  SHOW = 'show',
  ARTIST = 'artist',
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
