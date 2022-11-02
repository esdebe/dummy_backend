import { initialize, fastify } from '../lib/server'

initialize()

export default async (req: any, res: any) => {
  await fastify.ready()
  fastify.server.emit('request', req, res)
}
