<template lang="pug">
.screen(@click='emitClick')
    .screen__lines
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
}
</script>

<style lang="scss">
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
}

@keyframes textfuzz {
    0% {
        text-shadow: 0 0 0 #ec10d9cc, 0 0 0 #aae0d7cc;
    }

    20% {
        text-shadow: -1px 0 0 #ec10d9cc, 1px 0 0 #aae0d7cc;
    }

    30% {
        text-shadow: 0 0 0 #ec10d9cc, 0 0 0 #aae0d7cc;
    }

    35% {
        text-shadow: -1.5px 0 0 #ec10d9cc, 1.5px 0 0 #aae0d7cc;
    }

    55% {
        text-shadow: 0 0 0 #ec10d9cc, 0 0 0 #aae0d7cc;
    }

    60% {
        text-shadow: -0.5px 0 0 #ec10d9cc, 0.5px 0 0 #aae0d7cc;
    }

    65% {
        text-shadow: 0 0 0 #ec10d9cc, 0 0 0 #aae0d7cc;
    }

    70% {
        text-shadow: -0.25px 0 0 #ec10d9cc, 0.25px 0 0 #aae0d7cc;
    }

    85% {
        text-shadow: 0 0 0 #ec10d9cc, 0 0 0 #aae0d7cc;
    }

    100% {
        text-shadow: -1.25px 0 0 #ec10d9cc, 1.25px 0 0 #aae0d7cc;
    }
}

@keyframes safaritextfuzz {
    0% {
        text-shadow: 0 0 0 #ec10d988, 0 0 0 #aae0d788;
    }

    20% {
        text-shadow: -2px 0 0 #ec10d988, 2px 0 0 #aae0d788;
    }

    30% {
        text-shadow: 0 0 0 #ec10d988, 0 0 0 #aae0d788;
    }

    35% {
        text-shadow: -2px 0 0 #ec10d988, 2px 0 0 #aae0d788;
    }

    55% {
        text-shadow: 0 0 0 #ec10d988, 0 0 0 #aae0d788;
    }

    60% {
        text-shadow: -2px 0 2px #ec10d988, 2px 0 2px #aae0d788;
    }

    65% {
        text-shadow: 0 0 0 #ec10d988, 0 0 0 #aae0d788;
    }

    70% {
        text-shadow: -2px 0 2px #ec10d988, 2px 0 2px #aae0d788;
    }

    85% {
        text-shadow: 0 0 0 #ec10d988, 0 0 0 #aae0d788;
    }

    100% {
        text-shadow: -2px 0 0 #ec10d988, 2px 0 0 #aae0d788;
    }
}
</style>
