import { createStore } from 'vuex'

const store = createStore({
    state: {
        glitching: false,
        sound: false,
    },

    mutations: {
        toggleGlitching(state) {
            state.glitching = !state.glitching
        },

        toggleSound(state) {
            state.sound = !state.sound
        },
    },
})

export default store
