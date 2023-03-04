/* eslint-disable @typescript-eslint/naming-convention */

import { FastifyPluginCallback } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import paginator from 'prisma-paginate'
import { PrismaClientPaginate } from 'prisma-paginate/dist/prisma'

type PaginatedFormatter = (paginated: paginator.PaginationResult<any>) => {
  data: any
  pagination: {
    current_page: number
    next_page: number | null
    per_page: number
    prev_page: number | null
    total_data: number
    total_page: number
  }
}

const paginatedFormatter: PaginatedFormatter = (paginated) => {
  let totalData = 0
  let totalPage = 0
  try {
    totalData = Math.max(...Object.values(paginated.count as unknown as Record<string, any>))
  } catch {
    totalData = 0
  }

  try {
    if (totalData === 0) totalPage = 0
    else {
      totalPage = Math.ceil(totalData / paginated.limit)
    }
  } catch {
    totalPage = 0
  }

  return {
    data: paginated.result,
    pagination: {
      current_page: paginated.page,
      next_page: paginated.page < totalPage ? paginated.page + 1 : null,
      per_page: paginated.limit,
      prev_page: paginated.page > 1 && totalPage !== 0 ? paginated.page - 1 : null,
      total_data: totalData,
      total_page: totalPage,
    },
  }
}

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
