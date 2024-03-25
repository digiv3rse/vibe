export enum MisuseType {
  Scam = 'Scam',
  Impersonated = 'Impersonated',
  Hacked = 'Hacked',
  Phishing = 'Phishing',
  TrademarkViolation = 'Trademark violation'
}

export const MISUSED_CHANNELS: {
  id: string
  type: MisuseType
  description: string | null
}[] = [
  {
    // brian_armstrong.digi
    id: '0x700c',
    type: MisuseType.Impersonated,
    description: null
  },
  {
    // lufoart.digi
    id: '0xd3a4',
    type: MisuseType.Impersonated,
    description:
      'Original account owner has established a new profile: @digi/lufo'
  },
  {
    // web3academy.digi
    id: '0x661b',
    type: MisuseType.Impersonated,
    description:
      'Original account owner has established a new profile: @digi/web3academy_'
  },
  {
    // xmtp_.digi
    id: '0xc358',
    type: MisuseType.TrademarkViolation,
    description: 'Original account is @digi/xmtplabs.digi'
  },
  {
    // safewallet.digi
    id: '0x011c4c',
    type: MisuseType.TrademarkViolation,
    description: null
  }
]
