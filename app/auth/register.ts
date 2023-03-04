import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox'
import { Type, Static } from '@sinclair/typebox'
import type { RouteGenericInterface } from 'fastify/types/route'

const bodySchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  password: Type.String(),
})

type BodySchema = Static<typeof bodySchema>

export interface Schema extends RouteGenericInterface {
  Body: BodySchema
}

export const schema = {
  body: bodySchema,
}

const Register: FastifyPluginCallbackTypebox = (fastify, _options, next): void => {
  fastify.post<Schema>(
    '/register',
    {
      prefixTrailingSlash: 'no-slash',
      schema,
    },
    async (request, reply) => {
      const { prisma, body } = request

      try {
        const user = await prisma.user.create({
          data: {
            ...body,
            password: (await fastify.hash.generate(body.password)) as string,
          },
          select: {
            name: true,
            email: true,
          },
        })
        reply.status(201).send(user)
      } catch {
        reply.status(422).send('Failed To Create Account')
      }
    }
  )
  next()
}

export default Register
