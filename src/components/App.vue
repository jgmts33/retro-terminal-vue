<template lang="pug">
.app(@click='emitClick')
    component(:is='binary' ref='binary' @run='runBinary')
</template>

<script>
import { markRaw } from 'vue'

import Shell from '@/bin/shell'
import radio from '@/util/radio'

export default {
    name: 'App',

    data() {
        return {
            binary: markRaw(Shell),
        }
    },

    methods: {
        emitClick() {
            radio.emit('appClick')
        },

        async runBinary(binary) {
            this.binary = markRaw(binary)
            await this.$nextTick()
            await this.$refs.binary.run()
            this.binary = markRaw(Shell)
        },
    },
}
</script>

<style lang="scss">
.app {
    min-height: 100vh;
}
</style>
