import Speech from 'speak-tts'

let speech = null
try {
    speech = new Speech()
} catch {
    console.warn('Speech synthesis not supported.')
}

export default async (text, opts) => {
    if (!speech) return
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
