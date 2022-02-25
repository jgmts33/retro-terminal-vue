<template lang="pug">
.fire
    pre.fire__flames(ref='flames')
    stdio.fire__shell(:history='history' :inputting='!!resolveInput' @submit='handleInput')
</template>

<script>
import sleep from 'sleep-promise'

import Kernel from '@/components/Kernel'

export default {
    name: 'Fire',

    extends: Kernel,

    data() {
        return {
            interval: null,
        }
    },

    methods: {
        async run() {
            this.startFire()
            await this.output('Dear Sir/Madam,', { speak: 'Dear sir stroke madam' })
            await this.output('Fire!', { speak: 'Fire! Exclamation mark' })
            await this.output('Fire!', { speak: 'Fire! Exclamation mark', delay: 2000 })
            await this.output('Help me!', { speak: 'Help me! Exclamation mark', delay: 2000 })
            await this.output('123 Carenden Road', { delay: 2000 })
            await this.output('Looking forward to hearing from you.')
            await sleep(1000)
            await this.promptAnyKey()
            window.open('https://www.youtube.com/watch?v=xqQ6Z-HmAqY', '_blank')
        },

        /**
         * ASCII fire generator courtesy of Thiemo Mättig
         * http://maettig.com/code/javascript/asciifire.html
         */
        startFire() {
            const size = 80 * 25
            const b = []
            for (let i = 0; i < size + 81; i++) b[i] = 0
            const char = ' .:*sS#$'.split('')
            const e = this.$refs.flames

            const fire = () => {
                for (let i = 0; i < 10; i++) b[Math.floor(Math.random() * 80) + 80 * 24] = 70
                let a = ''
                for (let i = 0; i < size; i++) {
                    b[i] = Math.floor((b[i] + b[i + 1] + b[i + 80] + b[i + 81]) / 4)
                    a += char[b[i] > 7 ? 7 : b[i]]
                    if (i % 80 > 78) a += '\r\n'
                }
                e.innerText = a
            }

            this.interval = setInterval(fire, 30)
        },
    },

    beforeUnmount() {
        clearInterval(this.interval)
    },
}
</script>

<style lang="scss" scoped>
.fire {
    &__flames {
        font-size: 20px;

        @media(max-width: 700px) {
            font-size: 10px;
        }
    }
}
</style>
