<script>
import Kernel from '@/components/Kernel'

export default {
    extends: Kernel,

    async mounted() {
        await this.output(`Welcome to ${process.env.VUE_APP_FIRST_NAME}'s terminal`)
        await this.output('Initializing...')
        await this.output('...')
        await this.output('...')
        await this.output('Detecting devices...')
        await this.output('...')
        await this.output('Launching shell...')
        await this.$emit('boot')
    },
}
</script>
