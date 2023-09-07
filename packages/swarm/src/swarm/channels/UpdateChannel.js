import Channel from '~/src/lib/Channel'

export default class UpdateChannel extends Channel {
    get update() {
        return this.get('update')
    }
}
