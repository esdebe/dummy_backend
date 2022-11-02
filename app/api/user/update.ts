import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox'
import { Type, Static } from '@sinclair/typebox'
import type { RouteGenericInterface } from 'fastify/types/route'

const paramsSchema = Type.Object({
  id: Type.String(),
})

type ParamsSchema = Static<typeof paramsSchema>

const bodySchema = Type.Partial(
  Type.Object({
    password: Type.Optional(Type.String()),
    avatar: Type.Optional(
      Type.Object({
        secureUrl: Type.String(),
        url: Type.String(),
        publicId: Type.String(),
        format: Type.String(),
        resourceType: Type.String(),
      })
    ),
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
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      const { prisma, params, body } = request

      const id = params?.id ? parseInt(params.id, 10) : null

      if (id === null) {
        reply.send('error')
        return
      }

      const data: BodySchema = {}

      if (body.password) {
        data.password = (await fastify.hash.generate(body.password)) as string
      }

      const user = await prisma.user.update({
        select: {
          name: true,
          email: true,
        },
        where: {
          id,
        },
        data,
      })
      reply.send(user)
    }
  )
  next()
}

export default Update
