import * as dotenv from 'dotenv'
import path from 'path'
import Fastify from 'fastify'
import fastifyAutoload from '@fastify/autoload'
import fastifyCookie from '@fastify/cookie'
import fastifyDayjs from 'fastify-dayjs'
import fastifyEnv from '@fastify/env'
import fastifyMultipart from '@fastify/multipart'
import fastifyPrismaClient from 'fastify-prisma-client'
import fastifyRoutes from '@fastify/routes'
import fastifySensible from '@fastify/sensible'
import { TypeBoxTypeProvider, TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox'
import qs from 'qs'

import { schema } from './config'
import authenticate from './authenticate'
import hash from './hash'
import redis from './redis'
import onFile from './onFile'
import paginated from './paginated'

import { setFormat } from './format'

dotenv.config()

const fastify = Fastify({
  querystringParser: (str) => qs.parse(str),
})
  .setValidatorCompiler(TypeBoxValidatorCompiler)
  .withTypeProvider<TypeBoxTypeProvider>()

const initialize = async () => {
  setFormat()

  await fastify.register(fastifyEnv, {
    schema,
    data: process.env,
    dotenv: true,
  })

  await fastify.register(fastifySensible, {})

  await fastify.register(fastifyRoutes, {})

  await fastify.register(fastifyMultipart, {
    attachFieldsToBody: 'keyValues',
    onFile: onFile(fastify.config),
  })

  await fastify.register(fastifyPrismaClient)

  await fastify.register(paginated)

  await fastify.register(fastifyDayjs)

  await fastify.register(redis)

  await fastify.register(hash)

  await fastify.register(authenticate)

  await fastify.register(fastifyCookie, {
    secret: fastify.config.COOKIE_SECRET,
    hook: 'onRequest',
    parseOptions: {},
  })

  const rootPath = path.resolve(__dirname, '..')

  const routesPath = path.join(rootPath, 'app')

  await fastify.register(fastifyAutoload, {
    dir: routesPath,
    prefix: '/',
    ignorePattern: /types/,
  })
}

export { initialize, fastify }
