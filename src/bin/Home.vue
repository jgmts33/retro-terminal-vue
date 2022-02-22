<script>
import Kernel from '@/components/Kernel'

export default {
    extends: Kernel,

    async mounted() {
        await this.output('welcome')
        while (true) {
            const input = await this.input()
            if (input === '42') {
                await this.output("you've got mail")
            } else if (input === 'whoami') {
                await this.output(process.env.VUE_APP_FIRST_NAME)
            } else if (input === 'email') {
                await this.output(process.env.VUE_APP_EMAIL)
            } else {
                await this.output('no soup for you')
            }
        }
    },
}
</script>
