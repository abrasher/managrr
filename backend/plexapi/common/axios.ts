import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { parseString } from 'xml2js'
import { firstCharLowerCase } from 'xml2js/lib/processors'
import { camelCase } from 'lodash'

export const getPlex = (baseURL: string, token: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    headers: {
      Accept: 'application/json',
      'X-Plex-Token': token,
      'X-Plex-Client-Identifier': 'toolrr',
    },
  })

  instance.interceptors.response.use(
    (response: PlexResponse) => {
      const contentType = response.headers['content-type']
      if (contentType.includes('xml')) {
        parseString(
          response.data,
          {
            mergeAttrs: true,
            explicitArray: true,
            tagNameProcessors: [firstCharLowerCase],
            attrNameProcessors: [firstCharLowerCase],
          },
          (err, res) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            // Makes arrays of single values into not arrays ['hello'] => 'hello'
            response.data = objectParse(res)
          }
        )
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      response.data = camelizeKeys(response.data)
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
      if (typeof value[0] === 'string') {
        obj[key] = value[0]
      } else if (Array.isArray(value[0])) {
        obj[key] = value
      } else {
        if (isObjectArray(value)) {
          obj[key] = value.map((val) => objectParse(val))
        }
        obj[key] = value
      }
    } else if (typeof value === 'object') {
      obj[key] = objectParse(value as Record<string, unknown>)
    }
  })
  return obj
}

const isObjectArray = (
  arr: Array<unknown>
): arr is Array<Record<string, unknown>> =>
  arr.every((val) => typeof val === 'object')

// @ts-ignore https://stackoverflow.com/a/50620653
const camelizeKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelizeKeys(v))
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: camelizeKeys(obj[key]),
      }),
      {}
    )
  }
  return obj
}
