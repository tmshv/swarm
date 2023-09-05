import { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useSwarm } from 'src/hooks/useSwarm'
import { oneItem } from '@/lib/array'
import { useEffect } from 'react'

const SwarmViewport = dynamic(import('@/components/SwarmViewport').then(m => m.SwarmViewport), { ssr: false })

type Props = {
    scriptUrl: string,
    camera: [number, number, number, number, number, number]
}

const Index: NextPage<Props> = ({ scriptUrl, camera }) => {
    const controller = useSwarm(scriptUrl, camera)
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
            camera: [
                0.5303213506452932,
                0,
                0,
                -0.5303213506452932,
                -1877.674241015046,
                1700.8069588689884,
            ],
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
            camera: item.camera ?? null,
        }
    }
}

export default Index
