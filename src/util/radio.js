import _ from 'lodash'
import mitt from 'mitt'

const radio = mitt()

export const installRadio = (app) => {
    app.mixin({
        beforeCreate() {
            this.$radioCallbacks = []
        },

        beforeUnmount() {
            _.each(this.$radioCallbacks, (c) => {
                radio.off(c.event, c.callback)
            })
        },
    })

    app.config.globalProperties.$listenFor = function listenFor(event, callback) {
        radio.on(event, callback)
        this.$radioCallbacks.push({ event, callback })
    }
}

export default radio
