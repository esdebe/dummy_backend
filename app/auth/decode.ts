import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox'

const Decode: FastifyPluginCallbackTypebox = (fastify, _options, next): void => {
  fastify.post(
    '/decode',
    {
      prefixTrailingSlash: 'no-slash',
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      const token = request?.headers?.authorization?.replace?.(/^Bearer\s/, '')
      if (token) reply.send(fastify.jwt.decode(token))
      else reply.status(422).send('No Token')
    }
  )
  next()
}

export default Decode
