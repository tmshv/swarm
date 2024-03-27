import Channel from '~/src/lib/Channel'

export default class MouseChannel extends Channel {
    get mouseDown() {
        return this.get('mouseDown')
    }

    get mouseUp() {
        return this.get('mouseUp')
    }

    get mouseMove() {
        return this.get('mouseMove')
    }

    get click() {
        return this.get('click')
    }
}
