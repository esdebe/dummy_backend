import fastifyPlugin from 'fastify-plugin'
import fastifyJwt, { FastifyJWTOptions } from '@fastify/jwt'
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any
  }
}

const trusted: FastifyJWTOptions['trusted'] = async (_request, _decodedToken) => {
  return true
}

const formatUser: FastifyJWTOptions['formatUser'] = (payload) => payload

const fastifyAuthenticateDecorator: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fastifyJwt, {
    secret: fastify.config.AUTH_ACCESS_TOKEN_SECRET,
    trusted,
    formatUser,
  })

  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
}

export default fastifyPlugin(fastifyAuthenticateDecorator, {
  fastify: '*',
  name: 'fastify-authenticate-decorator',
})
