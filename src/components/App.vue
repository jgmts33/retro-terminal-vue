<template lang="pug">
.app(@click='emitClick')
    component(:is='binary' ref='binary' @run='runBinary' @boot='forceShell')
</template>

<script>
import { markRaw } from 'vue'

import Boot from '@/bin/boot'
import Shell from '@/bin/shell'
import radio from '@/util/radio'

export default {
    name: 'App',

    data() {
        return {
            binary: markRaw(Boot),
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

        forceShell() {
            this.binary = markRaw(Shell)
        },
    },

    mounted() {
        this.$listenFor('reboot', () => {
            this.binary = markRaw(Boot)
        })
    },
}
</script>

<style lang="scss">
html, body {
    margin: 0;
}

.app {
    padding: 10px;
}
</style>
