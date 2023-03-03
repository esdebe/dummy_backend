import { FastifyPluginCallback } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import paginator from 'prisma-paginate'
import { PrismaClientPaginate } from 'prisma-paginate/dist/prisma'

const clientPaginate: FastifyPluginCallback = (fastify, _, next) => {
  const paginated = paginator(fastify.prisma)

  fastify
    .decorate('paginated', paginated)
    .decorateRequest('paginated', { getter: () => fastify.paginated })

  next()
}

const fastifyPrismaClientPaginate = fastifyPlugin(clientPaginate, {
  name: 'fastify-prisma-client-paginate',
  dependencies: ['fastify-prisma-client'],
})

export default fastifyPrismaClientPaginate

declare module 'fastify' {
  interface FastifyRequest {
    paginated: PrismaClientPaginate
  }
  interface FastifyInstance {
    paginated: PrismaClientPaginate
  }
}
