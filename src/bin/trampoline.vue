<template lang="pug">
.game
    .game__score
        div
            | &nbsp;Score: {{ score }}
            template(v-if='scoreIncrease') &nbsp;(+{{ scoreIncrease }})
        div &nbsp;&nbsp;Time: {{ Math.ceil(time / 1000) }}
        div(v-if='bestTrampoline') &nbsp;&nbsp;Best: {{ bestTrampoline }}

    .game__ticks
        .game__tick(v-for='(x, idx) in 11' :key='idx') {{ ((10 - idx) ** 2) * tickScale }}

    .game__container
        .game__field
            .game__character(:style='`top: ${100 - height}%`') [YOU]
        .game__trampoline
            .game__trampoline--ascii
                div ----------
                div |&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|
</template>

<script>
import _ from 'lodash'
import sleep from 'sleep-promise'
import { mapMutations, mapState } from 'vuex'

const gameDefaults = {
    score: 0,
    scoreIncrease: 0,
    height: 0,
    time: 30000,
    timeDelta: 0,
    lastTimestamp: null,
    velocity: 0.9,
    lastJumpVelocity: 0,
    nextJumpVelocity: null,
    missedJump: null,
}

const FPS = 60
const STEP_MS = 1000 / FPS
const MIN_JUMP_VELOCITY = 1.17
const MIN_MISS_VELOCITY = 0.5
const MAX_FALLING_VELOCITY = -3.33
const VELOCITY_DECAY = 0.05
const JUMP_POTENTIAL = 0.4
const HALF_POTENTIAL = JUMP_POTENTIAL / 2
const MISS_PCT_DECAY = 0.8
const JUMP_WINDOW = 13
const MISSED_WINDOW = 10
const MIN_FREQUENCY = 100
const MAX_FREQUENCY = 300

