import cloudinary from 'cloudinary'
import { Readable } from 'stream'

type UploadStreamResponse = {
  secureUrl: string
  url: string
  publicId: string
  format: string
  resourceType: string
}

export default async function uploadStream(buffer: any, config: any) {
  cloudinary.v2.config({
    cloud_name: config.CLOUDINARY_NAME,
    api_key: config.CLOUDINARY_KEY,
    api_secret: config.CLOUDINARY_SECRET,
  })

  return new Promise<UploadStreamResponse | undefined>((resolve, reject) => {
    const callback: cloudinary.UploadResponseCallback = (error, result) => {
      // should we return ?
      if (error) reject(error)

      const secureUrl = result?.secure_url
      const url = result?.url
      const publicId = result?.public_id
      const format = result?.format
      const resourceType = result?.resource_type

      if (secureUrl && url && publicId && format && resourceType) {
        resolve({ secureUrl, url, publicId, format, resourceType })
      }
    }

    const options: cloudinary.UploadApiOptions = {
      folder: 'upload',
    }

    const upload = cloudinary.v2.uploader.upload_stream(options, callback)

    const stream = Readable.from(buffer)

    stream.pipe(upload)
  })
}
