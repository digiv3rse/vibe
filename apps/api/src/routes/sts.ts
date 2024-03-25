import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts'
import { Hono } from 'hono'

import { ERROR_MESSAGE } from '@/helpers/constants'

type Bindings = {
  STORAGE_ACCESS_KEY: string
  STORAGE_ACCESS_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

const bucketName = 'digi3'
const everEndpoint = 'https://gateway.storjshare.io'
const params = {
  DurationSeconds: 3600,
  Policy: `{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "s3:PutObject",
          "s3:GetObject",
		      "s3:AbortMultipartUpload"
        ],
        "Resource": [
          "arn:aws:s3:::${bucketName}/*"
        ]
      }
    ]
  }`
}

app.get('/', async (c) => {
  try {
    const accessKeyId = c.env.STORAGE_ACCESS_KEY
    const secretAccessKey = c.env.STORAGE_ACCESS_SECRET

    const stsClient = new STSClient({
      endpoint: everEndpoint,
      region: 'us-west-2',
      credentials: { accessKeyId, secretAccessKey }
    })

    const data = await stsClient.send(
      new AssumeRoleCommand({
        ...params,
        RoleArn: undefined,
        RoleSessionName: undefined
      })
    )

    return c.json({
      success: true,
      accessKeyId: data.Credentials?.AccessKeyId,
      secretAccessKey: data.Credentials?.SecretAccessKey,
      sessionToken: data.Credentials?.SessionToken
    })
  } catch {
    return c.json({ success: false, message: ERROR_MESSAGE })
  }
})

export default app
