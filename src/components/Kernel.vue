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
            opts = {
                speak: true,
                delay: 1000,
                speed: 45,
                ...opts,
            }
            await sleep(opts.delay)
            console.log('Output:', message)
            if (opts.speak) speak(message)
            const line = { input: false, message: opts.speed ? '' : message }
            this.history.push(line)
            if (opts.speed) {
                const lineIdx = this.history.length - 1
                for (let c = 0; c < message.length; c++) {
                    this.history[lineIdx] = { ...line, message: this.history[lineIdx].message + message[c] }
                    await sleep(opts.speed)
                }
            }
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
