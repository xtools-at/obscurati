const Web3 = require('web3-eth')

const InstanceABI = require('../abis/Instance.abi.json')
const networkConfig = require('../networkConfig').default

const getContract = (rpcUrl, netId, currency, amount) => {
  const provider = new Web3(rpcUrl)
  const config = networkConfig[`netId${netId}`]
  const address = config.tokens[currency].instanceAddress[amount]
  const contract = new provider.Contract(InstanceABI, address)

  return contract
}

const getBatchEvents = async ({ netId, rpcUrl, currency, amount, type, payload }, [port]) => {
  try {
    const { chunkSize, blocks } = payload
    const contract = getContract(rpcUrl, netId, currency, amount)

    let batchEvents = []

    console.log('Fetching block ranges', blocks)

    for (let x in blocks) {
      const toBlock = blocks[x]
      const fromBlock = toBlock - chunkSize

      try {
        const events = await contract.getPastEvents(type, {
          fromBlock,
          toBlock
        })

        batchEvents = batchEvents.concat(events)
      } catch (e) {
        console.log(`Failed to fetch ${toBlock}: ${e}`)
        x = x - 1
      }
    }

    port.postMessage({ result: batchEvents })
  } catch (e) {
    port.postMessage({ errorMessage: e })
  }
}

const handlePayload = ({ data, ports }) => {
  switch (data.eventName) {
    case 'batch_events':
      getBatchEvents(data, ports)
      break
    default:
      break
  }
}

self.addEventListener('message', handlePayload, false)
