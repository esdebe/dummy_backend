import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox'
import { Type, Static } from '@sinclair/typebox'
import type { RouteGenericInterface } from 'fastify/types/route'

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

const List: FastifyPluginCallbackTypebox = (fastify, _options, next): void => {
  fastify.get<Schema>(
    '/',
    {
      prefixTrailingSlash: 'no-slash',
      onRequest: [fastify.authenticate],
      schema,
    },
    async (request, reply) => {
      const { query, paginated, paginatedFormatter } = request

      const users = await paginated.user.paginate({
        limit: (query?.per_page ? parseInt(query.per_page, 10) : 10) || 10,
        page: (query?.page ? parseInt(query.page, 10) : 1) || 1,
        select: { id: true, name: true, email: true },
        strictLimit: true,
      })

      reply.send(paginatedFormatter(users))
    }
  )

  next()
}

export default List
