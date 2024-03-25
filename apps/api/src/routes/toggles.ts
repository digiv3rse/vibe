import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { object, string } from 'zod'

import { ERROR_MESSAGE } from '@/helpers/constants'

type Bindings = {
  VIBE_DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()
app.get(
  '*',
  cache({
    cacheName: 'verified',
    cacheControl: 'max-age=300'
  })
)

app.get(
  '/:profileId',
  zValidator(
    'param',
    object({
      profileId: string()
    })
  ),
  async (c) => {
    const { profileId } = c.req.param()

    try {
      const result = await c.env.VIBE_DB.prepare(
        'SELECT suspended, limited, flagged FROM ProfileRestriction WHERE profileId = ?'
      )
        .bind(profileId)
        .first()

      return c.json({
        success: true,
        restrictions: {
          suspended: Boolean(result?.suspended),
          limited: Boolean(result?.limited),
          flagged: Boolean(result?.flagged)
        }
      })
    } catch {
      return c.json({ success: false, message: ERROR_MESSAGE })
    }
  }
)

export default app
