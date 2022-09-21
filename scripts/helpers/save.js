import fs from 'fs'
import Jszip from 'jszip'

const compressionConfig = {
  type: "nodebuffer",
  compression: "DEFLATE",
  compressionOptions: {
    level: 9
  }
}

const fileConfig = {
    binary: true,
    compression: "DEFLATE"
}

export async function save(filePath) {
  const jszip = new Jszip()
  const directories = filePath.split('/')
  const fileName = directories[directories.length - 1]

  try {
    const data = fs.readFileSync(`${filePath}`)

    await jszip.file(`${fileName}`, data, fileConfig)
    await jszip.generateNodeStream({
      ...compressionConfig,
      streamFiles: true
    })
    .pipe(fs.createWriteStream(`${filePath}.zip`))

    return true
  } catch (err) {
    console.log('on save error', filePath, err.message)
    return false
  }
}
