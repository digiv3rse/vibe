import { VIBE_APP_DESCRIPTION, VIBE_APP_NAME } from '@vibe/constants'

const Home = () => {
  return (
    <main>
      <div>{VIBE_APP_NAME}</div>
      <p>{VIBE_APP_DESCRIPTION}</p>
    </main>
  )
}

export default Home
