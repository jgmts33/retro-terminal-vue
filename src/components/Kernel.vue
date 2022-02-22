<template lang="pug">
stdio(:history='history' :inputting='!!resolveInput' @submit='handleInput')
</template>

<script>
import sleep from 'sleep-promise'

import Stdio from '@/components/Stdio'
import speak from '@/util/speech'

export default {
    name: 'Kernel',

    components: { Stdio },

    data() {
        return {
            history: [],
            resolveInput: null,
        }
    },

    methods: {
        async output(message, opts) {
            opts = { speak: true, delay: 1000, ...opts }
            await sleep(opts.delay)
            console.log('Output:', message)
            this.history.push({ input: false, message })
            if (opts.speak) speak(message)
        },

        input() {
            this.history.push({ input: true, entry: '' })
            return new Promise((resolve) => {
                this.resolveInput = resolve
            })
        },

        handleInput(entry) {
            console.log('Input:', entry)
            this.history[this.history.length - 1].entry = entry
            this.resolveInput(entry)
            this.resolveInput = null
        },
    },
}
</script>