export default {
    name: 'Trampoline',

    data() {
        const audioContext = new AudioContext()
        const gainNode = audioContext.createGain()
        gainNode.connect(audioContext.destination)
        gainNode.gain.value = this.$store.state.sound ? 1 : 0

        return {
            ...gameDefaults,

            tickScale: 10,
            audioContext,
            gainNode,
            oscillator: null,
            active: false,
            ignoreEnter: false,
        }
    },

    computed: {
        scoreHeight() {
            return Math.floor((this.height / 10) ** 2 * this.tickScale)
        },

        ...mapState({
            bestTrampoline: (state) => state.bestTrampoline,
            sound: (state) => state.sound,
        }),
    },

    methods: {
        run() {
            return new Promise(() => {})
        },

        startGame() {
            _.each(gameDefaults, (val, key) => {
                this[key] = val
            })
            this.setSplash()
            this.active = true
            this.lastTimestamp = window.performance.now()
            requestAnimationFrame(this.processFrame)

            // Set up the audio oscillator
            this.oscillator = this.audioContext.createOscillator()
            this.oscillator.type = 'triangle'
            this.oscillator.frequency.value = MIN_FREQUENCY
            this.oscillator.connect(this.gainNode)
            this.oscillator.start()
        },

        jump() {
            // If the game isn't active, this is the player hitting enter to start
            if (!this.active) {
                this.startGame()
                return
            }

            // Prevent the player from rapidly hitting enter to get better jumps
            if (this.nextJumpVelocity) return

            if (this.velocity <= 0 && this.height < JUMP_WINDOW) {
                // Set the player's next velocity (for when they bounce off the trampoline)
                const accuracy = (JUMP_WINDOW - this.height) / JUMP_WINDOW
                this.nextJumpVelocity = Math.max(
                    this.lastJumpVelocity + (JUMP_POTENTIAL * accuracy),
                    MIN_JUMP_VELOCITY,
                )
            } else if (this.velocity >= 0 && this.missedJump && this.height < MISSED_WINDOW) {
                // The player jumped after technically hitting the trampoline
                // Apply their new velocity immediately since they already bounced
                const accuracy = (MISSED_WINDOW - this.height) / MISSED_WINDOW
                this.velocity = Math.max(
                    this.missedJump + HALF_POTENTIAL + (HALF_POTENTIAL * accuracy),
                    MIN_JUMP_VELOCITY,
                )
                this.lastJumpVelocity = this.velocity
            }
        },

        processFrame(timestamp) {
            // Request another frame if we aren't due for an update yet
            if (timestamp < (this.lastTimestamp + STEP_MS)) {
                return requestAnimationFrame(this.processFrame)
            }

            // Perform updates based on the time that has passed
            this.timeDelta += timestamp - this.lastTimestamp
            this.lastTimestamp = timestamp
            while (this.timeDelta >= STEP_MS) {
                if (!this.loop()) return
                this.timeDelta -= STEP_MS
            }

            // Request the next frame
            requestAnimationFrame(this.processFrame)
        },

        loop() {
            // Ensure we haven't been quit
            if (!this.active) return false

            // Apply physics for this frame
            this.height = Math.min(Math.max(this.height + this.velocity, 0), 100)
            this.oscillator.frequency.value = MIN_FREQUENCY + ((MAX_FREQUENCY - MIN_FREQUENCY) * (this.height / 100))

            // Bounce the player back if they hit the ceiling
            if (this.height === 100 && this.velocity > 0) this.velocity = 0.01

            const lastTickVelocity = this.velocity
            this.velocity = Math.max(this.velocity - VELOCITY_DECAY, MAX_FALLING_VELOCITY)
            this.time = Math.max(0, this.time - STEP_MS)

            // Add points if the user just reached their peak
            if (lastTickVelocity >= 0 && this.velocity < 0) {
                this.scoreIncrease = this.scoreHeight
                this.score += this.scoreHeight
            }

            // Check if the player has hit the trampoline
            if (this.height === 0) {
                if (this.nextJumpVelocity) {
                    // The player jumped in time, apply their new velocity
                    this.velocity = this.nextJumpVelocity
                    this.nextJumpVelocity = null
                    this.missedJump = null
                } else {
                    // The player didn't jump, make their new velocity a bit lower than their last one
                    this.velocity = Math.max(Math.abs(this.lastJumpVelocity * MISS_PCT_DECAY), MIN_MISS_VELOCITY)

                    // Store their last velocity in case they jump in the missed window
                    this.missedJump = this.lastJumpVelocity
                }
                this.lastJumpVelocity = this.velocity
                this.nextJumpVelocity = null
            }

            // Check if the game is over
            if (this.time === 0) {
                this.active = false
                this.oscillator.stop()
                this.oscillator = null
                this.setSplash('GAME OVER\nPress Enter to play again, or Esc to quit.')

                // Update the high score if they beat it
                if (this.score > this.bestTrampoline) this.setBestTrampoline(this.score)

                // Prevent the player from accidentally dismissing the game over screen
                this.ignoreEnter = true
                setTimeout(() => {
                    this.ignoreEnter = false
                }, 1000)

                return false
            }

            return true
        },

        onKeyDown(e) {
            if (e.repeat || this.ignoreEnter) return
            if (e.key === 'Enter') this.jump()
        },

        ...mapMutations(['setBestTrampoline', 'setSplash']),
    },

    watch: {
        sound(val) {
            this.gainNode.gain.value = val ? 1 : 0
        },
    },

    async mounted() {
        this.setSplash('Press Enter to jump on the trampoline.\nTime your jumps to get the highest score you can!')

        // Prevent the keystroke from the shell from starting the game
        await sleep(0)
        window.addEventListener('keydown', this.onKeyDown)
        this.$listenFor('appClick', this.jump)
    },

    beforeUnmount() {
        this.active = false
        if (this.oscillator) this.oscillator.stop()
        this.gainNode.disconnect()
        this.audioContext.close()
        window.removeEventListener('keydown', this.onKeyDown)
        this.setSplash()
    },
}
</script>

<style lang="scss" scoped>
$trampoline-height: 48px;
$character-height: 24px;
$tick-height: 24px;

.game {
    display: flex;
    position: relative;
    justify-content: center;
    height: 100%;

    &__score {
        position: absolute;
        top: 10px;
        left: 10px;
    }

    &__container, &__ticks {
        display: inline-flex;
        flex-direction: column;
    }

    &__ticks {
        padding-bottom: $trampoline-height + $character-height;
        margin-right: 40px;
        justify-content: space-between;
    }

    &__tick {
        text-align: right;
    }

    &__trampoline {
        flex: 0 0 $trampoline-height;
    }

    &__trampoline--ascii {
        position: relative;
        top: -26px;
    }

    &__field {
        flex: 1;
        align-self: center;
        margin-top: $tick-height / 2;
        margin-bottom: $character-height + $tick-height / 2;
    }

    &__character {
        position: relative;
        top: 0%;
    }

    @media(max-width: 640px) {
        justify-content: flex-end;

        &__ticks {
            order: 2;
        }
    }
}
</style>
