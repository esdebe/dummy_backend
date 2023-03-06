import {
  FastifyRequest,
  RawRequestDefaultExpression,
  RawServerDefault,
  FastifySchema,
} from 'fastify'

import { RouteGenericInterface } from 'fastify/types/route'

import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

export type FastifyRequestTypebox<TSchema extends FastifySchema> = FastifyRequest<
  RouteGenericInterface,
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  TSchema,
  TypeBoxTypeProvider
>
