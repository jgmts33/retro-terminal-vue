import Speech from 'speak-tts'

import store from '@/store'

let speech = null
try {
    speech = new Speech()
} catch {
    console.warn('Speech synthesis not supported.')
}

export default (text, opts, instanceKey) => {
    // Skip if speech isn't available, sound is off, or this is from a program that was escaped
    if (!speech || !store.state.sound || (instanceKey && instanceKey !== store.state.instanceKey)) return

    try {
        speech.init({
            lang: 'en-US',
            ...opts,
        }).then((data) => {
            speech.setVoice(data.voices[0].name)
            speech.speak({ text })
        })
        return () => speech.cancel()
    } catch {
        console.warn('Failed to speak!')
    }
}
