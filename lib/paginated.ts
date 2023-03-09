/* eslint-disable @typescript-eslint/naming-convention */

import { FastifyPluginCallback } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import paginator from 'prisma-paginate'
import { PrismaClientPaginate } from 'prisma-paginate/dist/prisma'

type PaginatedFormatter = (paginated: paginator.PaginationResult<any>) => {
  data: any[]
  pagination: {
    current_page: number
    next_page: number | null
    per_page: number
    prev_page: number | null
    total_data: number
    total_page: number
  }
}

const paginatedFormatter: PaginatedFormatter = (paginated) => ({
  data: paginated.result,
  pagination: {
    current_page: paginated.page,
    next_page: paginated.hasNextPage ? paginated.page + 1 : null,
    per_page: paginated.limit,
    prev_page: paginated.hasPrevPage ? paginated.page - 1 : null,
    total_data: paginated.count,
    total_page: paginated.totalPages,
  },
})

const clientPaginate: FastifyPluginCallback = (fastify, _, next) => {
  const paginated = paginator(fastify.prisma)

  fastify
    .decorate('paginated', paginated)
    .decorateRequest('paginated', { getter: () => fastify.paginated })
    .decorateRequest('paginatedFormatter', paginatedFormatter)

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
    paginatedFormatter: PaginatedFormatter
  }
  interface FastifyInstance {
    paginated: PrismaClientPaginate
  }
}
