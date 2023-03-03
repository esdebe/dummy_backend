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

const schema = {
  querystring: querystringSchema,
}

interface Schema extends RouteGenericInterface {
  Querystring: QuerystringSchema
}

const List: FastifyPluginCallbackTypebox = (fastify, _options, next): void => {
  fastify.get<Schema>(
    '/',
    {
      prefixTrailingSlash: 'no-slash',
      // onRequest: [fastify.authenticate],
      schema,
    },
    async (request, reply) => {
      const { paginated, query } = request
      const products = await paginated.product.paginate({
        limit: query?.per_page ? parseInt(query.per_page, 10) : 10,
        page: query?.page ? parseInt(query.page, 10) : 1,
        select: { id: true, name: true, quantity: true },
      })

      const { result: data, ...pagination } = products
      reply.send({
        data,
        pagination: {
          current_page: pagination.page,
          next_page: pagination.hasNextPage ? pagination.page + 1 : null,
          per_page: pagination.limit,
          prev_page: pagination.hasPrevPage ? pagination.page - 1 : null,
          // @ts-ignore
          total_data: pagination.count.id,
          total_page: pagination.totalPages,
        },
      })
    }
  )

  next()
}

export default List
