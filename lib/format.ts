/* eslint-disable import/prefer-default-export */
import { Format } from '@sinclair/typebox/format'

const email = (value: string) =>
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
    value
  )

export { email }

export const setFormat = () => {
  Format.Set('email', email)
}
