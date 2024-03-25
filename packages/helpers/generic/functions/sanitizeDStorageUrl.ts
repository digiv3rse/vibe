import { ARWEAVE_GATEWAY_URL, IPFS_GATEWAY_URL } from '@vibe/constants'

export const sanitizeDStorageUrl = (url: string) => {
  const ipfsGateway = `${IPFS_GATEWAY_URL}/`
  const arweaveGateway = `${ARWEAVE_GATEWAY_URL}/`
  if (!url) {
    return url
  }

  return url
    .replace(/^Qm[1-9A-Za-z]{44}/gm, `${ipfsGateway}/${url}`)
    .replace('https://ipfs.io/ipfs/', ipfsGateway)
    .replace('https://ipfs.infura.io/ipfs/', ipfsGateway)
    .replace('https://gateway.pinata.cloud/ipfs/', ipfsGateway)
    .replace('https://nftstorage.link/ipfs/', ipfsGateway)
    .replace('ipfs://ipfs/', ipfsGateway)
    .replace('ar://', arweaveGateway)
    .replace('ipfs://', ipfsGateway)
}
