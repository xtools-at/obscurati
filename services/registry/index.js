import Web3 from 'web3'
import namehash from 'eth-ens-namehash'
import { BigNumber as BN } from 'bignumber.js'
import { toChecksumAddress, isAddress } from 'web3-utils'

import networkConfig from '@/networkConfig'
import { REGISTRY_DEPLOYED_BLOCK } from '@/constants'
import { sleep, flattenNArray } from '@/utils'

import AggregatorABI from '@/abis/Aggregator.abi.json'
import RelayerRegistryABI from '@/abis/RelayerRegistry.abi.json'

const MIN_STAKE_BALANCE = '0x22B1C8C1227A00000' // 40 TORN

const subdomains = Object.values(networkConfig).map(({ ensSubdomainKey }) => ensSubdomainKey)

class RelayerRegister {
  constructor(provider) {
    this.provider = provider
    this.$indexedDB = window.$nuxt.$indexedDB(1)

    const { registryContract, aggregatorContract } = networkConfig.netId1

    this.aggregator = new this.provider.Contract(AggregatorABI, aggregatorContract)
    this.relayerRegistry = new this.provider.Contract(RelayerRegistryABI, registryContract)
  }

  fetchEvents = ({ fromBlock, toBlock }, shouldRetry = false) => {
    return new Promise((resolve, reject) => {
      if (fromBlock <= toBlock) {
        try {
          const registeredEventsPart = this.relayerRegistry.getPastEvents('RelayerRegistered', {
            fromBlock,
            toBlock
          })

          resolve(registeredEventsPart)
        } catch (error) {
          if (shouldRetry) {
            sleep(500)

            const events = this.fetchEvents({ fromBlock, toBlock })

            resolve(events)
          } else {
            reject(new Error(error))
          }
        }
      } else {
        resolve([])
      }
    })
  }

  batchFetchEvents = async ({ fromBlock, toBlock }) => {
    const blockRange = 10000
    const blockDifference = toBlock - fromBlock
    const chunkCount = Math.ceil(blockDifference / blockRange)
    const blockDenom = Math.ceil(blockDifference / chunkCount)

    const promises = new Array(chunkCount).fill('').map(
      (_, i) =>
        new Promise((resolve) => {
          sleep(20 * i)
          const batch = this.fetchEvents(
            {
              fromBlock: i * blockDenom + fromBlock,
              toBlock: (i + 1) * blockDenom + fromBlock
            },
            true
          )
          resolve(batch)
        })
    )

    const batchEvents = flattenNArray(await Promise.all(promises))
    const events = batchEvents.map((e) => ({ ...e.returnValues }))

    return events
  }

  saveEvents = async ({ events, lastSyncBlock, storeName }) => {
    try {
      if (this.$indexedDB.isBlocked) {
        return
      }

      await this.$indexedDB.putItem({
        data: {
          blockNumber: lastSyncBlock,
          name: storeName
        },
        storeName: 'lastEvents'
      })

      if (events.length) {
        this.$indexedDB.createMultipleTransactions({ data: events, storeName })
      }
    } catch (err) {
      console.error(`saveEvents has error: ${err.message}`)
    }
  }

  getCachedData = async () => {
    let blockFrom = REGISTRY_DEPLOYED_BLOCK[1]

    try {
      const blockTo = await this.provider.getBlockNumber()

      const cachedEvents = await this.$indexedDB.getAll({
        storeName: 'register_events'
      })

      const lastBlock = await this.$indexedDB.getFromIndex({
        indexName: 'name',
        key: 'register_events',
        storeName: 'lastEvents'
      })

      if (lastBlock) {
        blockFrom = blockTo >= lastBlock.blockNumber ? lastBlock.blockNumber + 1 : blockTo
      }

      return { blockFrom, blockTo, cachedEvents }
    } catch {
      return { blockFrom, blockTo: 'latest', cachedEvents: [] }
    }
  }

