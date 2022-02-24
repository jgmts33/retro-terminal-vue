import _ from 'lodash'

import store from '@/store'
import soundFiles from '../sounds/keystroke*.mp3'

const keystrokes = _.map(soundFiles, (path) => new Audio(path.default))

export default () => {
    const sound = _.sample(keystrokes)
    const isPlaying = (!sound.paused || sound.currentTime) && !sound.ended
    if (!store.state.sound || sound.readyState < 4 || isPlaying) return
    sound.play()
}
