<template lang="pug">
.stdio
    input.stdio__input(
        v-model='entry'
        type='text'
        autocapitalize='off'
        autocomplete='off'
        ref='activeInput'
        @keydown='onKeyDown'
        @keydown.enter.prevent='submitEntry'
    )
    .stdio__line(v-for='line, lineIdx in history' :key='lineIdx')
        span(v-if='!line.input') {{ line.message }}

        template(v-else)
            template(v-if='!line.any')
                span.stdio__prompt >
                template(v-if='inputting && lineIdx === history.length - 1')
                    | {{ entry }}
                    .stdio__caret
                span(v-else) {{ line.entry }}

            span(v-else) Press any key to continue.
</template>

<script>
import playKeystroke from '@/util/keystrokes'

export default {
    name: 'Stdio',

    props: {
        history: {
            type: Array,
            required: true,
        },

        inputting: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            entry: '',
        }
    },

    mounted() {
        this.$listenFor('appClick', this.focusInput)
    },

    computed: {
        inputIdx() {
            if (!this.inputting) return null
            return this.history.length - 1
        },
    },

    methods: {
        focusInput() {
            if (this.inputIdx) {
                const input = this.$refs.activeInput
                input.selectionStart = input.value.length
                input.selectionEnd = input.value.length
                input.focus()
            }
        },

        onKeyDown(e) {
            if (!this.inputIdx) return
            if (this.history[this.inputIdx].any) {
                e.stopImmediatePropagation()
                this.$emit('submit', this.entry.trim())
            }
        },

        submitEntry() {
            if (!this.inputIdx) return
            this.$emit('submit', this.entry.trim())
            this.entry = ''
            this.$refs.activeInput.blur()
        },
    },

    watch: {
        entry: playKeystroke,

        inputIdx(val) {
            if (!val) return
            this.$nextTick(this.focusInput)
        },

        history: {
            deep: true,
            async handler() {
                await this.$nextTick()
                if ((window.innerHeight + window.pageYOffset) < document.body.offsetHeight - 2) {
                    window.scrollTo(0, document.body.scrollHeight)
                }
            },
        },
    },
}
</script>

<style lang="scss">
.stdio {
    &__line {
        margin-bottom: 3px;
        white-space: pre-wrap;
        word-break: break-word;
    }

    &__prompt {
        margin-right: 5px;
    }

    &__input {
        position: fixed;
        top: -100px;
    }

    &__caret {
        display: inline-block;
        width: 10px;
        height: 18px;
        background: #cde0e0;
        margin-left: 1px;
        position: relative;
        top: 2px;
        animation: caretblink 1s infinite step-end;
    }

    .glitching & {
        animation: glitch 1s infinite;
    }
}

@keyframes caretblink {
    0% {
        background: #cde0e0;
    }

    50% {
        background: transparent;
    }
}

@keyframes glitch {
    0% {
        clip-path: polygon(0% 43%, 83% 43%, 83% 22%, 23% 22%, 23% 24%, 91% 24%, 91% 26%, 18% 26%, 18% 83%, 29% 83%, 29% 17%, 41% 17%, 41% 39%, 18% 39%, 18% 82%, 54% 82%, 54% 88%, 19% 88%, 19% 4%, 39% 4%, 39% 14%, 76% 14%, 76% 52%, 23% 52%, 23% 35%, 19% 35%, 19% 8%, 36% 8%, 36% 31%, 73% 31%, 73% 16%, 1% 16%, 1% 56%, 50% 56%, 50% 8%);
    }

    5% {
        clip-path: polygon(0% 29%, 44% 29%, 44% 83%, 94% 83%, 94% 56%, 11% 56%, 11% 64%, 94% 64%, 94% 70%, 88% 70%, 88% 32%, 18% 32%, 18% 96%, 10% 96%, 10% 62%, 9% 62%, 9% 84%, 68% 84%, 68% 50%, 52% 50%, 52% 55%, 35% 55%, 35% 87%, 25% 87%, 25% 39%, 15% 39%, 15% 88%, 52% 88%);
    }

    30% {
        clip-path: polygon(0% 53%, 93% 53%, 93% 62%, 68% 62%, 68% 37%, 97% 37%, 97% 89%, 13% 89%, 13% 45%, 51% 45%, 51% 88%, 17% 88%, 17% 54%, 81% 54%, 81% 75%, 79% 75%, 79% 76%, 38% 76%, 38% 28%, 61% 28%, 61% 12%, 55% 12%, 55% 62%, 68% 62%, 68% 51%, 0% 51%, 0% 92%, 63% 92%, 63% 4%, 65% 4%);
    }

    45% {
        clip-path: polygon(0% 33%, 2% 33%, 2% 69%, 58% 69%, 58% 94%, 55% 94%, 55% 25%, 33% 25%, 33% 85%, 16% 85%, 16% 19%, 5% 19%, 5% 20%, 79% 20%, 79% 96%, 93% 96%, 93% 50%, 5% 50%, 5% 74%, 55% 74%, 55% 57%, 96% 57%, 96% 59%, 87% 59%, 87% 65%, 82% 65%, 82% 39%, 63% 39%, 63% 92%, 4% 92%, 4% 36%, 24% 36%, 24% 70%, 1% 70%, 1% 43%, 15% 43%, 15% 28%, 23% 28%, 23% 71%, 90% 71%, 90% 86%, 97% 86%, 97% 1%, 60% 1%, 60% 67%, 71% 67%, 71% 91%, 17% 91%, 17% 14%, 39% 14%, 39% 30%, 58% 30%, 58% 11%, 52% 11%, 52% 83%, 68% 83%);
    }

    76% {
        clip-path: polygon(0% 26%, 15% 26%, 15% 73%, 72% 73%, 72% 70%, 77% 70%, 77% 75%, 8% 75%, 8% 42%, 4% 42%, 4% 61%, 17% 61%, 17% 12%, 26% 12%, 26% 63%, 73% 63%, 73% 43%, 90% 43%, 90% 67%, 50% 67%, 50% 41%, 42% 41%, 42% 46%, 50% 46%, 50% 84%, 96% 84%, 96% 78%, 49% 78%, 49% 25%, 63% 25%, 63% 14%);
    }

    90% {
        clip-path: polygon(0% 41%, 13% 41%, 13% 6%, 87% 6%, 87% 93%, 10% 93%, 10% 13%, 89% 13%, 89% 6%, 3% 6%, 3% 8%, 16% 8%, 16% 79%, 0% 79%, 0% 99%, 92% 99%, 92% 90%, 5% 90%, 5% 60%, 0% 60%, 0% 48%, 89% 48%, 89% 13%, 80% 13%, 80% 43%, 95% 43%, 95% 19%, 80% 19%, 80% 85%, 38% 85%, 38% 62%);
    }

    1%, 7%, 33%, 47%, 78%, 93% {
        clip-path: none;
    }
}
</style>
