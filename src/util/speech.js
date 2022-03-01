import Speech from 'speak-tts'

import store from '@/store'

let speech = null
try {
    speech = new Speech()
} catch {
    console.warn('Speech synthesis not supported.')
}

export default async (text, opts, instanceKey) => {
    // Skip if speech isn't available, sound is off, or this is from a program that was escaped
    if (!speech || !store.state.sound || (instanceKey && instanceKey !== store.state.instanceKey)) return

    try {
        const data = await speech.init({
            lang: 'en-US',
            ...opts,
        })
        speech.setVoice(data.voices[0].name)
        speech.speak({ text })
    } catch {
        console.warn('Failed to speak!')
    }
}
