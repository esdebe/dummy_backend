import uploadStream from './uploadStream'

type OnFileConfig = {
  CLOUDINARY_KEY: string
  CLOUDINARY_NAME: string
  CLOUDINARY_SECRET: string
}

const onFile = (config: OnFileConfig) => async (part: any) => {
  const buffer = await part.toBuffer()
  const response = await uploadStream(buffer, config)
  part.value = response // eslint-disable-line no-param-reassign
}

export default onFile
