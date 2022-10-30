/* eslint-disable no-console */
import zlib from 'zlib'
import axios from 'axios'
import Web3 from 'web3'
import ENS, { getEnsAddress } from '@ensdomains/ensjs'

import { detectMob } from '@/utils'
import networkConfig from '@/networkConfig'

const { APP_ENS_NAME } = process.env

const groth16 = require('websnark/src/groth16')

function buildGroth16() {
  const isMobile = detectMob()
  const wasmMemory = isMobile ? 1000 : 2000
  return groth16({ wasmInitialMemory: wasmMemory })
}

function getEns() {
  const provider = new Web3.providers.HttpProvider(networkConfig.netId1.rpcUrls.Infura.url)
  return new ENS({ provider, ensAddress: getEnsAddress('1') })
}

async function getTornadoKeys(getProgress) {
  try {
    const keys = await Promise.all([
      download({ name: 'tornado.json.gz', contentType: 'string' }),
      download({ name: 'tornadoProvingKey.bin.gz', contentType: 'arraybuffer', getProgress })
    ])

    return { circuit: JSON.parse(keys[0]), provingKey: keys[1].buffer }
  } catch (err) {
    throw err
  }
}

async function getIPFSIdFromENS(ensName) {
  try {
    const ens = getEns()

    const ensInterface = await ens.name(ensName)
    const { value } = await ensInterface.getContent(ensName)

    const [, id] = value.split('://')
    return id
  } catch (err) {
    throw new Error(err)
  }
}

async function fetchFile({ url, name, getProgress, id, retryAttempt = 0 }) {
  try {
    const response = await axios.get(`${url}/${name}`, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      onDownloadProgress: (progressEvent) => {
        if (typeof getProgress === 'function') {
          const progress = Math.round((progressEvent.loaded * 100) / 9626311)
          getProgress(progress)
        }
      }
    })

    return response
  } catch (err) {
    if (!id) {
      id = await getIPFSIdFromENS(APP_ENS_NAME)
    }
    const knownResources = [
      url,
      `https://ipfs.io/ipfs/${id}`,
      `https://dweb.link/ipfs/${id}`,
      `https://gateway.pinata.cloud/ipfs/${id}`
    ]

    if (retryAttempt < knownResources.length) {
      const fallbackUrl = knownResources[retryAttempt]
      retryAttempt++

      const response = await fetchFile({ name, getProgress, retryAttempt, id, url: fallbackUrl })

      return response
    }
    throw err
  }
}
/**
 * Function to download
 * @param {*} name filename
 * @param {'base64'|'string'|'binarystring'|'text'|'blob'|'uint8array'|'arraybuffer'|'array'|'nodebuffer'} contentType type of the content.
 * @param getProgress function
 */
async function download({ name, contentType, getProgress, eventName = 'events' }) {
  try {
    // eslint-disable-next-line no-undef
    const prefix = __webpack_public_path__.slice(0, -7)
    const response = await fetchFile({ getProgress, url: prefix, name })
    const buffer = Buffer.from(await response.data.arrayBuffer())
    const content = zlib.inflateSync(buffer)

    return content
  } catch (err) {
    throw err
  }
}

export { getTornadoKeys, buildGroth16, download }
