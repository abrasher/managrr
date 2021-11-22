import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { parseString } from 'xml2js'
import { firstCharLowerCase } from 'xml2js/lib/processors'

const parseValue = (value: string) => {
  if (/^(?:true|false)$/i.test(value)) {
    return value.toLowerCase() === 'true'
  }
  if (value === '') {
    return null
  }
  if (value !== undefined && !isNaN(Number(value))) {
    return value
  }
  return value
}

export const getPlex = (baseURL: string, token: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    headers: {
      Accept: 'application/json',
      'X-Plex-Token': token,
      'X-Plex-Client-Identifier': 'managrr',
    },
  })

  instance.interceptors.response.use(
    (response: PlexResponse) => {
      const contentType = response.headers['content-type']
      if (contentType?.includes('xml')) {
        parseString(
          response.data,
          {
            mergeAttrs: true,
            explicitArray: true,
            emptyTag: 'null',
            tagNameProcessors: [firstCharLowerCase],
            attrNameProcessors: [firstCharLowerCase],
            valueProcessors: [parseValue],
            attrValueProcessors: [parseValue],
          },
          (err, res) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            // Makes arrays of single values into not arrays ['hello'] => 'hello'
            response.data = objectParse(res)
          }
        )
      }

      return response
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  return instance
}

interface PlexResponse extends AxiosResponse {
  headers: {
    'content-type': string
  }
}

const objectParse = (obj: Record<string, unknown>) => {
  Object.entries(obj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (['string', 'boolean', 'number'].includes(typeof value[0])) {
        obj[key] = value[0]
      } else if (Array.isArray(value[0])) {
        obj[key] = value
      } else if (value === null) {
        return
      } else {
        if (isObjectArray(value)) {
          obj[key] = value.map((val) => objectParse(val))
        }
        obj[key] = value
      }
    } else if (typeof value === 'object' && value !== null) {
      obj[key] = objectParse(value as Record<string, unknown>)
    }
  })
  return obj
}

const isObjectArray = (arr: Array<unknown>): arr is Array<Record<string, unknown>> =>
  arr.every((val) => typeof val === 'object' && val !== null)
