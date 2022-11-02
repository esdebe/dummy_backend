import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox'
import { Type, Static } from '@sinclair/typebox'
import paginator from 'prisma-paginate'
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
      const { prisma, query } = request
      const paginated = paginator(prisma)

      const users = await paginated.user.paginate({
        limit: query?.per_page || 5,
        page: query.page || 1,
        select: { name: true, email: true },
      })

      const { result: data, ...pagination } = users
      reply.send({ data, pagination })
    }
  )
  next()
}

export default List
