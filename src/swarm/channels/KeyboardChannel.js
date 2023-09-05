import Channel from '@/lib/Channel'

export default class KeyboardChannel extends Channel {
    get keyDown() {
        return this.get('keyDown')
    }

    get keyUp() {
        return this.get('keyUp')
    }

    get keyPress() {
        return this.get('keyPress')
    }
}
