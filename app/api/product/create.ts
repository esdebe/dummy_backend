import { Type, Static } from '@sinclair/typebox'
import { FastifyReply } from 'fastify'
import type { RouteGenericInterface } from 'fastify/types/route'
import { FastifyRequestTypebox } from '../../../lib/type-helper'

const bodySchema = Type.Object({
  name: Type.String(),
  quantity: Type.Number(),
})

type BodySchema = Static<typeof bodySchema>

export interface Schema extends RouteGenericInterface {
  Body: BodySchema
}

export const schema = {
  body: bodySchema,
}

type Handler = (request: FastifyRequestTypebox<typeof schema>, reply: FastifyReply) => Promise<void>

export const handler: Handler = async (request, reply) => {
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
