import { FastifyReply } from 'fastify'
import { Type, Static } from '@sinclair/typebox'
import type { RouteGenericInterface } from 'fastify/types/route'
import { FastifyRequestTypebox } from '../../../lib/type-helper'

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

export const schema = {
  params: paramsSchema,
  body: bodySchema,
}

export interface Schema extends RouteGenericInterface {
  Params: ParamsSchema
  Body: BodySchema
}

type Handler = (request: FastifyRequestTypebox<typeof schema>, reply: FastifyReply) => Promise<void>

export const handler: Handler = async (request, reply) => {
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
