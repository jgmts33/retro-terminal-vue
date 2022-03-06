<template lang="pug">
stdio(:history='history' :inputting='!!resolveInput' @submit='handleInput')
</template>

<script>
import Stdio from '@/components/Stdio'
import speak from '@/util/speech'

export const INSTANT = { speak: false, delay: 0, speed: 0 }

export default {
    name: 'Kernel',

    components: { Stdio },

    data() {
        return {
            history: [],
            resolveInput: null,

            // This is intentionally not computed because we don't want it to
            // change if the program is escaped. This allows us to ignore any
            // additional speech from the program.
            instanceKey: this.$store.state.instanceKey,
        }
    },

    methods: {
        output(message, opts) {
            return new Promise((resolve) => {
                // Apply defaults
                opts = {
                    speak: true,
                    speakOptions: null,
                    delay: 1000,
                    speed: 45,
                    ...opts,
                }

                const outputHandler = () => {
                    // Speak the line
                    let cancelSpeech = null
                    if (opts.speak) cancelSpeech = speak(opts.speak === true ? message : opts.speak, opts.speechOptions, this.instanceKey)

                    // Add a new empty line (or the completed line if speed was unset)
                    const line = { input: false, message: opts.speed ? '' : message }
                    this.history.push(line)
                    if (!opts.speed || !message.length) return resolve()

                    // Prepare to type the text to the screen
                    const lineIdx = this.history.length - 1
                    let cIdx = 0
                    let typeInterval = null

                    // Allow hitting any key to skip the typing animation
                    const onKeyDown = () => {
                        this.history[lineIdx] = { ...line, message }
                        if (cancelSpeech) cancelSpeech()
                        clearInterval(typeInterval)
                        window.removeEventListener('keydown', onKeyDown)
                        resolve()
                    }

                    // "Type" the text to the screen
                    const typeCharacter = () => {
                        this.history[lineIdx] = { ...line, message: this.history[lineIdx].message + message[cIdx] }
                        cIdx += 1
                        if (cIdx === message.length) {
                            clearInterval(typeInterval)
                            window.removeEventListener('keydown', onKeyDown)
                            resolve()
                        }
                    }
                    typeInterval = setInterval(typeCharacter, opts.speed)
                    window.addEventListener('keydown', onKeyDown)
                }

                // Apply the delay if there is one
                if (opts.delay) {
                    setTimeout(outputHandler, opts.delay)
                } else {
                    outputHandler()
                }
            })
        },

        print(...messages) {
            messages.forEach((message) => {
                this.history.push({ input: false, message })
            })
        },

        input() {
            this.history.push({ input: true, entry: '' })
            return new Promise((resolve) => {
                this.resolveInput = resolve
            })
        },

        async confirm(prompt) {
            await this.output(`${prompt} [Y/N]: `, { speak: prompt })
            const response = (await this.input()).toUpperCase()
            return response[0] === 'Y'
        },

        promptAnyKey() {
            this.history.push({ input: true, any: true, entry: '' })
            return new Promise((resolve) => {
                this.resolveInput = resolve
            })
        },

        async clear() {
            this.history = []
            await this.output('', { delay: 0 })
        },

        handleInput(entry) {
            this.history[this.history.length - 1].entry = entry
            this.resolveInput(entry)
            this.resolveInput = null
        },
    },
}
</script>
