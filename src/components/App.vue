<template lang="pug">
.app(@click='emitClick')
    home
</template>

<script>
import Home from '@/bin/Home'
import radio from '@/util/radio'

export default {
    name: 'App',

    components: { Home },

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
