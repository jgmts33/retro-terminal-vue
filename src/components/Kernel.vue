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
        async output(message, useSpeech = true) {
            await sleep(1000)
            console.log('Output:', message)
            this.history.push({ input: false, message })
            if (useSpeech) speak(message)
        },

        input() {
            this.history.push({ input: true, entry: '' })
            return new Promise((resolve) => {
                this.resolveInput = resolve
            })
        },

        handleInput(entry) {
            console.log('Input:', entry)
            this.resolveInput(entry)
            this.resolveInput = null
        },
    },
}
</script>
