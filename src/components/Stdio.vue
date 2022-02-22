<template lang="pug">
.stdio
    .stdio__line(v-for='line, lineIdx in history' :key='lineIdx')
        span(v-if='!line.input') {{ line.message }}

        template(v-else)
            span.stdio__caret >
            template(v-if='inputting && lineIdx === history.length - 1')
                span(
                    contenteditable
                    ref='activeInput'
                    @input='onInput'
                    @keyup.enter='$emit("submit", line.entry.trim())'
                ) {{ line.entry }}
                .stdio__active
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
        onInput(e) {
            this.history[this.history.length - 1].entry = e.target.innerText  // eslint-disable-line
        },

        focusInput() {
            if (this.inputIdx) this.$refs.activeInput[0].focus()
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
    &__caret {
        margin-right: 5px;
    }
}
</style>
