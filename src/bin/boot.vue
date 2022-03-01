<script>
import { BUILD_TIMESTAMP, FIRST_NAME, VERSION } from '@/config'
import Kernel from '@/components/Kernel'
import store from '@/store'

export default {
    extends: Kernel,

    async mounted() {
        const date = new Date()
        const instanceKey = store.state.instanceKey
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

        ${FIRST_NAME}OS v${VERSION}

${FIRST_NAME}OS (C)${date.getFullYear()} ${FIRST_NAME} Sapan
BIOS Date ${BUILD_TIMESTAMP}
CPU : Intel(R) Pentium(R) III Processor 900 MHz
Memory Testing: 131072K OK

Auto-Detecting SATA 1...IDE Hard Disk
SATA 1: 92cfce-b39d57d91 ATA Device
    S.M.A.R.T Capable and Status OK

Booting from SATA 1...
`)
        await this.output('...', { delay: 0 })
        await this.output('...')
        await this.output('Launching shell...', { speak: false })
        if (store.state.instanceKey === instanceKey) await this.$emit('boot')
    },
}
</script>
