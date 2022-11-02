import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox'

const Home: FastifyPluginCallbackTypebox = (fastify, _options, next): void => {
  fastify.get(
    '/',
    {
      prefixTrailingSlash: 'no-slash',
    },
    async (_request, reply) => {
      const { redis } = fastify
      await redis.set('foo', 'test')
      const x = await redis.get('foo')
      reply.send({ success: true, x })
    }
  )
  next()
}

export default Home
