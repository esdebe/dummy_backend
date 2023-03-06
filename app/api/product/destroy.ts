import { Type, Static } from '@sinclair/typebox'
import { FastifyReply } from 'fastify'
import type { RouteGenericInterface } from 'fastify/types/route'
import { FastifyRequestTypebox } from '../../../lib/type-helper'

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

type Handler = (request: FastifyRequestTypebox<typeof schema>, reply: FastifyReply) => Promise<void>

export const handler: Handler = async (request, reply) => {
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