  getENSAddress = async (ensName) => {
    const { url } = Object.values(networkConfig.netId1.rpcUrls)[0]
    const provider = new Web3(url)

    const ensAddress = await provider.eth.ens.getAddress(ensName)

    return ensAddress
  }

  fetchRelayers = async () => {
    const blockRange = 10000
    // eslint-disable-next-line prefer-const
    let { blockTo, cachedEvents } = await this.getCachedData()
    let allRelayers = cachedEvents

    const currentBlockNumber = await this.provider.getBlockNumber()
    const fromBlock = cachedEvents.length === 0 ? REGISTRY_DEPLOYED_BLOCK[1] : blockTo
    const blockDifference = currentBlockNumber - fromBlock

    try {
      let toBlock
      let registerRelayerEvents
      let lastSyncBlock = blockTo

      if (cachedEvents.length > 0 || blockDifference === 0) {
        return cachedEvents
      } else if (blockDifference >= blockRange) {
        toBlock = currentBlockNumber
        registerRelayerEvents = await this.batchFetchEvents({ fromBlock, toBlock })
        lastSyncBlock = toBlock
      } else {
        toBlock = fromBlock + blockRange
        registerRelayerEvents = await this.fetchEvents({ fromBlock, toBlock }, true)
        lastSyncBlock = toBlock
      }

      const relayerEvents = cachedEvents.concat(registerRelayerEvents || [])
      const events = []

      for (let x = 0; x < relayerEvents.length; x++) {
        const { ensName, relayerAddress } = relayerEvents[x]
        let ensAddress
        if (!isAddress(relayerAddress)) {
          ensAddress = await this.getENSAddress(ensName)
          ensAddress = toChecksumAddress(ensAddress)
        } else {
          ensAddress = relayerAddress
        }

        events.push({ ensName, relayerAddress: ensAddress })
      }

      await this.saveEvents({ storeName: 'register_events', lastSyncBlock, events })

      allRelayers = allRelayers.concat(events)
    } catch (err) {
      console.log(err)
    }
    return allRelayers
  }

  filterRelayer = (acc, curr, ensSubdomainKey, relayer) => {
    const subdomainIndex = subdomains.indexOf(ensSubdomainKey)
    const mainnetSubdomain = curr.records[0]
    const hostname = curr.records[subdomainIndex]
    const isHostWithProtocol = hostname.includes('http')

    const isOwner = relayer.relayerAddress === curr.owner
    const hasMinBalance = new BN(curr.balance).gte(MIN_STAKE_BALANCE)

    if (
      hostname &&
      isOwner &&
      mainnetSubdomain &&
      curr.isRegistered &&
      hasMinBalance &&
      !isHostWithProtocol
    ) {
      acc.push({
        hostname,
        ensName: relayer.ensName,
        stakeBalance: curr.balance,
        relayerAddress: relayer.relayerAddress
      })
    } else {
      console.error(`${relayer.ensName} invalid: `, {
        isOwner,
        hasTXT: Boolean(hostname),
        isHasMinBalance: hasMinBalance,
        isRegistered: curr.isRegistered,
        isHostWithoutProtocol: !isHostWithProtocol,
        isMainnetSubdomain: Boolean(mainnetSubdomain)
      })
    }

    return acc
  }

  getValidRelayers = async (relayers, ensSubdomainKey) => {
    const relayerNameHashes = relayers.map((r) => namehash.hash(r.ensName))

    const relayersData = await this.aggregator.methods.relayersData(relayerNameHashes, subdomains).call()

    const validRelayers = relayersData.reduce(
      (acc, curr, index) => this.filterRelayer(acc, curr, ensSubdomainKey, relayers[index]),
      []
    )

    return validRelayers
  }

  getRelayers = async (ensSubdomainKey) => {
    const relayers = await this.fetchRelayers()
    const validRelayers = await this.getValidRelayers(relayers, ensSubdomainKey)

    return validRelayers
  }
}

export const relayerRegisterService = (provider) => new RelayerRegister(provider.eth)
