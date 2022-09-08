import networkConfig from '../networkConfig'
import ABI from '../abis/Instance.abi.json'
import { loadCachedEvents, getPastEvents } from './helpers'

const EVENTS_PATH = './static/events/'
const enabledChains = ['1', '56', '100', '137' ]

async function main() {
  for (let network in enabledChains) {
    const netId = enabledChains[network]
    const config = networkConfig[`netId${netId}`]
    const { constants, tokens, nativeCurrency, deployedBlock } = config
    const CONTRACTS = tokens[nativeCurrency].instanceAddress

    console.log(`\n ::: ${netId} [${nativeCurrency.toUpperCase()}] :::`)

    for (const [instance, _contract] of Object.entries(CONTRACTS)) {
      console.log(`\n instanceDenomation - ${instance}`)

      const withdrawalCachedEvents = await loadCachedEvents({
        name: `withdrawals_${nativeCurrency}_${instance}.json`,
        directory: EVENTS_PATH,
        deployedBlock
      })

      console.log('- Withdrawals')
      console.log('cachedEvents count - ', withdrawalCachedEvents.events.length)
      console.log('lastBlock - ', withdrawalCachedEvents.lastBlock)

      const depositCachedEvents = await loadCachedEvents({
        name: `withdrawals_${nativeCurrency}_${instance}.json`,
        directory: EVENTS_PATH,
        deployedBlock
      })

      console.log('- Deposits')
      console.log('cachedEvents count - ', depositCachedEvents.events.length)
      console.log('lastBlock - ', depositCachedEvents.lastBlock)

      const notesCachedEvents = await loadCachedEvents({
        name: `encrypted_notes_${netId}.json`,
        directory: EVENTS_PATH,
        deployedBlock: constants.ENCRYPTED_NOTES_BLOCK
      })

      console.log('- Notes')
      console.log('cachedEvents count - ', notesCachedEvents.events.length)
      console.log('lastBlock - ', notesCachedEvents.lastBlock)

    }
  }
}

main()
