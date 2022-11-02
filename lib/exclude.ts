/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */

const exclude = (target: any, keys: any) => {
  for (const key of keys) {
    delete target[key]
  }
  return target
}

export default exclude
