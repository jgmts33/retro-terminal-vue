import { createStore } from 'vuex'

const store = createStore({
    state: {
        sound: false,
    },

    mutations: {
        toggleSound(state) {
            state.sound = !state.sound
        },
    },
})

export default store
