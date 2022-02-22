export default (message) => {
    const speech = new SpeechSynthesisUtterance(message)
    window.speechSynthesis?.speak(speech)
}
