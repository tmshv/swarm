import { NextPage } from 'next'
// import dynamic from 'next/dynamic'
// const App = dynamic(import('src/components/App')
//     .then(m => m.App), { ssr: false })

type FrameProps = {
    src: string
}

const Frame: React.FC<FrameProps> = props => {
    return (
        <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
        }}>
            <iframe
                style={{
                    width: '100%',
                    height: '100%',
                }}
                frameBorder={'0'}
                src={props.src}
            />
        </div>
    )
}

const Index: NextPage = () => {
    // {/* <App
    //     layers={controller.layers}
    //     uiCallbacks={controller.ui}
    //     displayUiSignal={controller.swarm.tools.getToolUpdateSignal(ToolType.TOGGLE_UI)}
    //     swarm={controller.swarm}
    // /> */}

    return (
        <Frame
            src={'/swarm/parnas'}
        />
    )
}

export default Index
