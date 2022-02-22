import radio from '@/util/radio'

export default async () => {
    radio.emit('reboot')
}
