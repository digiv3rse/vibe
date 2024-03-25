import { create } from 'zustand'

interface NonceState {
  digiHubOnchainSigNonce: number
  setDiGiHubOnchainSigNonce: (nonce: number) => void
}

const useNonceStore = create<NonceState>((set) => ({
  digiHubOnchainSigNonce: 0,
  setDiGiHubOnchainSigNonce: (nonce: number) =>
    set({ digiHubOnchainSigNonce: nonce })
}))

export default useNonceStore
