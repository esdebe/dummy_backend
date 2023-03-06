import { FastifyReply } from 'fastify'
import { Type, Static } from '@sinclair/typebox'
import type { RouteGenericInterface } from 'fastify/types/route'
import { FastifyRequestTypebox } from '../../../lib/type-helper'

const querystringSchema = Type.Partial(
  Type.Object({
    per_page: Type.Optional(Type.String()),
    page: Type.Optional(Type.String()),
  })
)

type QuerystringSchema = Static<typeof querystringSchema>

export const schema = {
  querystring: querystringSchema,
}

export interface Schema extends RouteGenericInterface {
  Querystring: QuerystringSchema
}

type Handler = (request: FastifyRequestTypebox<typeof schema>, reply: FastifyReply) => Promise<void>

export const handler: Handler = async (request, reply) => {
  const { paginated, query, paginatedFormatter } = request
  const products = await paginated.product.paginate({
    limit: query?.per_page ? parseInt(query.per_page, 10) : 10,
    page: query?.page ? parseInt(query.page, 10) : 1,
    select: { id: true, name: true, quantity: true },
    strictLimit: true,
  })

  reply.send(paginatedFormatter(products))
}
