import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox'
import { Type, Static } from '@sinclair/typebox'
import type { RouteGenericInterface } from 'fastify/types/route'
import omit from 'lodash/omit'

const bodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String(),
})

type BodySchema = Static<typeof bodySchema>

export const schema = {
  body: bodySchema,
}

export interface Schema extends RouteGenericInterface {
  Body: BodySchema
}

const Session: FastifyPluginCallbackTypebox = (fastify, _options, next): void => {
  fastify.post<Schema>(
    '/session',
    {
      prefixTrailingSlash: 'no-slash',
      schema,
    },
    async (request, reply) => {
      const { prisma, body } = request

      try {
        const user = await prisma.user.findFirstOrThrow({
          where: {
            email: body.email,
          },
        })

        const validPassword = (await fastify.hash.verify(body.password, user.password)) as boolean

        const payload = omit(user, ['password'])

        if (validPassword) {
          reply.jwtSign(payload, (err, session) => reply.send(err || { session }))
        } else {
          reply.status(401).send('UNAUTHORIZED')
        }
      } catch (e) {
        reply.status(422).send('Failed To Create Account')
      }
    }
  )

  next()
}

export default Session
