import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox'

const Refresh: FastifyPluginCallbackTypebox = (fastify, _options, next): void => {
  fastify.post(
    '/refresh',
    {
      prefixTrailingSlash: 'no-slash',
    },
    async (_request, reply) => reply.status(200).send('Refresh Success')
  )

  next()
}

export default Refresh
