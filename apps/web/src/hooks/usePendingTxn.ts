import {
  DiGiTransactionStatusType,
  useDiGiTransactionStatusQuery
} from '@vibe/digi'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
  txHash?: string
  txId?: string
}

const usePendingTxn = ({ txHash, txId }: Props) => {
  const [indexed, setIndexed] = useState(false)

  const { data, loading, stopPolling } = useDiGiTransactionStatusQuery({
    variables: {
      request: { forTxHash: txHash, forTxId: txId }
    },
    skip: !txHash && !txHash?.length && !txId && !txId?.length,
    pollInterval: 1000,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data?.digiTransactionStatus?.reason) {
        stopPolling()
        setIndexed(false)
        return toast.error(data?.digiTransactionStatus?.reason)
      }
      if (
        data?.digiTransactionStatus?.__typename === 'DiGiTransactionResult' &&
        data?.digiTransactionStatus?.txHash &&
        data.digiTransactionStatus.status === DiGiTransactionStatusType.Complete
      ) {
        stopPolling()
        setIndexed(true)
      }
    }
  })

  useEffect(() => {
    setIndexed(false)
  }, [txHash, txId])

  return {
    data,
    indexed,
    loading,
    error: data?.digiTransactionStatus?.reason
  }
}

export default usePendingTxn
