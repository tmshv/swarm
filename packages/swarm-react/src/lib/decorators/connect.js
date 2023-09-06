import React, {Component} from 'react'

export default function connect(signal) {
    return ComposedComponent => class ConnectedComponent extends Component {
        constructor(...args) {
            super(...args)

            this.onUpdate = this.onUpdate.bind(this)
        }

        componentDidMount() {
            signal.on(this.onUpdate)
        }

        componentWillUnmount() {
            signal.off(this.onUpdate)
        }

        onUpdate(data) {
            this.data = data
            this.forceUpdate()
        }

        render() {
            const props = {
                ...this.props,
                data: this.data,
            }

            return (
                <ComposedComponent {...props}/>
            )
        }
    }
}