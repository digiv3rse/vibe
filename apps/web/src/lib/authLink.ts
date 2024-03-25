import { hydrateAuthTokens, signIn, signOut } from '@lib/store/auth'
import { DIGI_API_URL } from '@vibe/constants'
import { ApolloLink, fromPromise, toPromise } from '@vibe/digi/apollo'
import { logger, parseJwt } from '@vibe/generic'
import axios from 'axios'

const REFRESH_AUTHENTICATION_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      accessToken
      refreshToken
    }
  }
`

const authLink = new ApolloLink((operation, forward) => {
  const { accessToken, refreshToken } = hydrateAuthTokens()
  if (!refreshToken) {
    signOut()
    return forward(operation)
  }

  if (accessToken) {
    const willExpireSoon = Date.now() >= parseJwt(accessToken)?.exp * 1000
    if (!willExpireSoon) {
      operation.setContext({
        headers: {
          'x-access-token': accessToken ? `Bearer ${accessToken}` : ''
        }
      })
      return forward(operation)
    }
  }
  return fromPromise(
    axios
      .post(
        DIGI_API_URL,
        JSON.stringify({
          operationName: 'Refresh',
          query: REFRESH_AUTHENTICATION_MUTATION,
          variables: {
            request: { refreshToken }
          }
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then(({ data: result }) => {
        operation.setContext({
          headers: {
            'x-access-token': `Bearer ${result?.data?.refresh?.accessToken}`
          }
        })
        signIn({
          accessToken: result?.data?.refresh?.accessToken,
          refreshToken: result?.data?.refresh?.refreshToken
        })
        return toPromise(forward(operation))
      })
      .catch((error) => {
        signOut()
        logger.error('[Error Refreshing Token]', error)
        location.reload()
        return toPromise(forward(operation))
      })
  )
})

export default authLink
