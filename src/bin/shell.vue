<script>
import binaries from '@/bin'
import Kernel from '@/components/Kernel'

const excludedCommands = ['shell', 'index']

export default {
    extends: Kernel,

    async mounted() {
        await this.output(`${process.env.VUE_APP_FIRST_NAME.toLowerCase()}sapan.com v${process.env.VUE_APP_VERSION} (default, ${process.env.VUE_APP_BUILD_TIMESTAMP})`)
        await this.output('Type "help" for more information.')

        while (true) { // eslint-disable-line no-constant-condition
            const input = (await this.input()).split(' ')[0]
            const binary = binaries[input]
            if (excludedCommands.includes(input)) {
                continue
            } else if (binary) {
                await binary.default(this)
            } else {
                await this.output(`Unknown command: ${input}`)
            }
        }
    },
}
</script>
