import fastifyPlugin from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { Redis } from '@upstash/redis'

declare module 'fastify' {
  interface FastifyInstance {
    redis: Redis
  }
}

const fastifyRedisDecorator: FastifyPluginAsync = async (fastify) => {
  const redis = new Redis({
    url: fastify.config.UPSTASH_REDIS_REST_URL,
    token: fastify.config.UPSTASH_REDIS_REST_TOKEN,
  })

  fastify.decorate('redis', redis)
}

export default fastifyPlugin(fastifyRedisDecorator, {
  fastify: '*',
  name: 'fastify-redis-decorator',
})
