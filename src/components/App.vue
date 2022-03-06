<template lang="pug">
.screen(@click='emitClick' :class='classes')
    .screen__lines
    .screen__scanline

    .screen__content
        component(
            :is='binary'
            ref='binary'
            @run='runBinary'
            @boot='forceShell'
            :key='instanceKey'
        )

    .screen__splash(v-if='splash')
        pre {{ splash }}

    .screen__sound(@click='toggleSound')
        i.fas.fa-volume(:class='sound ? "fa-volume" : "fa-volume-off"')
</template>

<script>
import { markRaw } from 'vue'
import { mapState, mapMutations } from 'vuex'

import { isShellBinary } from '@/bin'
import Boot from '@/bin/boot'
import Shell from '@/bin/shell'
import { DOMAIN, FULL_NAME } from '@/config'
import radio from '@/util/radio'
import { binaryFromUrl } from '@/util/url'

export default {
    name: 'App',

    data() {
        return {
            binary: markRaw(Boot),
        }
    },

    computed: {
        classes() {
            const classes = []
            if (this.glitching) classes.push('glitching')
            if (this.theme) classes.push(`screen--${this.theme}`)
            return classes
        },

        ...mapState({
            glitching: (state) => state.glitching,
            instanceKey: (state) => state.instanceKey,
            process: (state) => state.process,
            sound: (state) => state.sound,
            splash: (state) => state.splash,
            theme: (state) => state.theme,
        }),
    },

    methods: {
        emitClick() {
            radio.emit('appClick')
        },

        async runBinary(binary) {
            this.binary = markRaw(binary)
            await this.$nextTick()
            await this.$refs.binary.run()
            this.setProcess()
            this.binary = markRaw(Shell)
        },

        forceShell() {
            this.binary = markRaw(Shell)
            this.incrementInstanceKey()
        },

        updatePageTitle() {
            document.title = [this.process || FULL_NAME, DOMAIN].join(' | ')
        },

        updateAppHeight() {
            document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
        },

        onKeyDown(e) {
            if (e.repeat) return
            if (e.key === 'Escape' || (e.key === 'c' && e.ctrlKey)) this.forceShell()
        },

        ...mapMutations(['toggleSound', 'incrementInstanceKey', 'setProcess']),
    },

    created() {
        window.addEventListener('resize', this.updateAppHeight)
        window.addEventListener('keydown', this.onKeyDown)
        this.updateAppHeight()
        this.updatePageTitle()

        // Interrupt the boot sequence if the user wants to jump into a specific binary
        const urlBinary = binaryFromUrl()
        if (urlBinary) {
            if (isShellBinary(urlBinary)) {
                this.forceShell()
            } else {
                this.runBinary(urlBinary.default)
            }
        }
    },

    mounted() {
        setTimeout(() => window.scrollTo(0, 0), 100)
        this.$listenFor('reboot', () => {
            this.binary = markRaw(Boot)
        })
    },

    watch: {
        binary() {
            window.scrollTo(0, 0)
        },

        process: 'updatePageTitle',
    },
}
</script>

<style lang="scss">
$scanline-height: 400px;

:root {
    --app-height: 100vh;
}

html, body {
    margin: 0;
    font-family: 'VT323', monospace;
    font-feature-settings: "liga" 0;
    font-size: 24px;
    color: white;

    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;

    &::-webkit-scrollbar {
        display: none;
    }
}

pre {
    font-family: 'VT323', monospace;
}

