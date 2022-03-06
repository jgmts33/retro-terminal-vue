import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'

// Configure persistence
const localPersistence = new VuexPersistence({
    storage: window.localStorage,

    reducer: (state) => ({
        bestTrampoline: state.bestTrampoline,
        sound: state.sound,
    }),

    filter: (mutation) => [
        'setBestTrampoline',
        'toggleSound',
    ].includes(mutation.type),
})

// Create the actual store
const store = createStore({
    plugins: [localPersistence.plugin],

    state: {
        bestTrampoline: null,
        firstShell: true,
        firstHelp: true,
        glitching: false,
        instanceKey: 0,
        process: undefined,
        sound: false,
        splash: null,
        theme: null,
    },

    mutations: {
        setBestTrampoline(state, score) {
            state.bestTrampoline = score
        },

        setFirstShell(state, val) {
            state.firstShell = val
        },

        setFirstHelp(state, val) {
            state.firstHelp = val
        },

        toggleGlitching(state) {
            state.glitching = !state.glitching
        },

        toggleSound(state) {
            state.sound = !state.sound
        },

        incrementInstanceKey(state) {
            state.instanceKey += 1
        },

        setProcess(state, process) {
            state.process = process
        },

        setSplash(state, splash) {
            state.splash = splash
        },

        setTheme(state, theme) {
            state.theme = theme
        },

        reboot(state) {
            state.firstShell = true
            state.firstHelp = true
            state.glitching = false
            state.splash = null
            state.theme = null
        },
    },
})

export default store
