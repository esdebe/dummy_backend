import fastifyPlugin from 'fastify-plugin'
import { FastifyPluginCallback } from 'fastify'
import { Redis } from '@upstash/redis'

declare module 'fastify' {
  interface FastifyRequest {
    redis: Redis
  }
  interface FastifyInstance {
    redis: Redis
  }
}

const fastifyRedisDecorator: FastifyPluginCallback = async (fastify, _, next) => {
  const redis = new Redis({
    url: fastify.config.UPSTASH_REDIS_REST_URL,
    token: fastify.config.UPSTASH_REDIS_REST_TOKEN,
  })

  fastify.decorate('redis', redis).decorateRequest('redis', { getter: () => fastify.redis })

  next()
}

export default fastifyPlugin(fastifyRedisDecorator, {
  fastify: '*',
  name: 'fastify-redis-decorator',
})
