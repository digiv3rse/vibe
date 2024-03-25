import { CustomFiltersType } from '@vibe/digi'
import DiGiEndpoint from '@vibe/digi/endpoints'

export const VIBE_APP_NAME = 'Vibe'
export const VIBE_APP_DESCRIPTION = 'Talk, Amplify, Post, Explore'

export const DIGI_ENV = process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'mainnet'
export const IS_MAINNET = DIGI_ENV === 'mainnet'

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const IS_PRODUCTION = !IS_DEVELOPMENT

export const STATIC_ASSETS = 'https://static.digiv3rse.xyz'
export const VIBE_WEBSITE_URL = IS_MAINNET
  ? 'https://digiv3rse.social'
  : 'https://digiv3rse.social'
export const FALLBACK_THUMBNAIL_URL = `${STATIC_ASSETS}/images/fallback-thumbnail.webp`
export const FALLBACK_COVER_URL = `${STATIC_ASSETS}/images/fallback-cover.svg`
export const OG_IMAGE = `${STATIC_ASSETS}/brand/og.png`
export const DIGI_IMAGEKIT_SNAPSHOT_URL =
  'https://ik.imagekit.io/digiv3rse/snapshot/'

// infinite scroll
export const INFINITE_SCROLL_ROOT_MARGIN = '800px'

export const IMAGE_TRANSFORMATIONS = {
  AVATAR: 'tr:w-60,h-60',
  AVATAR_LG: 'tr:w-300,h-300',
  THUMBNAIL: 'tr:w-720,h-404',
  THUMBNAIL_V: 'tr:w-404,h-720',
  SQUARE: 'tr:w-200,h-200'
}

// digi
export const MAINNET_API_URL = DiGiEndpoint.Mainnet
export const TESTNET_API_URL = DiGiEndpoint.Staging
export const DIGI_API_URL = IS_MAINNET ? MAINNET_API_URL : TESTNET_API_URL

// api urls
export const VIBE_EMBED_URL = IS_MAINNET
  ? 'https://embed.digiv3rse.social'
  : 'https://embed-testnet.digiv3rse.social'
export const VIBE_API_URL = IS_PRODUCTION
  ? 'https://api.digiv3rse.social'
  : 'http://localhost:4000'

// vibe addresses
export const VIBE_SIGNUP_PROXY_ADDRESS = IS_MAINNET
  ? '0x3Acf42498c4F5f29B282BEa749248a890Ad398d2'
  : '0x3Acf42498c4F5f29B282BEa749248a890Ad398d2'

// digi addresses
export const DIGI_PERMISSIONLESS_CREATOR_ADDRESS = IS_MAINNET
  ? '0x9Cd4AC51FC2d931506c61C75C3Cad900b2D04D1d'
  : '0x9Cd4AC51FC2d931506c61C75C3Cad900b2D04D1d'
export const DIGIHUB_PROXY_ADDRESS = IS_MAINNET
  ? '0xf01d0B6663af27EfB3BB9E8A007509fF4A8e4a94'
  : '0xf01d0B6663af27EfB3BB9E8A007509fF4A8e4a94'
export const DIGI_TOKEN_ADDRESS = IS_MAINNET
  ? '0xdF3031218BA9366A59FE84dA66837428aEf57c9C'
  : '0xdF3031218BA9366A59FE84dA66837428aEf57c9C'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const TESTNET_ALLOWED_TOKENS = [
  {
    address: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    decimals: 18,
    name: 'Wrapped Matic',
    symbol: 'WMATIC'
  },
  {
    address: '0xdF3031218BA9366A59FE84dA66837428aEf57c9C',
    decimals: 18,
    name: 'DIGI Token',
    symbol: 'DIGI'
  }
]

// ethereum
export const SEPOLIA_RPC_URL = IS_MAINNET
  ? 'https://rpc.ankr.com/eth_sepolia'
  : 'https://rpc.ankr.com/ethereum_mumbai'
export const ETHERSCAN_URL = IS_MAINNET
  ? 'https://sepolia.etherscan.io'
  : 'https://mumbai.ethereumscan.com'
// export const ETHERSCAN_URL = IS_MAINNET
//  ? 'https://etherscan.io'
//  : 'https://goerli.etherscan.io'
export const SEPOLIA_CHAIN_ID = IS_MAINNET ? 11155111 : 80001

// ipfs
export const IPFS_FREE_UPLOAD_LIMIT = IS_MAINNET ? 6000 : 0 // in MB
export const IPFS_GATEWAY_URL = 'https://cloudflare-ipfs.com/ipfs'
export const STORAGE_ENDPOINT = 'https://gateway.storjshare.io'
export const STORAGE_REGION = 'Api1'

// walletconnect
export const WC_PROJECT_ID = 'dc71b3ee554d2fe785ae7eebe2437573'
export const EXPLORER_RECOMMENDED_WALLET_IDS = [
  'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // metamask
  'ecc4036f814562b41a5268adc86270fba1365471402006302e70169465b7ac18', // zerion
  '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369', // rainbow
  'c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a', // uniswap
  '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927' // ledger live
]

