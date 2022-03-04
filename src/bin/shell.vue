<script>
import { mapMutations } from 'vuex'

import binaries, { isShellBinary } from '@/bin'
import { BUILD_TIMESTAMP, DOMAIN, VERSION } from '@/config'
import Kernel, { INSTANT } from '@/components/Kernel'
import { binaryFromUrl } from '@/util/url'

const excludedCommands = ['shell', 'index', '']

export default {
    extends: Kernel,

    methods: mapMutations(['setFirstShell', 'setProcess']),

    async mounted() {
        // Make a note of whether this is the first shell instance since boot
        const firstShell = this.$store.state.firstShell
        this.setFirstShell(false)

        // Jump right into the URL's binary if that exists
        const urlBinary = binaryFromUrl()
        if (urlBinary && isShellBinary(urlBinary) && firstShell) await urlBinary.default(this)

        // Start the normal shell process
        await this.output(`${DOMAIN} v${VERSION} (default, ${BUILD_TIMESTAMP})`, INSTANT)
        await this.output('Type "help" for more information.', firstShell ? null : INSTANT)
        this.setFirstShell(false)

        while (true) { // eslint-disable-line no-constant-condition
            this.setProcess()
            const input = (await this.input()).split(' ')
            const command = input.shift().toLowerCase()
            const binary = binaries[command]
            if (excludedCommands.includes(command)) {
                continue
            } else if (binary) {
                this.setProcess(command)
                if (isShellBinary(binary)) {
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
