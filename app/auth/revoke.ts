import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox'

const Revoke: FastifyPluginCallbackTypebox = (fastify, _options, next): void => {
  fastify.post(
    '/revoke',
    {
      prefixTrailingSlash: 'no-slash',
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      if (request.user) reply.send('revoked')
      else reply.status(422).send('No Token')
    }
  )
  next()
}

export default Revoke
