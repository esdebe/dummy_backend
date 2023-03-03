import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox'
import { Type, Static } from '@sinclair/typebox'
import type { RouteGenericInterface } from 'fastify/types/route'

const bodySchema = Type.Object({
  name: Type.String(),
  quantity: Type.Number(),
})

type BodySchema = Static<typeof bodySchema>

interface Schema extends RouteGenericInterface {
  Body: BodySchema
}

const schema = {
  body: bodySchema,
}

const Create: FastifyPluginCallbackTypebox = (fastify, _options, next): void => {
  fastify.post<Schema>(
    '/',
    {
      prefixTrailingSlash: 'no-slash',
      // onRequest: [fastify.authenticate],
      schema,
    },
    async (request, reply) => {
      const { prisma, body } = request
      try {
        const user = await prisma.product.create({
          data: {
            ...body,
          },
          select: {
            id: true,
            name: true,
            quantity: true,
          },
        })
        reply.status(201).send(user)
      } catch {
        reply.status(422).send('Failed To Create Product')
      }
    }
  )

  next()
}

export default Create
