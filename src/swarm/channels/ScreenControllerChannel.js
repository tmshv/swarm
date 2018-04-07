import UpdateChannel from './UpdateChannel'

export default class ScreenControllerChannel extends UpdateChannel {
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