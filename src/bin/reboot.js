import store from '@/store'
import radio from '@/util/radio'

export default async () => {
    store.commit('reboot')
    radio.emit('reboot')
}
