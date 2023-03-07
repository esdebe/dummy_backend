import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox'
import { Type, Static } from '@sinclair/typebox'
import type { RouteGenericInterface } from 'fastify/types/route'

const paramsSchema = Type.Object({
  id: Type.String(),
})

type ParamsSchema = Static<typeof paramsSchema>

export const schema = {
  params: paramsSchema,
}

export interface Schema extends RouteGenericInterface {
  Params: ParamsSchema
}

const Destroy: FastifyPluginCallbackTypebox = (fastify, _options, next): void => {
  fastify.delete<Schema>(
    '/:id',
    {
      prefixTrailingSlash: 'no-slash',
      schema,
      // onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      const { prisma, params } = request

      const id = params?.id ? parseInt(params.id, 10) : null

      if (id === null) {
        reply.send('error')
        return
      }

      const product = await prisma.product.delete({
        where: {
          id,
        },
      })
      reply.send(product)
    }
  )

  next()
}

export default Destroy
