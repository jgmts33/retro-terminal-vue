<script>
import Kernel from '@/components/Kernel'

export default {
    extends: Kernel,

    async mounted() {
        const date = new Date()
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

${process.env.VUE_APP_FIRST_NAME}OS (C)${date.getFullYear()} ${process.env.VUE_APP_FIRST_NAME} Sapan
BIOS Date ${process.env.VUE_APP_BUILD_TIMESTAMP}
CPU : Intel(R) Pentum(R) III Processor 900 MHz
Memory Testing: 131072K OK

Auto-Detecting SATA 1...IDE Hard Disk
SATA 1: 92cfce-b39d57d91 ATA Device
    S.M.A.R.T Capable and Status OK

Booting from SATA 1...
`)
        await this.output('...', { delay: 0 })
        await this.output('...')
        await this.output('Launching shell...')
        await this.$emit('boot')
    },
}
</script>
