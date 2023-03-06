import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox'
import * as product from './product'
import * as user from './user'

const Api: FastifyPluginCallbackTypebox = (fastify, _options, next): void => {
  // product
  fastify.post('/api/product', { schema: product.create.schema }, product.create.handler)
  fastify.get('/api/product', { schema: product.list.schema }, product.list.handler)
  fastify.post('/api/product/:id', { schema: product.update.schema }, product.update.handler)
  fastify.delete('/api/product/:id', { schema: product.destroy.schema }, product.destroy.handler)

  // user
  fastify.post('/api/user/:id', { schema: user.update.schema }, user.update.handler)
  fastify.get('/api/user', { schema: user.list.schema }, user.list.handler)

  next()
}

export default Api
