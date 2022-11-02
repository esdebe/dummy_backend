import 'fastify'
import { Type, Static } from '@sinclair/typebox'

export const schema = Type.Object({
  // AUTH
  AUTH_ACCESS_TOKEN_SECRET: Type.String(),
  AUTH_REFRESH_TOKEN_SECRET: Type.String(),

  // CLOUDINARY
  CLOUDINARY_KEY: Type.String(),
  CLOUDINARY_NAME: Type.String(),
  CLOUDINARY_SECRET: Type.String(),

  // COOKIE
  COOKIE_SECRET: Type.String(),

  // DATABASE
  DATABASE_URL: Type.String(),

  // UPSTASH_REDIS
  UPSTASH_REDIS_REST_TOKEN: Type.String(),
  UPSTASH_REDIS_REST_URL: Type.String(),

  // UPSTASH_QSTASH
  UPSTASH_QSTASH_URL: Type.String(),
  UPSTASH_QSTASH_TOKEN: Type.String(),
  UPSTASH_QSTASH_CURRENT_SIGNING_KEY: Type.String(),
  UPSTASH_QSTASH_NEXT_SIGNING_KEY: Type.String(),

  // NOVU
  NOVU_API_KEY: Type.String(),
  NOVU_APPLICATION_IDENTIFIER: Type.String(),
})

export type Config = Static<typeof schema>

declare module 'fastify' {
  interface FastifyInstance {
    config: Config
  }
}
