import jimp from 'jimp'
import path from 'path'

import { BlendMode } from '@/backend/modules/system/system.input'

import { Movie } from '../entities'

type ThumbnailProps = Pick<Movie, 'imdbRating' | 'rottenTomatoesRating' | 'metacriticRating'> & {
  posterImage: Buffer
}

// Paths and Icon Names
const ICON_PATH = path.join(process.cwd(), 'assets', 'icons')

const ICON_RIPE = path.join(ICON_PATH, 'rt_critic_fresh.png')
const ICON_ROTTEN = path.join(ICON_PATH, 'rt_critic_rotten.png')
const RT_ICON_SCALE = 0.75

const IMDB_ICON = path.join(ICON_PATH, 'imdb_icon.png')
const IMDB_ICON_SCALE = 0.75

const METACRITIC_ICON = path.join(ICON_PATH, 'metacritic_icon.png')
const METACRITIC_ICON_SCALE = 0.9

export interface ThumbnailOptions {
  SOURCE_OPACITY: number
  DESTINATION_OPACITY: number
  BLEND_MODE: BlendMode
  SPACING: number
  GLOBAL_ICON_SCALE: number
  RATING_SCALE: number
  FONT_COLOUR: 'white' | 'black'
  IMAGE_HEIGHT: number
  IMAGE_WIDTH: number
  JPEG_QUALITY: number
  BOX_COLOUR: string
}

export class PosterGenerator {
  // Composition Settings
  private SOURCE_OPACITY = 1
  private DESTINATION_OPACITY = 0.1
  private BLEND_MODE = BlendMode.BLEND_SCREEN

  // Spacing between icon and number
  private SPACING = 25

  // Scale of icon next to text
  private GLOBAL_ICON_SCALE = 0.85

  // Scale of the icon and rating in the box
  private RATING_SCALE = 0.85

  // Font Settings
  private FONT_COLOUR = 'white'

  // Quality
  private JPEG_QUALITY = 85

  private RATING_BOX_Y_PADDING = 0.1
  private IMAGE_HEIGHT = 2100
  private IMAGE_WIDTH = 1400

  private BOX_COLOUR = '#211E1E'

  constructor(options?: ThumbnailOptions) {
    Object.assign(this, options)
  }

  private async makeRatingIcon(rating: number, iconPath: string, iconScale = 1) {
    const font = await jimp.loadFont(
      this.FONT_COLOUR === 'white' ? jimp.FONT_SANS_128_WHITE : jimp.FONT_SANS_128_BLACK
    )
    const fontWidth = jimp.measureText(font, `${rating}`)
    const fontHeight = jimp.measureTextHeight(font, `${rating}`, 500)

    const iconImage = await jimp.read(iconPath)
    iconImage.resize(jimp.AUTO, this.GLOBAL_ICON_SCALE * fontHeight * iconScale)

    const iconWidth = iconImage.getWidth()

    const iconJimp = new jimp(iconWidth + this.SPACING + fontWidth, fontHeight)

    // Add Icon Centered Vertically with Text
    iconJimp.composite(iconImage, 0, (fontHeight * (1 - this.GLOBAL_ICON_SCALE * iconScale)) / 2)

    // Add Text Spaced by the Icon
    iconJimp.print(font, iconImage.getWidth() + this.SPACING, 0, rating)

    // Shrink the Icon and Text Together
    iconJimp.scale(this.RATING_SCALE)

    return iconJimp
  }

  /**
   * Generates an image buffer with IMDb, Rotten Tomatoes and Metacritic ratings
   * @param mediaItem
   * @returns Undefined if no ratings are defined, otherwise a buffer of the image
   */
  public async generate(mediaItem: ThumbnailProps): Promise<Buffer | undefined> {
    const { rottenTomatoesRating, imdbRating, metacriticRating, posterImage } = mediaItem

    if (!rottenTomatoesRating && !imdbRating && !metacriticRating) return

    // Read and Resize the image to be a constant value as text size is static
    const image = await jimp.read(posterImage)
    image.resize(this.IMAGE_WIDTH, this.IMAGE_HEIGHT)

    // Get Image Height
    const [imageHeight, imageWidth] = [image.getHeight(), image.getWidth()]

    const icons = []
    if (rottenTomatoesRating) {
      const iconPath = rottenTomatoesRating > 60 ? ICON_RIPE : ICON_ROTTEN
      icons.push(await this.makeRatingIcon(rottenTomatoesRating, iconPath, RT_ICON_SCALE))
    }

    if (imdbRating) {
      icons.push(await this.makeRatingIcon(imdbRating, IMDB_ICON, IMDB_ICON_SCALE))
    }

    if (metacriticRating) {
      icons.push(
        await this.makeRatingIcon(metacriticRating, METACRITIC_ICON, METACRITIC_ICON_SCALE)
      )
    }

    const numRatings = icons.length

    const ratingsHeight = icons[0].getHeight()

    const ratingBox = new jimp(
      imageWidth,
      ratingsHeight * (1 + 2 * this.RATING_BOX_Y_PADDING),
      this.BOX_COLOUR
    )

    const RATING_Y_OFFSET = ratingsHeight * this.RATING_BOX_Y_PADDING

    if (numRatings === 1) {
      ratingBox.composite(icons[0], this.IMAGE_WIDTH / 2 - icons[0].getWidth() / 2, RATING_Y_OFFSET)
    } else if (numRatings === 2) {
      ratingBox.composite(icons[0], this.IMAGE_WIDTH / 3 - icons[0].getWidth() / 2, RATING_Y_OFFSET)
      ratingBox.composite(
        icons[1],
        (2 * this.IMAGE_WIDTH) / 3 - icons[1].getWidth() / 2,
        RATING_Y_OFFSET
      )
    } else if (numRatings === 3) {
      ratingBox.composite(icons[0], this.IMAGE_WIDTH / 6 - icons[0].getWidth() / 2, RATING_Y_OFFSET)
      ratingBox.composite(icons[1], this.IMAGE_WIDTH / 2 - icons[1].getWidth() / 2, RATING_Y_OFFSET)
      ratingBox.composite(
        icons[2],
        (5 * this.IMAGE_WIDTH) / 6 - icons[2].getWidth() / 2,
        RATING_Y_OFFSET
      )
    }

    const boxHeight = ratingBox.getHeight()

    const RATING_BOX_Y_POS = imageHeight - boxHeight

    // Add background to the image
    image.composite(ratingBox, 0, RATING_BOX_Y_POS, {
      mode: this.BLEND_MODE,
      opacityDest: this.DESTINATION_OPACITY,
      opacitySource: this.SOURCE_OPACITY,
    })

    image.quality(this.JPEG_QUALITY)

    return image.getBufferAsync(jimp.MIME_JPEG)
  }
}
