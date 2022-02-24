import { createStore } from 'vuex'

const store = createStore({
    state: {
        glitching: false,
        sound: false,
        theme: null,
    },

    mutations: {
        toggleGlitching(state) {
            state.glitching = !state.glitching
        },

        toggleSound(state) {
            state.sound = !state.sound
        },

        setTheme(state, theme) {
            state.theme = theme
        },
    },
})

export default store
