import { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useSwarm } from 'src/hooks/useSwarm'
import { oneItem } from '@/lib/array'
import { useEffect } from 'react'

const SwarmViewport = dynamic(import('@/components/SwarmViewport').then(m => m.SwarmViewport), { ssr: false })

type Props = {
    scriptUrl: string
}

const Index: NextPage<Props> = props => {
    const controller = useSwarm(props.scriptUrl)
    if (!controller) {
        return (
            <div>loading</div>
        )
    }

    return (
        <SwarmViewport
            backgroundColor={'rgb(100 100 110)'}
            // backgroundColor={'rgb(31 36 45)'}
            // backgroundColor={'white'}
            layers={controller.layers}
            swarm={controller.swarm}
        />
    )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
    const db = new Map([
        ['parnas', {
            script: '/repo/parnas.js',
        }],
        ['mega', {
            script: '/repo/mega.js',
        }],
    ])

    const slug = oneItem(ctx.params.slug)
    if (!db.has(slug)) {
        return {
            props: {
                scriptUrl: null,
            }
        }
    }

    const item = db.get(slug)

    return {
        props: {
            scriptUrl: item.script,
        }
    }
}

export default Index
