<script>
import Kernel from '@/components/Kernel'

export default {
    extends: Kernel,

    async mounted() {
        this.print(`
           @@@@@@@@@
        @@@@@@@@@@@@@@@
      @@@@@@@@@@@@@@@@@@
     @@@@@@@@@@@@@@@@@@@@
     &&&&&&&&&&&&&&&&&&&&
     ~~~~~~~~~~~~~~~~~~~~
      ~~~~~~~~~~~~~ ~~~~
        ~~~~~~  ~~ ~~~
           ~~ ~~~~~~

        ${process.env.VUE_APP_FIRST_NAME}OS v${process.env.VUE_APP_VERSION}

`)
        await this.output('...', { delay: 0 })
        await this.output('...')
        await this.output('Waiting for devices...')
        await this.output('...')
        await this.output('Launching shell...')
        await this.$emit('boot')
    },
}
</script>
