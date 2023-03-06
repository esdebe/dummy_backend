import fastifyPlugin from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { scrypt, randomBytes, timingSafeEqual } from 'crypto'

interface FastifyInstanceHash {
  verify: (password: string, hashed: string) => Promise<boolean> | Promise<unknown>
  generate: (password: string) => Promise<string> | Promise<unknown>
}

declare module 'fastify' {
  interface FastifyRequest {
    hash: FastifyInstanceHash
  }
  interface FastifyInstance {
    hash: FastifyInstanceHash
  }
}

const keyLength = 32

const generate: FastifyInstanceHash['generate'] = async (password) => {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString('hex')

    scrypt(password, salt, keyLength, (err, derivedKey) => {
      if (err) reject(err)
      resolve(`${salt}.${derivedKey.toString('hex')}`)
    })
  })
}

const verify: FastifyInstanceHash['verify'] = async (password, hashed) => {
  return new Promise((resolve, reject) => {
    const [salt, hashKey] = hashed.split('.')

    const hashKeyBuff = Buffer.from(hashKey, 'hex')

    scrypt(password, salt, keyLength, (err, derivedKey) => {
      if (err) reject(err)
      resolve(timingSafeEqual(hashKeyBuff, derivedKey))
    })
  })
}

const fastifyHashDecorator: FastifyPluginAsync = async (fastify) => {
  fastify
    .decorate('hash', {
      verify,
      generate,
    })
    .decorateRequest('hash', { getter: () => fastify.hash })
}

export default fastifyPlugin(fastifyHashDecorator, {
  fastify: '*',
  name: 'fastify-hash-decorator',
})
