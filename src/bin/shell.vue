<script>
import { mapMutations } from 'vuex'

import binaries from '@/bin'
import { BUILD_TIMESTAMP, DOMAIN, VERSION } from '@/config'
import Kernel from '@/components/Kernel'

const excludedCommands = ['shell', 'index', '']

export default {
    extends: Kernel,

    methods: mapMutations(['setProcess']),

    async mounted() {
        await this.output(`${DOMAIN} v${VERSION} (default, ${BUILD_TIMESTAMP})`, { speak: false, delay: 0, speed: 0 })
        await this.output('Type "help" for more information.')

        while (true) { // eslint-disable-line no-constant-condition
            this.setProcess()
            const input = (await this.input()).split(' ')
            const command = input.shift().toLowerCase()
            const binary = binaries[command]
            if (excludedCommands.includes(command)) {
                continue
            } else if (binary) {
                this.setProcess(command)
                if (typeof binary.default === 'function') {
                    await binary.default(this, input)
                } else {
                    this.$emit('run', binary.default)
                    return
                }
            } else {
                await this.output(`Unknown command: ${command}`)
            }
        }
    },
}
</script>