.screen {
    display: flex;
    background-image: radial-gradient(#3b275d 0%, #3a265c 18%, #191247 83%);
    background-attachment: fixed;
    min-height: 100vh;
    min-height: var(--app-height);
    animation: textfuzz 3s infinite alternate;

    &--red {
        background-image: radial-gradient(#bb275d 0%, #99265c 18%, #771247 83%);
    }

    &--orange {
        background-image: radial-gradient(#975e06 0%, #865404 18%, #452c05 83%);
    }

    &--green {
        background-image: radial-gradient(#1e4020 0%, #173518 18%, #0f2310 83%);
    }

    @media not all and (min-resolution:.001dpcm) {
        @supports (-webkit-appearance:none) {
            animation: safaritextfuzz 7s infinite alternate steps(10, jump-none);
        }
    }

    &__content {
        padding: 10px;
        width: 100%;
    }

    &__lines {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.12) 50%, rgba(0, 0, 0, 0.25) 50%);
        background-size: 100% 8px;
    }

    &__scanline {
        position: fixed;
        top: -$scanline-height;
        left: 0;
        width: 100%;
        height: $scanline-height;
        background-image: linear-gradient(to bottom, #ec10d900 0%, #ec10d908 95%, #ec10d900 100%);
        animation: scanline 12.5s infinite linear;
    }

    &__sound {
        position: fixed;
        top: 10px;
        right: 10px;
        opacity: 0.5;
    }

    &__splash {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        pre {
            background: #00000088;
            padding: 20px;
            white-space: pre-wrap;
        }
    }
}

@keyframes textfuzz {
    0% {
        text-shadow: 0 0 0 #ec10d9cc, 0 0 0 #aae0d7cc, 0 0 4px #ffffff77;
    }

    20% {
        text-shadow: -1px 0 0 #ec10d9cc, 1px 0 0 #aae0d7cc, 0 0 4px #ffffff77;
    }

    30% {
        text-shadow: 0 0 0 #ec10d9cc, 0 0 0 #aae0d7cc, 0 0 4px #ffffff77;
    }

    35% {
        text-shadow: -1.5px 0 0 #ec10d9cc, 1.5px 0 0 #aae0d7cc, 0 0 4px #ffffff77;
    }

    55% {
        text-shadow: 0 0 0 #ec10d9cc, 0 0 0 #aae0d7cc, 0 0 4px #ffffff77;
    }

    60% {
        text-shadow: -0.5px 0 0 #ec10d9cc, 0.5px 0 0 #aae0d7cc, 0 0 4px #ffffff77;
    }

    65% {
        text-shadow: 0 0 0 #ec10d9cc, 0 0 0 #aae0d7cc, 0 0 4px #ffffff77;
    }

    70% {
        text-shadow: -0.25px 0 0 #ec10d9cc, 0.25px 0 0 #aae0d7cc, 0 0 4px #ffffff77;
    }

    85% {
        text-shadow: 0 0 0 #ec10d9cc, 0 0 0 #aae0d7cc, 0 0 4px #ffffff77;
    }

    100% {
        text-shadow: -1.25px 0 0 #ec10d9cc, 1.25px 0 0 #aae0d7cc, 0 0 4px #ffffff77;
    }
}

@keyframes safaritextfuzz {
    0% {
        text-shadow: 0 0 0 #ec10d988, 0 0 0 #aae0d788, 0 0 4px #ffffff77;
    }

    20% {
        text-shadow: -2px 0 0 #ec10d988, 2px 0 0 #aae0d788, 0 0 4px #ffffff77;
    }

    30% {
        text-shadow: 0 0 0 #ec10d988, 0 0 0 #aae0d788, 0 0 4px #ffffff77;
    }

    35% {
        text-shadow: -2px 0 0 #ec10d988, 2px 0 0 #aae0d788, 0 0 4px #ffffff77;
    }

    55% {
        text-shadow: 0 0 0 #ec10d988, 0 0 0 #aae0d788, 0 0 4px #ffffff77;
    }

    60% {
        text-shadow: -2px 0 2px #ec10d988, 2px 0 2px #aae0d788, 0 0 4px #ffffff77;
    }

    65% {
        text-shadow: 0 0 0 #ec10d988, 0 0 0 #aae0d788, 0 0 4px #ffffff77;
    }

    70% {
        text-shadow: -2px 0 2px #ec10d988, 2px 0 2px #aae0d788, 0 0 4px #ffffff77;
    }

    85% {
        text-shadow: 0 0 0 #ec10d988, 0 0 0 #aae0d788, 0 0 4px #ffffff77;
    }

    100% {
        text-shadow: -2px 0 0 #ec10d988, 2px 0 0 #aae0d788, 0 0 4px #ffffff77;
    }
}

@keyframes scanline {
    0%, 10% {
        top: -$scanline-height;
    }

    30%, 100% {
        top: calc(100vh + $scanline-height + 50px);
    }
}
</style>
