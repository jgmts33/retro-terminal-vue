<template lang="pug">
.stdio
    input.stdio__input(
        v-model='entry'
        ref='activeInput'
        @keydown.enter.prevent='submitEntry'
    )
    .stdio__line(v-for='line, lineIdx in history' :key='lineIdx')
        span(v-if='!line.input') {{ line.message }}

        template(v-else)
            span.stdio__prompt >
            template(v-if='inputting && lineIdx === history.length - 1')
                | {{ entry }}
                .stdio__caret
            span(v-else) {{ line.entry }}
</template>

<script>
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

        submitEntry() {
            this.$emit('submit', this.entry.trim())
            this.entry = ''
        },
    },

    watch: {
        inputIdx(val) {
            if (!val) return
            this.$nextTick(this.focusInput)
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
}

@keyframes caretblink {
    0% {
        background: #cde0e0;
    }

    50% {
        background: transparent;
    }
}
</style>
