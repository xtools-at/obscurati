export default {
  netId133: {
    rpcCallRetryAttempt: 15,
    gasPrices: {
      instant: 35,
      fast: 32,
      standard: 28,
      low: 26
    },
    nativeCurrency: 'xp',
    currencyName: 'XP',
    explorerUrl: {
      // TODO:
      tx: 'https://example.com/tx/',
      address: 'https://example.com/address/',
      block: 'https://example.com/block/'
    },
    merkleTreeHeight: 20,
    emptyElement: '21663839004416932945382355908790599225266501822907911457504978515578255421292',
    networkName: 'B Devnet',
    deployedBlock: 33,
    multicall: '0x3F50A015D0483e86403c6AF86c8d85A875D4E3e9',
    echoContractAccount: '0x999f90f25a2922ae1b21A06066F7EDEbedad42a9',
    rpcUrls: {
      publicRpc: {
        name: 'Devnet RPC',
        url: 'https://rpc.connectednft.art:9650/ext/bc/2NXVLcGbemMjwyexwigxCoqn7UJ6DdeJdWNPxcWX4Y2eDem1aW/rpc'
      }
    },
    tokens: {
      xp: {
        instanceAddress: {
          '10': '0x76BF5E7d2Bcb06b1444C0a2742780051D8D0E304',
          '100': '0x802C3437397C49F7edBabbE1697F14BF0393F87d',
          '1000': '',
          '10000': ''
        },
        symbol: 'XP',
        decimals: 18
      }
      /*,
      usdct: {
        instanceAddress: {
          '10': '0x2df1051b1D24EFEF51e31849866FC787C75919DF',
          '100': '',
          '1000': '',
          '10000': ''
        },
        symbol: 'USDCT',
        decimals: 18,
        tokenAddress: '0x3438271Fd753b8b217447Bf7B18249347B282CCD',
        gasLimit: '80000'
      }
      */
    },
    ensSubdomainKey: 'devnet-tornado', // TODO
    pollInterval: 10,
    constants: {
      NOTE_ACCOUNT_BLOCK: 33,
      ENCRYPTED_NOTES_BLOCK: 33
    },
    'tornado-proxy-light.contract.tornadocash.eth': '0xe4c10B25979773090f6d86A0A6108c402a3f7E27'
  },
  netId1: {
    rpcCallRetryAttempt: 15,
    gasPrices: {
      instant: 80,
      fast: 50,
      standard: 25,
      low: 8
    },
    nativeCurrency: 'eth',
    currencyName: 'ETH',
    explorerUrl: {
      tx: 'https://etherscan.io/tx/',
      address: 'https://etherscan.io/address/',
      block: 'https://etherscan.io/block/'
    },
    merkleTreeHeight: 20,
    emptyElement: '21663839004416932945382355908790599225266501822907911457504978515578255421292',
    networkName: 'Ethereum Mainnet',
    deployedBlock: 9116966,
    rpcUrls: {
      secureRPC: {
        name: 'SecureRPC',
        url: 'https://api.securerpc.com/v1'
      }
    },
    multicall: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
    registryContract: '0x58E8dCC13BE9780fC42E8723D8EaD4CF46943dF2',
    echoContractAccount: '0x9B27DD5Bb15d42DC224FCD0B7caEbBe16161Df42',
    aggregatorContract: '0xE8F47A78A6D52D317D0D2FFFac56739fE14D1b49',
    tokens: {
      eth: {
        instanceAddress: {
          '0.1': '0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc',
          '1': '0x47CE0C6eD5B0Ce3d3A51fdb1C52DC66a7c3c2936',
          '10': '0x910Cbd523D972eb0a6f4cAe4618aD62622b39DbF',
          '100': '0xA160cdAB225685dA1d56aa342Ad8841c3b53f291'
        },
        symbol: 'ETH',
        decimals: 18
      },
      dai: {
        instanceAddress: {
          '100': '0xD4B88Df4D29F5CedD6857912842cff3b20C8Cfa3',
          '1000': '0xFD8610d20aA15b7B2E3Be39B396a1bC3516c7144',
          '10000': '0x07687e702b410Fa43f4cB4Af7FA097918ffD2730',
          '100000': '0x23773E65ed146A459791799d01336DB287f25334'
        },
        tokenAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        symbol: 'DAI',
        decimals: 18,
        gasLimit: '55000'
      },
      cdai: {
        instanceAddress: {
          '5000': '0x22aaA7720ddd5388A3c0A3333430953C68f1849b',
          '50000': '0x03893a7c7463AE47D46bc7f091665f1893656003',
          '500000': '0x2717c5e28cf931547B621a5dddb772Ab6A35B701',
          '5000000': '0xD21be7248e0197Ee08E0c20D4a96DEBdaC3D20Af'
        },
        tokenAddress: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
        symbol: 'cDAI',
        decimals: 8,
        gasLimit: '425000'
      },
      usdc: {
        instanceAddress: {
          '100': '0xd96f2B1c14Db8458374d9Aca76E26c3D18364307',
          '1000': '0x4736dCf1b7A3d580672CcE6E7c65cd5cc9cFBa9D',
          '10000': '',
          '100000': ''
        },
        tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        symbol: 'USDC',
        decimals: 6,
        gasLimit: '80000'
      },
      usdt: {
        instanceAddress: {
          '100': '0x169AD27A470D064DEDE56a2D3ff727986b15D52B',
          '1000': '0x0836222F2B2B24A3F36f98668Ed8F0B38D1a872f',
          '10000': '',
          '100000': ''
        },
        tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        symbol: 'USDT',
        decimals: 6,
        gasLimit: '100000'
      },
      wbtc: {
        instanceAddress: {
          '0.1': '0x178169B423a011fff22B9e3F3abeA13414dDD0F1',
          '1': '0x610B717796ad172B316836AC95a2ffad065CeaB4',
          '10': '0xbB93e510BbCD0B7beb5A853875f9eC60275CF498',
          '100': ''
        },
        tokenAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        symbol: 'WBTC',
        decimals: 8,
        gasLimit: '85000'
      }
    },
    ensSubdomainKey: 'mainnet-tornado',
    pollInterval: 15,
    constants: {
      GOVERNANCE_BLOCK: 11474695,
      NOTE_ACCOUNT_BLOCK: 11842486,
      ENCRYPTED_NOTES_BLOCK: 14248730,
      MINING_BLOCK_TIME: 15
    },
    'torn.contract.tornadocash.eth': '0x77777FeDdddFfC19Ff86DB637967013e6C6A116C',
    'governance.contract.tornadocash.eth': '0x5efda50f22d34F262c29268506C5Fa42cB56A1Ce',
    'tornado-router.contract.tornadocash.eth': '0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b',
    'staking-rewards.contract.tornadocash.eth': '0x2FC93484614a34f26F7970CBB94615bA109BB4bf'
  }
}
