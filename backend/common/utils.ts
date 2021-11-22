import { camelCase, isPlainObject } from 'lodash'
import { CamelCasedPropertiesDeep } from 'type-fest'

export const camelizeKeys = <T extends Record<string | number | symbol, unknown>, K = keyof T>(
  obj: T
): CamelCasedPropertiesDeep<T> => {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelizeKeys(v))
  } else if (isPlainObject(obj)) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: camelizeKeys(obj[key]),
      }),
      {}
    ) as CamelCasedPropertiesDeep<T>
  }
  return obj as CamelCasedPropertiesDeep<T>
}
