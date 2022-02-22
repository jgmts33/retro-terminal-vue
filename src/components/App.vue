<template lang="pug">
.app(@click='emitClick')
    shell
</template>

<script>
import Shell from '@/bin/shell'
import radio from '@/util/radio'

export default {
    name: 'App',

    components: { Shell },

    methods: {
        emitClick() {
            radio.emit('appClick')
        },
    },
}
</script>

<style lang="scss">
.app {
    min-height: 100vh;
}
</style>
