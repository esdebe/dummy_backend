import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox'
import { Type, Static } from '@sinclair/typebox'
import type { RouteGenericInterface } from 'fastify/types/route'

const querystringSchema = Type.Partial(
  Type.Object({
    per_page: Type.Optional(Type.Integer()),
    page: Type.Optional(Type.Integer()),
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
      onRequest: [fastify.authenticate],
      schema,
    },
    async (request, reply) => {
      const { paginated, query } = request
      const products = await paginated.product.paginate({
        limit: query?.per_page || 5,
        page: query.page || 1,
        select: { name: true, quantity: true },
      })

      reply.send(products)
    }
  )

  next()
}

export default List
