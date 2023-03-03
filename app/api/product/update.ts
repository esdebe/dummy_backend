import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox'
import { Type, Static } from '@sinclair/typebox'
import type { RouteGenericInterface } from 'fastify/types/route'

const paramsSchema = Type.Object({
  id: Type.String(),
})

type ParamsSchema = Static<typeof paramsSchema>

const bodySchema = Type.Partial(
  Type.Object({
    name: Type.Optional(Type.String()),
    quantity: Type.Optional(Type.Number()),
  })
)

type BodySchema = Static<typeof bodySchema>

const schema = {
  params: paramsSchema,
  body: bodySchema,
}

interface Schema extends RouteGenericInterface {
  Params: ParamsSchema
  Body: BodySchema
}

const Update: FastifyPluginCallbackTypebox = (fastify, _options, next): void => {
  fastify.post<Schema>(
    '/:id',
    {
      prefixTrailingSlash: 'no-slash',
      schema,
      // onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      const { prisma, params, body } = request

      const id = params?.id ? parseInt(params.id, 10) : null

      if (id === null) {
        reply.send('error')
        return
      }

      const product = await prisma.product.update({
        select: {
          id: true,
          name: true,
          quantity: true,
        },
        where: {
          id,
        },
        data: body,
      })
      reply.send(product)
    }
  )

  next()
}

export default Update
