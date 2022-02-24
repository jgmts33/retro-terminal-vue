<template lang="pug">
.screen(@click='emitClick')
    .screen__lines
    .screen__scanline
    .screen__content
        component(:is='binary' ref='binary' @run='runBinary' @boot='forceShell')
</template>

<script>
import { markRaw } from 'vue'

import Boot from '@/bin/boot'
import Shell from '@/bin/shell'
import radio from '@/util/radio'

export default {
    name: 'App',

    data() {
        return {
            binary: markRaw(Boot),
        }
    },

    methods: {
        emitClick() {
            radio.emit('appClick')
        },

        async runBinary(binary) {
            this.binary = markRaw(binary)
            await this.$nextTick()
            await this.$refs.binary.run()
            this.binary = markRaw(Shell)
        },

        forceShell() {
            this.binary = markRaw(Shell)
        },
    },

    mounted() {
        this.$listenFor('reboot', () => {
            this.binary = markRaw(Boot)
        })
    },

    watch: {
        binary() {
            window.scrollTo(0, 0)
        },
    },
}
</script>

<style lang="scss">
$scanline-height: 400px;

html, body {
    margin: 0;
    font-family: 'VT323', monospace;
    font-feature-settings: "liga" 0;
    font-size: 24px;
    color: white;
}

.screen {
    display: flex;
    background-image: radial-gradient(#3b275d 0%, #3a265c 18%, #191247 83%);
    background-attachment: fixed;
    min-height: 100vh;
    animation: textfuzz 3s infinite alternate;

    @media not all and (min-resolution:.001dpcm) {
        @supports (-webkit-appearance:none) {
            animation: safaritextfuzz 3s infinite alternate;
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
