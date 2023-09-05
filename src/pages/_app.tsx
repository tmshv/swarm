import '@/style.css'

import Head from 'next/head'
// import { AppType } from 'next/dist/next-server/lib/utils'

type AppType = any

const App: AppType = ({ Component, pageProps }) => (
    <>
        <Head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, maximum-scale=1.0" />
        </Head>

        <Component {...pageProps} />
    </>
)

export default App