// livepeer
export const LIVEPEER_STUDIO_API_KEY = IS_PRODUCTION
  ? '0327943a-ea8d-4782-924f-7f86fbe5cf82'
  : ''

// workers
export const WORKER_LIVEPEER_VIEWS_URL = `${VIBE_API_URL}/views`
export const WORKER_IRYS_METADATA_UPLOAD_URL = `${VIBE_API_URL}/metadata`
export const WORKER_LOGTAIL_INGEST_URL = `${VIBE_API_URL}/tail`
export const WORKER_STS_TOKEN_URL = `${VIBE_API_URL}/sts`
export const WORKER_RECS_URL = `${VIBE_API_URL}/recommendations`
export const WORKER_DID_URL = `${VIBE_API_URL}/did`
export const WORKER_TOWER_URL = `${VIBE_API_URL}/tower`
export const WORKER_OEMBED_URL = `${VIBE_API_URL}/oembed`
export const WORKER_VERIFIED_URL = `${VIBE_API_URL}/verified`
export const WORKER_TOGGLES_URL = `${VIBE_API_URL}/toggles`
export const WORKER_ALLOWED_TOKENS_URL = `${VIBE_API_URL}/allowed-tokens`

// irys
export const IRYS_NETWORK = IS_MAINNET ? 'mainnet' : 'devnet'
export const IRYS_CURRENCY = 'matic'
export const ARWEAVE_GATEWAY_URL = 'https://gateway.irys.xyz'
export const IRYS_CONNECT_MESSAGE = 'Estimating video upload cost...'
export const REQUESTING_SIGNATURE_MESSAGE = 'Requesting signature...'
export const MOONPAY_URL = IS_MAINNET
  ? 'https://buy.moonpay.com'
  : 'https://buy-sandbox.moonpay.com'

// error messages
export const ERROR_MESSAGE = 'Oops, something went wrong!'
export const SIGN_IN_REQUIRED = 'Login to continue'

// App Ids
export const VIBE_APP_ID = 'vibe'
export const DIGITUBE_APP_ID = 'digitube'
export const DIGITUBE_BYTES_APP_ID = 'digitube-bytes'
export const ALLOWED_APP_IDS = [
  DIGITUBE_APP_ID
  // 'digiter',
  // 'orb',
  // 'hey',
  // 'buttrfly',
  // 'digiplay',
  // 'diversehq'
]

// official
export const VIBE_X_HANDLE = 'vib3'
export const VIBE_GITHUB_HANDLE = 'digiv3rse'
export const VIBE_LOGO = `${STATIC_ASSETS}/brand/logo.svg`
export const VIBE_STATUS_PAGE = 'https://status.digiv3rse.social'
export const VIBE_FEEDBACK_URL = 'https://feedback.digiv3rse.social'

// admin
export const ADMIN_IDS = IS_MAINNET ? ['0x2d'] : []
export const MOD_IDS = IS_MAINNET ? [...ADMIN_IDS] : []
export const VIBE_ADMIN_ADDRESS = '0xd53B6196F526b2cf0a5F3a35a03B23B2D02b26c4'

// digi
export const DIGI_CUSTOM_FILTERS = [CustomFiltersType.Gardeners]
export const ALLOWED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/mpeg',
  'video/webm',
  'video/quicktime',
  'video/mov'
]
export const ALLOWED_AUDIO_MIME_TYPES = [
  'audio/mp3',
  'audio/mpeg',
  'audio/mp4',
  'audio/wav',
  'audio/vnd.wave',
  'audio/webm'
]
export const ALLOWED_UPLOAD_MIME_TYPES = [
  ...ALLOWED_AUDIO_MIME_TYPES,
  ...ALLOWED_VIDEO_MIME_TYPES
]

export const DIGI_NAMESPACE_PREFIX = IS_MAINNET ? 'digi' : 'test/'
export const LEGACY_DIGI_HANDLE_SUFFIX = IS_MAINNET ? '.digi' : '.test'

// other apps
export const HEY_WEBSITE_URL = IS_MAINNET
  ? 'https://hey.xyz'
  : 'https://testnet.hey.xyz'

// banners
export const SHOW_GITCOIN_BANNER = false
export const GITCOIN_LIVE_ROUND = 20

// open actions
export const ZORA_MAINNET_CHAINS = ['eth', 'oeth', 'base', 'zora']
export const FEATURED_ZORA_COLLECTS = [
  'https://zora.co/collect/zora:0x4e18d1be29f54d6c11935939e36c9988897c145e',
  'https://zora.co/collect/eth:0x5ec5a9b979a7fd4835a7ce9bdf3090209ec0fc8a/1',
  'https://zora.co/collect/eth:0x0bc2a24ce568dad89691116d5b34deb6c203f342/193',
  'https://zora.co/collect/eth:0x7ad18982781ae3d68d1c964f61b872fb2f899021',
  'https://zora.co/collect/zora:0xc8b408c889baeed2704168de3b3b8795158ca187',
  'https://zora.co/collect/zora:0xd4889d519b1ab9b2fa8634e0271118de480f6d32',
  'https://zora.co/collect/zora:0xab821ed94191628354078bcbb206512914eb42e1'
]
